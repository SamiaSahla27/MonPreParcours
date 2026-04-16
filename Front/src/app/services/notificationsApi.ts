const DEFAULT_BASE_URL = import.meta.env.VITE_BACKEND_URL ?? '/api';

function joinUrl(baseUrl: string, path: string) {
  const normalizedBase = baseUrl.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export type AppNotificationType =
  | 'mentor_request_pending'
  | 'mentor_request_accepted'
  | 'mentor_request_refused';

export type AppNotification = {
  id: string;
  type: AppNotificationType;
  title: string;
  body?: string | null;
  mentorId?: string | null;
  etudiantId?: string | null;
  requestId?: string | null;
  conversationId?: string | null;
  requestStatus?: 'pending' | 'accepted' | 'refused';
  requesterEmail?: string;
  createdAt: string;
};

export async function listNotifications(params: {
  token: string;
  baseUrl?: string;
}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(joinUrl(baseUrl, '/notifications'), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${params.token}`,
    },
  });

  if (!res.ok) throw new Error(`NOTIFICATIONS_LIST_FAILED_${res.status}`);
  return (await res.json()) as AppNotification[];
}

export async function deleteNotification(params: {
  token: string;
  notificationId: string;
  baseUrl?: string;
}) {
  const baseUrl = params.baseUrl ?? DEFAULT_BASE_URL;
  const res = await fetch(
    `${joinUrl(baseUrl, '/notifications')}/${encodeURIComponent(params.notificationId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    },
  );

  if (!res.ok) throw new Error(`NOTIFICATION_DELETE_FAILED_${res.status}`);
  return (await res.json()) as { ok: true };
}
