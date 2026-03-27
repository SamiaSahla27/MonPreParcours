import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { ORIENTATION_QUIZ_QUESTIONS } from "../orientation/mockData";
import { OrientationIASession } from "./OrientationIASession";

function renderSession() {
  return render(
    <MemoryRouter>
      <OrientationIASession />
    </MemoryRouter>
  );
}

describe("OrientationIASession", () => {
  it("renders the initial immersive quiz state", () => {
    renderSession();

    expect(screen.getByText("Session active")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-question-full")).toHaveTextContent(
      ORIENTATION_QUIZ_QUESTIONS[0].prompt
    );
    expect(screen.getByText("Cloturer la session")).toBeInTheDocument();
  });

  it("moves from one quiz question to the next after selecting a choice", async () => {
    renderSession();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Concevoir des produits tech utiles/i,
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId("quiz-question-full")).toHaveTextContent(
        ORIENTATION_QUIZ_QUESTIONS[1].prompt
      );
    });
  });

  it("closes and archives the session when clicking close", async () => {
    renderSession();

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
