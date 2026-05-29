const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '/api';

function joinUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export type MentorContactRequest = {
  id: string;
  mentorId: string;
  etudiantId: string;
  etudiantEmail: string;
  message?: string | null;
  status: 'pending' | 'accepted' | 'refused';
  createdAt: string;
  respondedAt?: string | null;
  conversationId: string;
  alreadyPending?: boolean;
  alreadyAnswered?: boolean;
};

export async function createMentorRequest(params: {
  token: string;
  mentorId: string;
  message?: string;
  baseUrl?: string;
}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(joinUrl(baseUrl, '/mentor-requests'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({ mentorId: params.mentorId, message: params.message }),
  });

  if (!res.ok) throw new Error(`MENTOR_REQUEST_CREATE_FAILED_${res.status}`);
  return (await res.json()) as MentorContactRequest;
}

export async function listIncomingMentorRequests(params: {
  token: string;
  baseUrl?: string;
}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(joinUrl(baseUrl, '/mentor-requests/incoming'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });

  if (!res.ok) throw new Error(`MENTOR_REQUESTS_LIST_FAILED_${res.status}`);
  return (await res.json()) as MentorContactRequest[];
}

export async function decideMentorRequest(params: {
  token: string;
  requestId: string;
  decision: 'accepted' | 'refused';
  baseUrl?: string;
}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(
    `${joinUrl(baseUrl, '/mentor-requests')}/${encodeURIComponent(params.requestId)}/decision`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({ decision: params.decision }),
    },
  );

  if (!res.ok) throw new Error(`MENTOR_REQUEST_DECISION_FAILED_${res.status}`);
  return (await res.json()) as MentorContactRequest;
}
