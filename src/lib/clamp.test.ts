import { describe, expect, it } from "vitest";
import { clamp } from "./clamp";

describe("clamp", () => {
  it("returns n when it is within [min, max]", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("returns min when n is below min", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
  });

  it("returns max when n is above max", () => {
    expect(clamp(42, 0, 10)).toBe(10);
  });

  it("keeps the bounds themselves", () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("returns min when n is NaN", () => {
    expect(clamp(Number.NaN, 2, 10)).toBe(2);
  });
});
