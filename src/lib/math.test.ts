import { describe, expect, it } from "vitest";
import { average } from "./math";

describe("average", () => {
  it("returns the mean of the values", () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });

  it("returns 0 for an empty list", () => {
    expect(average([])).toBe(0);
  });
});
