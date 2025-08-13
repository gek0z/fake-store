import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Ensure DOM is cleaned between tests to avoid cross-test interference
afterEach(() => {
  cleanup();
});

// JSDOM doesn't implement pointer capture APIs used by Radix UI
// Provide no-op polyfills so components relying on them don't crash in tests
if (!(Element.prototype as any).hasPointerCapture) {
  (Element.prototype as any).hasPointerCapture = () => false;
}
if (!(Element.prototype as any).setPointerCapture) {
  (Element.prototype as any).setPointerCapture = () => {};
}
if (!(Element.prototype as any).releasePointerCapture) {
  (Element.prototype as any).releasePointerCapture = () => {};
}

// scrollIntoView is used by Radix Select to bring the active option into view
if (!(Element.prototype as any).scrollIntoView) {
  (Element.prototype as any).scrollIntoView = () => {};
}

// Mock Next.js Image to a plain img for JSDOM, dropping Next-specific boolean props
vi.mock("next/image", () => {
  return {
    default: (props: any) => {
      const { fill, priority, loader, unoptimized, ...rest } = props;
      return React.createElement("img", rest);
    },
  };
});
