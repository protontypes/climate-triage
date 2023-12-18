import type { MDXComponents } from "mdx/types";

// Used for supporting MDX: https://nextjs.org/docs/app/building-your-application/configuring/mdx
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components
  };
}
