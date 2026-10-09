import type { Data } from "@/types/types";
import data from "../data/data.json";

// Typed explicitly: otherwise TypeScript infers the type from whatever data.json currently
// holds, and an empty list in it (e.g. no categories) becomes `never[]` and fails typecheck.
export const getData = (): Data => data;
