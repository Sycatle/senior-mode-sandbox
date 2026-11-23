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

  it("uses the compatibility form of ligatures", () => {
    expect(slugify("ﬁle")).toBe("file");
  });

  it("uses the compatibility form of full-width letters", () => {
    expect(slugify("Ｈｅｌｌｏ")).toBe("hello");
  });

  it("maps ß to ss", () => {
    expect(slugify("Straße")).toBe("strasse");
    expect(slugify("ß")).toBe("ss");
    expect(slugify("ẞ")).toBe("ss");
  });

  it("maps æ to ae in any case", () => {
    expect(slugify("Ærø")).toBe("aero");
    expect(slugify("æ")).toBe("ae");
    expect(slugify("Æ")).toBe("ae");
  });

  it("maps œ to oe in any case", () => {
    expect(slugify("Œuvre")).toBe("oeuvre");
    expect(slugify("œ")).toBe("oe");
    expect(slugify("Œ")).toBe("oe");
  });

  it("maps ø to o in any case", () => {
    expect(slugify("ø")).toBe("o");
    expect(slugify("Ø")).toBe("o");
  });

  it("maps ł to l in any case", () => {
    expect(slugify("Łódź")).toBe("lodz");
    expect(slugify("ł")).toBe("l");
    expect(slugify("Ł")).toBe("l");
  });

  it("maps đ to d in any case", () => {
    expect(slugify("Đà Nẵng")).toBe("da-nang");
    expect(slugify("đ")).toBe("d");
    expect(slugify("Đ")).toBe("d");
  });
});
