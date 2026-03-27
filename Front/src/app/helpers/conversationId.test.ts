import { conversationIdFor } from "./conversationId";
import { describe, expect, it } from "vitest";

describe("conversationIdFor", () => {
  it("builds deterministic id", () => {
    expect(conversationIdFor("m1", "e1")).toBe("mentor:m1|etudiant:e1");
  });
});
