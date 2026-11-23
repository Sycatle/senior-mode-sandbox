import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const call = (path: string, headers?: Record<string, string>, method = "GET") =>
  proxy(new NextRequest(`http://localhost${path}`, { headers, method }));

describe("proxy", () => {
  it.each(["/api/anything", "/api"])("refuses %s without a key", async (path) => {
    const res = call(path);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "missing_api_key" });
  });

  it("refuses a blank key and a POST without a key", () => {
    expect(call("/api/x", { "x-api-key": "  " }).status).toBe(401);
    expect(call("/api/x", undefined, "POST").status).toBe(401);
  });

  it("lets a request with a key through", () => {
    expect(call("/api/x", { "X-API-Key": "v" }).headers.get("x-middleware-next")).toBe("1");
  });

  it("lets exactly /api/health through, with or without a query", () => {
    expect(call("/api/health").headers.get("x-middleware-next")).toBe("1");
    expect(call("/api/health?a=1").headers.get("x-middleware-next")).toBe("1");
  });

  it("refuses /api/health/details and /api/healthz", () => {
    expect(call("/api/health/details").status).toBe(401);
    expect(call("/api/healthz").status).toBe(401);
  });
});
