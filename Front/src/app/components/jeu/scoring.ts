import type { Question } from "./types";

export function calculateQuestionPoints(
  question: Question,
  isCorrect: boolean,
  timeLeft: number,
  duration = 20,
) {
  if (question.isPoll) return 20;
  if (!isCorrect) return 0;
  return duration - timeLeft < 10 ? 100 : 50;
}

export function getScoreMessage(score: number) {
  if (score < 500) return "Tu viens de découvrir tes biais 🧠";
  if (score < 1000) return "Tu es sur la bonne voie ! 💪";
  return "Champion(ne) anti-stéréotypes ! 🏆";
}
