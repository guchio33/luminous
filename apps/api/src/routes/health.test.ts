import { describe, it, expect } from "vitest";
import { app } from "../app";

describe("GET /health", () => {
  it("ステータス ok を返す", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.timestamp).toBeDefined();
  });
});

describe("GET /", () => {
  it("API 情報を返す", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.name).toBe("Luminous API");
    expect(json.version).toBe("0.1.0");
  });
});
