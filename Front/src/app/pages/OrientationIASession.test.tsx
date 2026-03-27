import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OrientationQuestionsResponse } from "../orientation/types";
import { OrientationIASession } from "./OrientationIASession";

function renderSession() {
  return render(
    <MemoryRouter>
      <OrientationIASession />
    </MemoryRouter>
  );
}

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
  it("renders the initial immersive quiz state", async () => {
    renderSession();

    expect(await screen.findByText("Session active")).toBeInTheDocument();
    expect(await screen.findByTestId("quiz-question-full")).toHaveTextContent(
      INTRO_RESPONSE.questions[0].prompt
    );
    expect(screen.getByText("Cloturer la session")).toBeInTheDocument();
  });

  it("moves from one quiz question to the next after selecting a choice", async () => {
    renderSession();

    fireEvent.click(
      await screen.findByRole("button", {
        name: /Lycee/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full")).toHaveTextContent(
        INTRO_RESPONSE.questions[1].prompt
      );
    });
  });

  it("closes and archives the session when clicking close", async () => {
    renderSession();

    await screen.findByText("Session active");
    fireEvent.click(screen.getByRole("button", { name: /Cloturer la session/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Cette session est terminee et archivee.")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("button", { name: /Exporter en PDF/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Imprimer/i })).toBeInTheDocument();
  });

});
