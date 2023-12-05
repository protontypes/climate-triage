import type { Project } from "@/types/apiTypes";

export async function GetAllProjects() {
  const response = await fetch(
    "https://ost.ecosyste.ms/api/v1/issues/openclimateaction?per_page=300"
  );
  const data = (await response.json()) as Project[];
  return data;
}
