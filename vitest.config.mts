/// <reference types="vitest/globals" />
// ^ Types the `globals: true` test functions (describe, it, expect) for the whole project:
// tsconfig includes this file. A tsconfig `types` entry would instead stop the automatic
// inclusion of every other @types package.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true
  }
});
