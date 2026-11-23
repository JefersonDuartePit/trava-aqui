import { randomUUID } from "node:crypto";
import { SEED_ACTIVITIES } from "./seed";
import type { Activity, NewActivity } from "./types";

// Onde as atividades ficam guardadas.
// - Sem configuração: memória do servidor (some ao reiniciar). Bom para rodar local.
// - Com UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN: Redis da Upstash, que
//   funciona na Vercel, onde cada requisição pode cair numa instância diferente.

export interface ActivityStore {
  list(): Promise<Activity[]>;
  get(id: string): Promise<Activity | undefined>;
  create(input: NewActivity): Promise<Activity>;
}

function newActivity(input: NewActivity): Activity {
  return { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
}

function newestFirst(activities: Activity[]): Activity[] {
  return [...activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export class MemoryStore implements ActivityStore {
  private activities: Activity[];

  constructor(seed: Activity[] = SEED_ACTIVITIES) {
    this.activities = [...seed];
  }

  async list() {
    return newestFirst(this.activities);
  }

  async get(id: string) {
    return this.activities.find((activity) => activity.id === id);
  }

  async create(input: NewActivity) {
    const activity = newActivity(input);
    this.activities.push(activity);
    return activity;
  }
}

const KEY = "trava-aqui:activities";

/** Upstash Redis pela API REST, sem dependência extra. Guarda a lista inteira numa chave. */
export class UpstashStore implements ActivityStore {
  constructor(
    private readonly url: string,
    private readonly token: string,
  ) {}

  private async command(args: string[]): Promise<unknown> {
    const response = await fetch(this.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Upstash respondeu ${response.status}`);
    return ((await response.json()) as { result: unknown }).result;
  }

  private async readAll(): Promise<Activity[]> {
    const raw = await this.command(["GET", KEY]);
    if (typeof raw !== "string") {
      await this.command(["SET", KEY, JSON.stringify(SEED_ACTIVITIES)]);
      return [...SEED_ACTIVITIES];
    }
    return JSON.parse(raw) as Activity[];
  }

  async list() {
    return newestFirst(await this.readAll());
  }

  async get(id: string) {
    return (await this.readAll()).find((activity) => activity.id === id);
  }

  async create(input: NewActivity) {
    const activity = newActivity(input);
    const all = await this.readAll();
    await this.command(["SET", KEY, JSON.stringify([...all, activity])]);
    return activity;
  }
}

let store: ActivityStore | undefined;

export function getStore(): ActivityStore {
  if (!store) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    store = url && token ? new UpstashStore(url, token) : new MemoryStore();
  }
  return store;
}
