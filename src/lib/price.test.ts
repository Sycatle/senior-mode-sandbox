import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats zero", () => {
    expect(formatPrice(0)).toBe("0,00\u202f€");
  });

  it("formats a few cents", () => {
    expect(formatPrice(5)).toBe("0,05\u202f€");
  });

  it("formats cents as euros with a comma", () => {
    expect(formatPrice(1234)).toBe("12,34\u202f€");
  });
});
