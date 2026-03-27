import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OrientationQuestionsResponse } from "../orientation/types";
import { OrientationIASession } from "./OrientationIASession";

const INTRO_RESPONSE: OrientationQuestionsResponse = {
  stage: "intro",
  questions: [
    {
      id: "education-level",
      prompt: "Quel est ton niveau actuel ?",
      inputPlaceholder: "Ex: Premiere, Terminale...",
      options: [
        { id: "lycee", label: "Lycee" },
        { id: "terminal", label: "Terminale" },
      ],
    },
    {
      id: "motivation-core",
      prompt: "Quelle mission te motive le plus ?",
      inputPlaceholder: "Ex: Construire des apps",
      options: [
        { id: "build", label: "Construire" },
        { id: "support", label: "Accompagner" },
      ],
    },
  ],
};

let fetchMock: ReturnType<typeof vi.fn>;

function renderSession() {
  return render(
    <MemoryRouter>
      <OrientationIASession />
    </MemoryRouter>
  );
}

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => INTRO_RESPONSE,
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("OrientationIASession", () => {
  it("affiche la premiere question du questionnaire API", async () => {
    renderSession();

    expect(await screen.findByText("Session active")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-question-full").textContent).toContain(
      INTRO_RESPONSE.questions[0].prompt
    );
  });

  it("permet de cloturer et voir l'etat archive", async () => {
    renderSession();

    fireEvent.click(await screen.findByRole("button", { name: /Cloturer la session/i }));

    expect(
      await screen.findByText(/Cette session est terminee et archivee/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Exporter en PDF/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Imprimer/i })).toBeInTheDocument();
  });
});