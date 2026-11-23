import { describe, expect, it } from "vitest";
import { formatPercent } from "./percent";

describe("formatPercent", () => {
  it("rounds a ratio to the unit with a plain space before %", () => {
    expect(formatPercent(0.256)).toBe("26 %");
  });

  it("formats zero as 0 %", () => {
    expect(formatPercent(0)).toBe("0 %");
  });
});
