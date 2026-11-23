import { describe, expect, it } from "vitest";
import { isLeapYear, isWeekend } from "./date";

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

describe("isLeapYear", () => {
  it("returns true for 2024 (divisible by 4)", () => {
    expect(isLeapYear(2024)).toBe(true);
  });

  it("returns true for 2000 (divisible by 400)", () => {
    expect(isLeapYear(2000)).toBe(true);
  });

  it("returns false for 1900 (divisible by 100 but not 400)", () => {
    expect(isLeapYear(1900)).toBe(false);
  });

  it("returns false for 2023 (not divisible by 4)", () => {
    expect(isLeapYear(2023)).toBe(false);
  });
});
