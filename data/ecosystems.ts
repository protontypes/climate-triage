import type { Project } from "@/types/apiTypes";

const PROJECTS_URL = "https://ost.ecosyste.ms/api/v1/issues/openclimateaction?per_page=300";
const FETCH_TIMEOUT_MS = 30000;

export async function GetAllProjects() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(PROJECTS_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
    }
    const data = (await response.json()) as Project[];
    return data;
  } finally {
    clearTimeout(timeout);
  }
}
