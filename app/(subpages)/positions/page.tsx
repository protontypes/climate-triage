import { getPositions } from "@/data/positions";
import { Metadata } from "next";
import { genPageMetadata } from "../../seo";

export function generateMetadata(): Metadata {
  return genPageMetadata({
    title: "Open Positions",
    description:
      "Curated open positions from climate and sustainability community sites. Static starter list; automated loaders per source are next."
  });
}

const sources = [
  { name: "Climatebase", url: "https://climatebase.org/jobs" },
  { name: "LF Energy", url: "https://lfenergy.org/careers" },
  { name: "OpenSustain.tech", url: "https://opensustain.tech" }
];

export default function Page() {
  const positions = getPositions();

  return (
    <article className="prose prose-lg mb-10 lg:prose-xl dark:prose-invert">
      <h1>Open Positions</h1>
      <p className="lead">
        A curated starter list of open roles from climate and sustainability community sites. Each
        entry links to the original posting; per-source automated loaders are the next step (see
        issue #58).
      </p>
      <h2>Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.name}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.name}
            </a>
          </li>
        ))}
      </ul>
      <h2>Positions ({positions.length})</h2>
      <ul>
        {positions.map((position) => (
          <li key={position.id}>
            <a href={position.url} target="_blank" rel="noreferrer">
              {position.title}
            </a>{" "}
            — {position.organization} ({position.location}
            {position.remote ? ", remote" : ""}, via {position.source}, posted {position.postedAt})
          </li>
        ))}
      </ul>
    </article>
  );
}
