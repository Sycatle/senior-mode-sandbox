import { describe, expect, it } from "vitest";
import { groupBy, unique, zip } from "./array";

describe("unique", () => {
  it("removes duplicates, keeping first-occurrence order", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it("returns an empty array for an empty input", () => {
    expect(unique([])).toEqual([]);
  });
});

describe("groupBy", () => {
  it("groups items by the key the callback returns", () => {
    expect(groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"))).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  it("returns an empty object for an empty input", () => {
    expect(groupBy([], () => "a")).toEqual({});
  });
});

describe("zip", () => {
  it("pairs items and stops at the shorter array", () => {
    expect(zip([1, 2, 3], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
    expect(zip([1], ["a", "b"])).toEqual([[1, "a"]]);
  });

  it("returns an empty array when either side is empty", () => {
    expect(zip([], ["a"])).toEqual([]);
    expect(zip([1], [])).toEqual([]);
  });
});
