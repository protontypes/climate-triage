#!/usr/bin/env bash
# Selects the good first issues that should be posted to social media and keeps
# track of the issues that were posted already.
#
#   so-me-posts.sh select  <issues.json> <state.json> <posts.json>
#   so-me-posts.sh reserve <state.json> <selection.json>
#   so-me-posts.sh record  <state.json> <selection.json> [uuid ...]
#
# The state file is a JSON object with the uuid of every issue in two lists:
#
#   posted     the issues that were posted successfully
#   reserved   the issues that were selected but not confirmed yet
#
# "reserve" marks the selected issues before they are posted, so a run that
# crashes after the post does not post the same issue again. "record" moves the
# issues that were posted to "posted" and releases the reservations of the
# issues that failed, so a failed post is tried again on the next run. The
# reservations of the other runs are kept, they are the ones that protect
# against a run that crashed.
#
# The state file is kept in the Actions cache of the workflow, one cache per
# platform. Deleting the cache entry makes the bot post the issues of the
# window again.
#
# Run it locally with the issues of the API:
#
#   curl -fsSL "https://ost.ecosyste.ms/api/v1/issues?sort=created_at&order=desc&per_page=300" -o issues.json
#   .github/scripts/so-me-posts.sh select issues.json state.json posts.json
#
# The window can be moved with CUTOFF, e.g. to check a fixed date range:
#
#   CUTOFF=2026-01-01T00:00:00.000Z .github/scripts/so-me-posts.sh select issues.json state.json posts.json
set -euo pipefail

# The ost API syncs the repositories with a couple of days of delay, so the
# selection looks back a week and relies on the state file to skip the issues
# that were posted already.
LOOKBACK_DAYS="${LOOKBACK_DAYS:-7}"
# Maximum number of issues that are posted per run.
MAX_POSTS="${MAX_POSTS:-3}"
# Bluesky allows 300 characters and Mastodon 500, the text is kept short on
# purpose so that it fits on both platforms.
MAX_TEXT_LENGTH="${MAX_TEXT_LENGTH:-280}"
POST_INTRO="${POST_INTRO:-A new good first issue available for contribution: }"
HASHTAGS="${HASHTAGS:- #climate #sustainability #opensource #opensustain #goodfirstissue #goodfirstissues}"

usage() {
  echo "usage: so-me-posts.sh select  <issues.json> <state.json> <posts.json>" >&2
  echo "       so-me-posts.sh reserve <state.json> <selection.json>" >&2
  echo "       so-me-posts.sh record  <state.json> <selection.json> [uuid ...]" >&2
  exit 1
}

# The cutoff is "LOOKBACK_DAYS days ago" in UTC. GNU date (the Linux runners)
# and BSD date (macOS) need a different option for the same result.
cutoff_date() {
  local days="$1"
  local epoch
  epoch=$(( $(date -u +%s) - days * 86400 ))
  date -u -d "@$epoch" +%Y-%m-%dT%H:%M:%S.000Z 2>/dev/null ||
    date -u -r "$epoch" +%Y-%m-%dT%H:%M:%S.000Z
}

# The state is a JSON object with a "posted" and a "reserved" list. A missing
# file means nothing was posted yet, a broken file is reported and treated as
# empty, so a corrupted state does not pass silently.
read_state() {
  local state_file="$1"
  if [[ ! -s "$state_file" ]]; then
    echo '{"posted":[],"reserved":[]}'
    return
  fi
  if ! jq -e 'type' "$state_file" >/dev/null 2>&1; then
    echo "Warning: $state_file is not valid JSON, it is treated as empty." >&2
    echo '{"posted":[],"reserved":[]}'
    return
  fi
  # A state file that only has a list of uuids is the format of an earlier
  # version of this script, it is read as the list of posted issues.
  jq -c '
    if type == "array" then {posted: ., reserved: []}
    elif type == "object" then {posted: (.posted // []), reserved: (.reserved // [])}
    else {posted: [], reserved: []}
    end
    | .posted = (.posted | map(tostring) | unique)
    | .reserved = (.reserved | map(tostring) | unique)
  ' "$state_file"
}

# The state is written through a temporary file, so a crash cannot leave a
# half written state behind.
write_state() {
  local state_file="$1"
  local content="$2"
  mkdir -p "$(dirname "$state_file")"
  printf '%s\n' "$content" >"$state_file.tmp"
  mv "$state_file.tmp" "$state_file"
}

# The uuids of a selection file: a list of issues, or a list of uuids.
uuids_from_file() {
  jq -c '
    (if type == "array" then . else [] end)
    | map(if type == "object" then (.uuid // empty) | tostring else tostring end)
    | unique
  ' "$1"
}

case "${1:-}" in
  select)
    [[ $# -eq 4 ]] || usage
    issues_file="$2"
    state_file="$3"
    posts_file="$4"

    if [[ -n "${CUTOFF:-}" ]]; then
      cutoff="$CUTOFF"
    else
      cutoff="$(cutoff_date "$LOOKBACK_DAYS")"
    fi
    echo "Selecting the issues that were created after $cutoff." >&2

    jq -c --arg cutoff "$cutoff" --arg intro "$POST_INTRO" --arg hashtags "$HASHTAGS" \
      --argjson max "$MAX_POSTS" --argjson max_length "$MAX_TEXT_LENGTH" \
      --argjson state "$(read_state "$state_file")" '
      # The uuid is used as a file name and as a header value, so only the
      # ones that are safe are used.
      def is_safe_uuid: test("^[A-Za-z0-9][A-Za-z0-9._-]*$");
      # The label is matched case insensitively, the API uses "Good First
      # Issue" and "Good first issue" as well.
      def is_good_first_issue:
        any(.labels[]?; ((if type == "object" then (.name // "") else . end) | ascii_downcase) == "good first issue");

      ($intro | sub(" +$"; "")) as $intro_text
      | ($hashtags | sub("^ +"; "")) as $tags
      | (if type == "array" then . else [] end)
      | [
          .[]
          | select((.uuid | tostring) | is_safe_uuid)
          | select((.created_at // "") > $cutoff)
          | select(is_good_first_issue)
          # A closed issue is not a contribution anymore.
          | select((.state // "open") == "open")
          # The url is the link of the post and its link preview.
          | select(((.html_url // "") | length) > 0)
        ]
      # The issues that were posted or reserved before are skipped.
      | map(select(((.uuid | tostring) as $id | (($state.posted + $state.reserved) | index($id)) == null)))
      # The order of the API response is not relied on, the oldest issue of the
      # window is posted first, so no issue falls out of the window unposted
      # when more issues are available than a run can post.
      | sort_by(.created_at)
      | .[0:$max]
      | map(
          (.project.language // "unknown") as $language
          | (.project.name // "unknown") as $name
          | .html_url as $url
          | (.title // "") as $title
          | ("(" + $language + ") - " + $name) as $info
          # The url and the hashtags are never cut, an issue that does not fit
          # with them is not posted at all.
          | select((($intro_text | length) + 1 + (([$url, $tags] | join(" ")) | length)) <= $max_length)
          # The project info is dropped when it does not fit, the title is
          # shortened. The text is the intro, the title and the fixed parts,
          # joined by a space, so two spaces are part of its length.
          | ([$info, $url, $tags] | join(" ")) as $fixed_with_info
          | ([$url, $tags] | join(" ")) as $fixed_without_info
          | (($intro_text | length) + 2 + ($fixed_with_info | length)) as $len_with_info
          | (($intro_text | length) + 2 + ($fixed_without_info | length)) as $len_without_info
          | (if $len_with_info <= $max_length
             then {fixed: $fixed_with_info, budget: ($max_length - $len_with_info)}
             else {fixed: $fixed_without_info, budget: ($max_length - $len_without_info)}
             end) as $plan
          | (if $plan.budget > 0 and ($title | length) > $plan.budget
             then ($title[0:($plan.budget - 1)] + "…")
             elif $plan.budget > 0
             then $title
             else ""
             end) as $title_text
          | {
              uuid: (.uuid | tostring),
              url: $url,
              text: (if ($title_text | length) > 0
                     then ($intro_text + " " + $title_text + " " + $plan.fixed)
                     else ($intro_text + " " + $plan.fixed)
                     end)
            }
        )
    ' "$issues_file" >"$posts_file"

    jq length "$posts_file"
    ;;
  reserve)
    [[ $# -eq 3 ]] || usage
    state_file="$2"
    selection_file="$3"

    ids="$(uuids_from_file "$selection_file")"
    write_state "$state_file" "$(jq -c --argjson ids "$ids" '.reserved = ((.reserved + $ids) | unique)' <<<"$(read_state "$state_file")")"
    jq -r '.reserved | length' "$state_file"
    ;;
  record)
    [[ $# -ge 3 ]] || usage
    state_file="$2"
    selection_file="$3"
    shift 3

    ids="$(printf '%s\n' "$@" | jq -R -s 'split("\n") | map(select(length > 0))')"
    selection="$(uuids_from_file "$selection_file")"
    # The issues that were posted are moved to "posted", the reservations of the
    # selection are released, so a failed post is tried again on the next run.
    # The reservations of the other runs are kept.
    write_state "$state_file" "$(jq -c --argjson ids "$ids" --argjson selection "$selection" '
      .posted = ((.posted + $ids) | unique)
      | .reserved = ((.reserved - $selection) | unique)
    ' <<<"$(read_state "$state_file")")"
    jq -r '.posted | length' "$state_file"
    ;;
  *)
    usage
    ;;
esac
