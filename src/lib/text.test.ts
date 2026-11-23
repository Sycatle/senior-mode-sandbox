import { describe, expect, it } from "vitest";
import { capitalize } from "./text";

describe("capitalize", () => {
  it("uppercases the first letter of a sentence", () => {
    expect(capitalize("hello world")).toBe("Hello world");
  });

  it("returns an empty string unchanged", () => {
    expect(capitalize("")).toBe("");
  });
});
