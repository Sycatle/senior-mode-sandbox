import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("GET /api/ping", () => {
  it("answers 200 with pong true", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ pong: true });
  });
});
