import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search } from "lucide-react";
import { listMentors, type MentorListItem } from "../services/mentorsApi";
import { Button } from "../components/ui/button";

function MentorCard({ mentor, onOpen }: { mentor: MentorListItem; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl border p-4 sm:p-5 transition-colors hover:bg-violet-50"
      style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "#F5F3FF" }}>
          {mentor.imageUrl ? (
            <img src={mentor.imageUrl} alt={mentor.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: "#7C3AED", fontWeight: 800 }}>
              ✦
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-base" style={{ color: "#1a1035", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {mentor.fullName}
              </div>
              <div className="text-sm" style={{ color: "#7C3AED", fontWeight: 700 }}>
                {mentor.profession}
              </div>
            </div>
            {mentor.location?.label && (
              <div className="text-xs px-2 py-1 rounded-full" style={{ background: "#EDE9FE", color: "#7C3AED", fontWeight: 700 }}>
                {mentor.location.label}
              </div>
            )}
          </div>

          <p className="text-sm mt-2 line-clamp-2" style={{ color: "#4B5563" }}>
            {mentor.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.skills.slice(0, 4).map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "#F5F3FF", color: "#6B7280", fontWeight: 700 }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

export function Mentors() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mentors, setMentors] = useState<MentorListItem[]>([]);

  const query = useMemo(() => initialQuery.trim(), [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listMentors({ q: query || undefined })
      .then((items) => {
        if (cancelled) return;
        setMentors(items);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(e?.message ?? "MENTORS_LOAD_FAILED");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const submit = () => {
    const q = inputValue.trim();
    setSearchParams(q ? { q } : {});
  };

  return (
    <div className="min-h-screen" style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl">
          <h1 style={{ color: "#1a1035", fontWeight: 900, letterSpacing: "-0.03em", fontSize: "2rem" }}>
            Trouver un mentor
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Recherche par métier, compétence, lieu ou nom.
          </p>

          <div
            className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl border"
            style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.18)" }}
          >
            <Search size={16} style={{ color: "#A78BFA", flexShrink: 0 }} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submit();
              }}
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Ex: Data Scientist, React, Paris…"
              style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            />
            <Button type="button" onClick={submit}>
              Rechercher
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Chargement…
            </p>
          ) : error ? (
            <div className="text-sm rounded-lg border px-3 py-2" style={{ background: "#FEF2F2", borderColor: "rgba(239,68,68,0.25)", color: "#B91C1C" }}>
              {error}
            </div>
          ) : mentors.length === 0 ? (
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Aucun mentor trouvé.
            </p>
          ) : (
            <div className="grid gap-3">
              {mentors.map((m) => (
                <MentorCard key={m.id} mentor={m} onOpen={() => navigate(`/mentors/${m.id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
