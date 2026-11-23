import { describe, expect, it } from "vitest";
import { RateLimiter } from "./rate-limit";

describe("RateLimiter", () => {
  it("bloqueia depois do limite e libera quando a janela passa", () => {
    const limiter = new RateLimiter(2, 1000);
    expect(limiter.allow("a", 0)).toBe(true);
    expect(limiter.allow("a", 10)).toBe(true);
    expect(limiter.allow("a", 20)).toBe(false);
    expect(limiter.allow("b", 20)).toBe(true);
    expect(limiter.allow("a", 1011)).toBe(true);
  });
});
