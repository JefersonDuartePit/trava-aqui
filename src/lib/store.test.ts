import { describe, expect, it } from "vitest";
import { MemoryStore } from "./store";
import { toStudentActivity } from "./types";

describe("MemoryStore", () => {
  it("começa com as atividades de exemplo", async () => {
    const store = new MemoryStore();
    expect((await store.list()).length).toBeGreaterThan(0);
    expect(await store.get("fotossintese")).toBeDefined();
  });

  it("cria uma atividade e lista a mais nova primeiro", async () => {
    const store = new MemoryStore([]);
    await store.create({ subject: "A", question: "Primeira?", expectedAnswer: "1" });
    const created = await store.create({ subject: "B", question: "Segunda?", expectedAnswer: "2" });
    const list = await store.list();
    expect(list).toHaveLength(2);
    expect(created.id).toBeTruthy();
    expect(await store.get(created.id)).toEqual(created);
  });

  it("devolve undefined para id inexistente", async () => {
    expect(await new MemoryStore([]).get("nao-existe")).toBeUndefined();
  });
});

describe("toStudentActivity", () => {
  it("remove a resposta esperada", async () => {
    const activity = (await new MemoryStore().get("fotossintese"))!;
    const student = toStudentActivity(activity);
    expect(student).not.toHaveProperty("expectedAnswer");
    expect(student.question).toBe(activity.question);
  });
});
