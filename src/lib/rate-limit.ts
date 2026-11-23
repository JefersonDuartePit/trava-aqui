// Limite simples de chamadas à IA por aparelho, para 40 celulares não estourarem o custo.
// É por instância do servidor (memória), então é um freio, não uma garantia.

export class RateLimiter {
  private hits = new Map<string, number[]>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
  ) {}

  allow(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    return true;
  }
}

export const aiLimiter = new RateLimiter(
  Number(process.env.AI_REQUESTS_PER_MINUTE) || 10,
  60_000,
);

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}
