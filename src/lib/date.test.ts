import { describe, expect, it } from "vitest";
import { isWeekend } from "./date";

describe("isWeekend", () => {
  it("returns true on a Saturday (UTC)", () => {
    expect(isWeekend(new Date("2026-11-21T12:00:00Z"))).toBe(true);
  });

  it("returns true on a Sunday (UTC)", () => {
    expect(isWeekend(new Date("2026-11-22T12:00:00Z"))).toBe(true);
  });

  it("returns false on a Monday (UTC)", () => {
    expect(isWeekend(new Date("2026-11-23T12:00:00Z"))).toBe(false);
  });
});
