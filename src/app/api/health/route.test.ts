import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/health", () => {
  it("returns status 200", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
  });

  it("returns application/json with exactly {\"status\":\"ok\"}", async () => {
    const res = await GET();

    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
