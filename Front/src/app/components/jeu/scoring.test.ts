import { describe, expect, it } from "vitest";
import { calculateQuestionPoints, getScoreMessage } from "./scoring";
import type { Question } from "./types";

const question = {
  id: 1,
  mod: "vrfx",
  modLabel: "Test",
  question: "Question test",
  opts: [{ e: "A", l: "Réponse" }],
  isPoll: false,
  correct: 0,
  colClass: "",
  fb: { type: "info", lbl: "Info", txt: "Explication" },
} satisfies Question;

describe("calculateQuestionPoints", () => {
  it("awards 100 points for a correct answer in under 10 seconds", () => {
    expect(calculateQuestionPoints(question, true, 11)).toBe(100);
  });

  it("awards 50 points for a slower correct answer", () => {
    expect(calculateQuestionPoints(question, true, 10)).toBe(50);
  });

  it("awards no points for an incorrect answer", () => {
    expect(calculateQuestionPoints(question, false, 18)).toBe(0);
  });

  it("awards 20 participation points for a poll", () => {
    expect(calculateQuestionPoints({ ...question, isPoll: true }, false, 2)).toBe(20);
  });
});

describe("getScoreMessage", () => {
  it("returns the message matching each score tier", () => {
    expect(getScoreMessage(200)).toContain("découvrir");
    expect(getScoreMessage(700)).toContain("bonne voie");
    expect(getScoreMessage(1200)).toContain("Champion");
  });
});
