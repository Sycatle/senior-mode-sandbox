import { describe, expect, it } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("joins lowercase words with single hyphens", () => {
    expect(slugify("hello world")).toBe("hello-world");
  });

  it("lowercases uppercase letters", () => {
    expect(slugify("Hello WORLD")).toBe("hello-world");
  });

  it("removes accents", () => {
    expect(slugify("Crème brûlée à l'été")).toBe("creme-brulee-a-l-ete");
  });

  it("collapses runs of spaces and separators into one hyphen", () => {
    expect(slugify("a   b---c___d")).toBe("a-b-c-d");
  });

  it("collapses punctuation into a single hyphen", () => {
    expect(slugify("hello, world! (really?)")).toBe("hello-world-really");
  });

  it("has no leading or trailing hyphen", () => {
    expect(slugify("  --Hello world--  ")).toBe("hello-world");
    expect(slugify("!hello!")).toBe("hello");
  });

  it("returns an empty string for an empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("returns an empty string when only separators remain", () => {
    expect(slugify(" - !? - ")).toBe("");
  });
});
