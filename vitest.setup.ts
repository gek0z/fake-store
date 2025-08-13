import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

// Mock Next.js Image to a plain img for JSDOM
vi.mock("next/image", () => {
  return {
    default: (props: any) => React.createElement("img", props),
  };
});
