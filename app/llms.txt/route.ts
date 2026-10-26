import { getData } from "../data-loader";
import { buildLlmsTxt } from "../llms";

// Required with `output: "export"` to prerender the handler.
export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(getData()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}
