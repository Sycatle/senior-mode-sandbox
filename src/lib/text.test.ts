import { describe, expect, it } from "vitest";
import { capitalize, countWords, truncate } from "./text";

describe("capitalize", () => {
  it("uppercases the first letter of a sentence", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});

describe("truncate", () => {
  it("cuts a string longer than max and appends an ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });

  it("returns a string no longer than max unchanged", () => {
    expect(truncate("hello", 5)).toBe("hello");
    expect(truncate("hi", 5)).toBe("hi");
  });
});

describe("countWords", () => {
  it("counts words separated by one or more spaces", () => {
    expect(countWords("a  b c")).toBe(3);
  });

  it("returns 0 for an empty or blank string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});
