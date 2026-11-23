import { describe, expect, it } from "vitest";
import { chunk, partition, unique } from "./array";

describe("unique", () => {
  it("removes duplicates, keeping first-occurrence order", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it("returns an empty array for an empty input", () => {
    expect(unique([])).toEqual([]);
  });
});

describe("chunk", () => {
  it("splits into chunks of the given size, the last one possibly shorter", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("returns an empty array for an empty input", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("throws a RangeError when size is below 1", () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow(RangeError);
    expect(() => chunk([1, 2, 3], -1)).toThrow(RangeError);
  });
});

describe("partition", () => {
  it("splits into matching and non-matching items, keeping order", () => {
    expect(partition([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([
      [2, 4],
      [1, 3],
    ]);
  });

  it("returns two empty arrays for an empty input", () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });
});
