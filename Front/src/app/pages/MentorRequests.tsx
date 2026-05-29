import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  decideMentorRequest,
  listIncomingMentorRequests,
  type MentorContactRequest,
} from '../services/mentorRequestsApi';
import { useAuth } from '../services/authStore';
import { Button } from '../components/ui/button';

export function MentorRequestsPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<MentorContactRequest[]>([]);
  const [actingIds, setActingIds] = useState<string[]>([]);

  useEffect(() => {
    if (auth.status !== 'authenticated' || auth.user?.role !== 'mentor' || !auth.token) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    listIncomingMentorRequests({ token: auth.token })
      .then((items) => {
        if (cancelled) return;
        setRequests(items);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? 'MENTOR_REQUESTS_LOAD_FAILED');
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auth.status, auth.user?.role, auth.token]);

  async function decide(requestId: string, decision: 'accepted' | 'refused') {
    if (!auth.token) return;
    setActingIds((prev) => [...prev, requestId]);

    try {
      const updated = await decideMentorRequest({
        token: auth.token,
        requestId,
        decision,
      });

      setRequests((prev) => prev.filter((r) => r.id !== requestId));

      if (decision === 'accepted') {
        navigate(
          `/mentorat?mentorId=${encodeURIComponent(updated.mentorId)}&etudiantId=${encodeURIComponent(updated.etudiantId)}`,
        );
      }
    } catch (e: any) {
      setError(e?.message ?? 'MENTOR_REQUEST_DECISION_FAILED');
    } finally {
      setActingIds((prev) => prev.filter((id) => id !== requestId));
    }
  }

  if (auth.status !== 'authenticated') {
    return (
      <div className="min-h-screen" style={{ background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Connecte-toi pour gérer les demandes de mentorat.
          </p>
        </main>
      </div>
    );
  }

  if (auth.user?.role !== 'mentor') {
    return (
      <div className="min-h-screen" style={{ background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Cette page est réservée aux mentors.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F7FF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-3">
          <h1 style={{ color: '#1a1035', fontWeight: 900, letterSpacing: '-0.03em', fontSize: '2rem' }}>
            Demandes de mentorat
          </h1>
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </div>

        <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
          Accepte ou refuse les demandes des étudiants avant d’ouvrir le chat/visio.
        </p>

        {loading ? (
          <p className="text-sm mt-6" style={{ color: '#6B7280' }}>
            Chargement…
          </p>
        ) : error ? (
          <div
            className="text-sm rounded-lg border px-3 py-2 mt-6"
            style={{ background: '#FEF2F2', borderColor: 'rgba(239,68,68,0.25)', color: '#B91C1C' }}
          >
            {error}
          </div>
        ) : requests.length === 0 ? (
          <div
            className="text-sm rounded-xl border px-4 py-3 mt-6"
            style={{ background: '#FFFFFF', borderColor: 'rgba(124,58,237,0.12)', color: '#6B7280' }}
          >
            Aucune demande en attente.
          </div>
        ) : (
          <div className="grid gap-3 mt-6">
            {requests.map((r) => {
              const acting = actingIds.includes(r.id);

              return (
                <div
                  key={r.id}
                  className="rounded-2xl border px-4 py-4"
                  style={{ background: '#FFFFFF', borderColor: 'rgba(124,58,237,0.12)' }}
                >
                  <div className="text-sm" style={{ color: '#1F2937', fontWeight: 800 }}>
                    Étudiant: {r.etudiantEmail}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    Reçue le {new Date(r.createdAt).toLocaleString()}
                  </div>

                  {r.message ? (
                    <p className="text-sm mt-2" style={{ color: '#4B5563' }}>
                      Message: {r.message}
                    </p>
                  ) : null}

                  <div className="mt-4 flex gap-2">
                    <Button type="button" disabled={acting} onClick={() => decide(r.id, 'accepted')}>
                      Accepter
                    </Button>
                    <Button type="button" variant="ghost" disabled={acting} onClick={() => decide(r.id, 'refused')}>
                      Refuser
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
