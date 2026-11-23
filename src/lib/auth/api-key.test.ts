import { describe, expect, it } from "vitest";
import { hasApiKey } from "./api-key";

describe("hasApiKey", () => {
  it("accepts a non-blank key, any header casing", () => {
    expect(hasApiKey(new Headers({ "X-API-Key": "v" }))).toBe(true);
  });

  it("refuses a missing, empty or blank key", () => {
    expect(hasApiKey(new Headers())).toBe(false);
    expect(hasApiKey(new Headers({ "x-api-key": "" }))).toBe(false);
    expect(hasApiKey(new Headers({ "x-api-key": "   " }))).toBe(false);
  });
});
