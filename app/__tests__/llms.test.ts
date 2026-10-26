import type { Data } from "@/types/types";
import { dummyRepositories } from "../../data/__tests__/test-data";
import { buildLlmsTxt } from "../llms";

const data: Data = {
  repositories: dummyRepositories,
  categories: [
    { id: "atmosphere", display: "Atmosphere", count: 2 },
    { id: "energy-systems", display: "Energy Systems", count: 5 },
    { id: "", display: "Uncategorized", count: 9 }
  ],
  languages: [{ id: "c-sharp", display: "C#", count: 1 }],
  tags: [{ id: "pytorch", display: "pytorch", count: 1 }]
};

describe("buildLlmsTxt", () => {
  const text = buildLlmsTxt(data);

  it("starts with the site name and description", () => {
    expect(text).toMatch(/^# ClimateTriage\n\n> /);
  });

  it("links categories by slug, most projects first", () => {
    expect(text).toContain(
      "## Categories\n- [Energy Systems](https://climatetriage.com/category/energy-systems): 5 projects\n- [Atmosphere]"
    );
  });

  it("skips entries without an id, as generateStaticParams does", () => {
    expect(text).not.toContain("Uncategorized");
  });

  it("uses the language slug, not the display name, in URLs", () => {
    expect(text).toContain("- [C#](https://climatetriage.com/language/c-sharp): 1 project");
  });

  it("leaves out tags", () => {
    expect(text).not.toContain("/tag/");
  });
});
