import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import {
  getMockAiGeneratedQuestionsBySegment,
  getPhase1QuestionsBySegment,
} from "../orientation/mockData";
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

function getSubmitButton(label: string) {
  return screen.getByRole("button", {
    name: new RegExp(escapeRegExp(label), "i"),
  });
}

async function completeSegmentAndPhase1(segment: "lyceen") {
  const phase1Questions = getPhase1QuestionsBySegment(segment);

  clickChoiceByLabel("Lyceen");
  fireEvent.click(getSubmitButton("Demarrer le quiz"));

  await waitFor(() => {
    expect(screen.getByTestId("quiz-question-full").textContent).toContain(
      phase1Questions[0].questionText
    );
  });

  for (const question of phase1Questions) {
    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        question.questionText
      );
    });

    const firstOption = question.options[0];

    if (firstOption) {
      clickChoiceByLabel(firstOption.title);
    }

    fireEvent.click(getSubmitButton(question.ui_config.submitButtonText));
  }
}

describe("OrientationIASession", () => {
  it("renders the segment personality entry question", () => {
    renderSession();

    expect(screen.getByText("Session active")).toBeTruthy();
    expect(screen.getByTestId("quiz-question-full").textContent).toContain(
      "Quel est ton type de personnalite ?"
    );
    expect(screen.getByText("Cloturer la session")).toBeTruthy();
  });

  it("moves to phase1 questions after selecting a personality segment", async () => {
    renderSession();

    const phase1Questions = getPhase1QuestionsBySegment("lyceen");

    clickChoiceByLabel("Lyceen");
    fireEvent.click(getSubmitButton("Demarrer le quiz"));

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        phase1Questions[0].questionText
      );
    });
  });

  it("allows going back during phase1 questions", async () => {
    renderSession();

    const phase1Questions = getPhase1QuestionsBySegment("lyceen");

    clickChoiceByLabel("Lyceen");
    fireEvent.click(getSubmitButton("Demarrer le quiz"));

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        phase1Questions[0].questionText
      );
    });

    clickChoiceByLabel(phase1Questions[0].options[0].title);
    fireEvent.click(getSubmitButton(phase1Questions[0].ui_config.submitButtonText));

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        phase1Questions[1].questionText
      );
    });

    fireEvent.click(getSubmitButton("Question precedente"));

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        phase1Questions[0].questionText
      );
    });
  });

  it("shows the 3 IA questions before chat and disables back navigation there", async () => {
    renderSession();

    await completeSegmentAndPhase1("lyceen");

    const aiQuestions = getMockAiGeneratedQuestionsBySegment("lyceen", 3);

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full").textContent).toContain(
        aiQuestions[0].questionText
      );
    });

    expect(
      screen.queryByRole("button", { name: /Question precedente/i })
    ).toBeNull();
    expect(screen.queryByText("Conseiller Orientation IA")).toBeNull();

    for (const question of aiQuestions) {
      await waitFor(() => {
        expect(screen.getByTestId("quiz-question-full").textContent).toContain(
          question.questionText
        );
      });

      const firstOption = question.options[0];

      if (firstOption) {
        clickChoiceByLabel(firstOption.title);
      }

      fireEvent.click(getSubmitButton(question.ui_config.submitButtonText));
    }

    await waitFor(() => {
      expect(screen.getByText("Conseiller Orientation IA")).toBeTruthy();
    });
  });

  it("closes and archives the session when clicking close", async () => {
    renderSession();

    fireEvent.click(screen.getByRole("button", { name: /Cloturer la session/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Cette session est terminee et archivee.")
      ).toBeTruthy();
    });

    expect(
      screen.getByRole("button", { name: /Exporter en PDF/i })
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /Imprimer/i })).toBeTruthy();
  });
});