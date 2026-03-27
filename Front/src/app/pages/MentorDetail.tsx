import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getMentor, type MentorDetail } from "../services/mentorsApi";
import { Button } from "../components/ui/button";
import { useAuth } from "../services/authStore";

export function MentorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();

  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getMentor(id)
      .then((m) => {
        if (cancelled) return;
        setMentor(m);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? "MENTOR_LOAD_FAILED");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const canContact = auth.status === "authenticated" && auth.user?.role === "etudiant";

  const contact = () => {
    if (!mentor) return;
    if (auth.status !== "authenticated" || !auth.user) {
      navigate(`/login`);
      return;
    }

    if (auth.user.role !== "etudiant") {
      return;
    }

    // Mentorat expects mentorId + etudiantId (user IDs)
    const mentorId = mentor.userId;
    const etudiantId = auth.user.id;

    navigate(`/mentorat?mentorId=${encodeURIComponent(mentorId)}&etudiantId=${encodeURIComponent(etudiantId)}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
          Retour
        </Button>

        {loading ? (
          <p className="text-sm mt-4" style={{ color: "#6B7280" }}>
            Chargement…
          </p>
        ) : error ? (
          <div className="text-sm rounded-lg border px-3 py-2 mt-4" style={{ background: "#FEF2F2", borderColor: "rgba(239,68,68,0.25)", color: "#B91C1C" }}>
            {error}
          </div>
        ) : !mentor ? (
          <p className="text-sm mt-4" style={{ color: "#6B7280" }}>
            Mentor introuvable.
          </p>
        ) : (
          <div className="mt-4 rounded-2xl border overflow-hidden" style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0" style={{ background: "#F5F3FF" }}>
                {mentor.imageUrl ? (
                  <img src={mentor.imageUrl} alt={mentor.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: "#7C3AED", fontWeight: 800 }}>
                    ✦
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 style={{ color: "#1a1035", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "2rem" }}>
                  {mentor.fullName}
                </h1>
                <div className="mt-1 text-sm" style={{ color: "#7C3AED", fontWeight: 800 }}>
                  {mentor.profession}
                </div>

                {mentor.location?.label && (
                  <div className="mt-2 text-sm" style={{ color: "#6B7280" }}>
                    {mentor.location.label}
                  </div>
                )}

                <p className="mt-4 text-sm" style={{ color: "#4B5563" }}>
                  {mentor.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {mentor.skills.map((s) => (
                    <span key={s} className="text-xs px-2 py-1 rounded-full" style={{ background: "#EDE9FE", color: "#7C3AED", fontWeight: 800 }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <Button type="button" onClick={contact} disabled={!canContact}>
                    Contacter (chat / visio)
                  </Button>
                  {auth.status !== "authenticated" ? (
                    <Button variant="ghost" type="button" onClick={() => navigate("/login")}>
                      Se connecter pour contacter
                    </Button>
                  ) : auth.user?.role !== "etudiant" ? (
                    <div className="text-sm rounded-lg border px-3 py-2" style={{ background: "#FFFBEB", borderColor: "rgba(245,158,11,0.25)", color: "#92400E" }}>
                      Seuls les étudiants peuvent contacter un mentor depuis l’annuaire.
                    </div>
                  ) : null}
                </div>

                {(mentor.phone || mentor.email) && (
                  <div className="mt-6 grid gap-1 text-sm" style={{ color: "#6B7280" }}>
                    {mentor.email && (
                      <div>
                        Email: <span style={{ color: "#1F2937", fontWeight: 700 }}>{mentor.email}</span>
                      </div>
                    )}
                    {mentor.phone && (
                      <div>
                        Téléphone: <span style={{ color: "#1F2937", fontWeight: 700 }}>{mentor.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
