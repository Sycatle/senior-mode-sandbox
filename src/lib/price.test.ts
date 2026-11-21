import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats cents as euros", () => {
    expect(formatPrice(1234)).toBe("12.34 €");
  });
});
