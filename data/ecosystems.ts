import type { Project } from "@/types/apiTypes";
import fs from "fs/promises";

// A trimmed copy of the API response, so PR builds don't call ecosyste.ms. See data/fixtures/README.md.
const SAMPLE_FILE = "data/fixtures/ecosystems-sample.json";

export async function GetAllProjects({ sample = false } = {}) {
  if (sample) {
    return JSON.parse(await fs.readFile(SAMPLE_FILE, "utf-8")) as Project[];
  }

  const response = await fetch(
    "https://ost.ecosyste.ms/api/v1/issues/openclimateaction?per_page=300"
  );
  const data = (await response.json()) as Project[];
  return data;
}
