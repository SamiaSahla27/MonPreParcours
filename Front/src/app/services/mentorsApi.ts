const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "/api";

export type MentorListItem = {
  id: string;
  userId: string;
  fullName: string;
  profession: string;
  description: string;
  skills: string[];
  location: { label: string; city?: string | null; country?: string | null } | null;
  imageUrl?: string | null;
};

export type MentorDetail = MentorListItem & {
  phone?: string | null;
  email?: string | null;
};

export async function listMentors(params: { q?: string; baseUrl?: string } = {}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const url = new URL(`${baseUrl.replace(/\/$/, "")}/mentors`);
  if (params.q?.trim()) url.searchParams.set("q", params.q.trim());

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MENTORS_LIST_FAILED_${res.status}`);
  return (await res.json()) as MentorListItem[];
}

export async function getMentor(id: string, params: { baseUrl?: string } = {}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/mentors/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`MENTOR_GET_FAILED_${res.status}`);
  return (await res.json()) as MentorDetail;
}

export async function listProfessions(params: { baseUrl?: string } = {}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/mentors/professions`);
  if (!res.ok) throw new Error(`PROFESSIONS_LIST_FAILED_${res.status}`);
  return (await res.json()) as string[];
}
