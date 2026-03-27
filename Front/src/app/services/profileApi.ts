const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";

export type MentorProfile = {
  id: string;
  userId: string;
  fullName: string;
  professionName: string | null;
  description: string;
  skills: string[];
  location: { label: string; city?: string | null; country?: string | null } | null;
  phone?: string | null;
  imageUrl?: string | null;
  emailPublic?: string | null;
} | null;

export type UpdateMentorProfileInput = {
  fullName?: string;
  professionName?: string;
  description?: string;
  skills?: string[];
  locationLabel?: string;
  city?: string;
  country?: string;
  phone?: string;
  imageUrl?: string;
  emailPublic?: string;
};

function authFetch(path: string, token: string, init: RequestInit = {}, baseUrl?: string) {
  const urlBase = baseUrl ?? DEFAULT_BASE_URL;
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  return fetch(`${urlBase.replace(/\/$/, "")}${path}`, { ...init, headers });
}

export async function getMyMentorProfile(token: string, params: { baseUrl?: string } = {}) {
  const res = await authFetch("/profile/mentor", token, {}, params.baseUrl);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PROFILE_GET_FAILED_${res.status}`);
  }

  const raw = await res.text();
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw) as MentorProfile;
  } catch {
    throw new Error("PROFILE_GET_INVALID_RESPONSE");
  }
}

export async function updateMyMentorProfile(
  token: string,
  body: UpdateMentorProfileInput,
  params: { baseUrl?: string } = {},
) {
  const res = await authFetch(
    "/profile/mentor",
    token,
    { method: "PUT", body: JSON.stringify(body) },
    params.baseUrl,
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `PROFILE_UPDATE_FAILED_${res.status}`);
  }
  const raw = await res.text();
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw) as MentorProfile;
  } catch {
    throw new Error("PROFILE_UPDATE_INVALID_RESPONSE");
  }
}
