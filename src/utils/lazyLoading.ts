/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy } from "react";

const pages = import.meta.glob("/src/pages/**/*.tsx");

export const lazyLoading = (path: string) => {
  const module = pages[`/src/pages/${path}.tsx`];

  if (!module) {
    throw new Error(`Page not found: ${path}`);
  }

  return lazy(module as any);
};
