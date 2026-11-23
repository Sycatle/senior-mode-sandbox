import { describe, expect, it } from "vitest";
import { unique } from "./unique";

describe("unique", () => {
  it("removes duplicates, keeping first-occurrence order", () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it("returns an empty array for an empty input", () => {
    expect(unique([])).toEqual([]);
  });
});
