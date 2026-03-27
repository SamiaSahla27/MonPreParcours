import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import {
  PRE_PROFILE_GENERIC_QUESTIONS,
  getMockAiGeneratedQuestionsBySegment,
  getPhase1QuestionsBySegment,
} from "../orientation/mockData";
import { BaseOrientationQuestion } from "../orientation/types";
import { OrientationIASession } from "./OrientationIASession";

function renderSession() {
  return render(
    <MemoryRouter>
      <OrientationIASession />
    </MemoryRouter>
  );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function clickChoiceByLabel(label: string) {
  fireEvent.click(
    screen.getByRole("button", {
      name: new RegExp(escapeRegExp(label), "i"),
    })
  );
}

function clickSubmitByLabel(label: string) {
  fireEvent.click(
    screen.getByRole("button", {
      name: new RegExp(escapeRegExp(label), "i"),
    })
  );
}

function answerQuestion(question: BaseOrientationQuestion) {
  if (question.options[0]) {
    clickChoiceByLabel(question.options[0].title);
  }

  if (question.type === "single" && !question.ui_config.allowFreeText) {
    return;
  }

  clickSubmitByLabel(question.ui_config.submitButtonText);
}

async function completeGenericQuestions() {
  for (const question of PRE_PROFILE_GENERIC_QUESTIONS) {
    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(question.questionText);
    });

    answerQuestion(question);
  }
}

async function completeSegmentAndPhase1(segment: "lyceen") {
  await completeGenericQuestions();

  await waitFor(() => {
    expect(screen.getByTestId("quiz-question-full").textContent).toContain(
      "Quel est ton type de personnalite ?"
    );
  });

  clickChoiceByLabel("Lyceen");

  const phase1Questions = getPhase1QuestionsBySegment(segment);

  for (const question of phase1Questions) {
    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(question.questionText);
    });

    answerQuestion(question);
  }
}

describe("OrientationIASession", () => {
  it("renders the first generic question before profile selection", () => {
    renderSession();

    expect(screen.getByText("Session active")).toBeTruthy();
    expect(screen.getByTestId("quiz-question-full").textContent).toContain(
      PRE_PROFILE_GENERIC_QUESTIONS[0].questionText
    );
  });

  it("shows profile selection only after 10 generic questions", async () => {
    renderSession();

    await completeGenericQuestions();

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        "Quel est ton type de personnalite ?"
      );
    });
  });

  it("allows going back in quiz phase before IA questions", async () => {
    renderSession();

    await completeGenericQuestions();

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        "Quel est ton type de personnalite ?"
      );
    });

    clickChoiceByLabel("Lyceen");

    const firstPhase1 = getPhase1QuestionsBySegment("lyceen")[0];

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(firstPhase1.questionText);
    });

    clickSubmitByLabel("Question precedente");

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        "Quel est ton type de personnalite ?"
      );
    });
  }, 20000);

  it("shows 3 IA questions then the dashboard template", async () => {
    renderSession();

    await completeSegmentAndPhase1("lyceen");

    const aiQuestions = getMockAiGeneratedQuestionsBySegment("lyceen", 3);

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(aiQuestions[0].questionText);
    });

    expect(screen.queryByRole("button", { name: /Question precedente/i })).toBeNull();

    for (const question of aiQuestions) {
      await waitFor(() => {
        expect(screen.getByTestId("quiz-question-full").textContent).toContain(question.questionText);
      });

      answerQuestion(question);
    }

    await waitFor(() => {
      expect(screen.getByText(/Dashboard de restitution Orientation IA/i)).toBeTruthy();
    });
  }, 20000);

  it("requires a modification prompt before creating a new generation", async () => {
    renderSession();

    await completeSegmentAndPhase1("lyceen");

    const aiQuestions = getMockAiGeneratedQuestionsBySegment("lyceen", 3);
    for (const question of aiQuestions) {
      await waitFor(() => {
        expect(screen.getByTestId("quiz-question-full").textContent).toContain(question.questionText);
      });

      answerQuestion(question);
    }

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Recherche #1/i })).toBeTruthy();
      expect(screen.getByRole("button", { name: /Recherche #2/i })).toBeTruthy();
    });

    expect(screen.queryByRole("button", { name: /^Envoyer$/i })).toBeNull();
    expect(screen.queryByPlaceholderText(/Pose une question sur ton parcours/i)).toBeNull();

    clickSubmitByLabel("Nouvelle generation");

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: /Nouvelle generation/i })).toBeTruthy();
    });

    clickSubmitByLabel("Generer maintenant");

    await waitFor(() => {
      expect(
        screen.getByText(/Precise ce que tu veux modifier avant de generer un nouveau resultat/i)
      ).toBeTruthy();
    });

    fireEvent.change(
      screen.getByPlaceholderText(/Ex: Renforcer les options en alternance/i),
      { target: { value: "Je veux plus d'options publiques en alternance" } }
    );
    clickSubmitByLabel("Generer maintenant");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Recherche #3/i })).toBeTruthy();
    });
  }, 20000);
});