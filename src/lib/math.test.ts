import { describe, expect, it } from "vitest";
import { average, median, variance } from "./math";

describe("average", () => {
  it("returns the mean of the values", () => {
    expect(average([1, 2, 3, 4])).toBe(2.5);
  });

  it("returns 0 for an empty list", () => {
    expect(average([])).toBe(0);
  });
});

describe("median", () => {
  it("returns the middle value of an odd-length array", () => {
    expect(median([3, 1, 2])).toBe(2);
  });
  it("averages the two middle values of an even-length array", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
  it("returns 0 for an empty array", () => {
    expect(median([])).toBe(0);
  });
});

describe("variance", () => {
  it("returns the population variance of the values", () => {
    expect(variance([1, 2, 3, 4])).toBe(1.25);
  });
  it("returns 0 for an empty array", () => {
    expect(variance([])).toBe(0);
  });
});
