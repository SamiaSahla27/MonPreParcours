import {
  CompleteOrientationSessionInput,
  CreateOrientationSessionInput,
  OrientationQuestionsResponse,
  OrientationSessionStartResponse,
  OrientationVerdictResponse,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(details || `Requete ${path} echouee (${response.status}).`);
  }

  return (await response.json()) as T;
}

export function fetchIntroQuestions(): Promise<OrientationQuestionsResponse> {
  return request<OrientationQuestionsResponse>("/orientation/questions/intro");
}

export function startOrientationSession(
  payload: CreateOrientationSessionInput
): Promise<OrientationSessionStartResponse> {
  return request<OrientationSessionStartResponse>("/orientation/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function completeOrientationSession(
  sessionId: string,
  payload: CompleteOrientationSessionInput
): Promise<OrientationVerdictResponse> {
  return request<OrientationVerdictResponse>(`/orientation/sessions/${sessionId}/complete`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

