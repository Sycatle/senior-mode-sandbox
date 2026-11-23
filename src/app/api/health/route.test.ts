import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// connection() only works inside a request scope.
vi.mock("next/server", () => ({ connection: async () => {} }));

describe("GET /api/health", () => {
  it("responds 200 with a JSON body {status: 'ok'}", async () => {
    const res = await GET();

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual({ status: "ok" });
  });
});
