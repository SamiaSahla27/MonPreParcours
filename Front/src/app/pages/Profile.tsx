import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../services/authStore";
import * as profileApi from "../services/profileApi";

function splitSkills(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProfilePage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const isMentor = auth.user?.role === "mentor";
  const canEditMentor = Boolean(auth.token && isMentor);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    professionName: "",
    description: "",
    skillsCsv: "",
    locationLabel: "",
    city: "",
    country: "",
    phone: "",
    imageUrl: "",
    emailPublic: "",
  });

  useEffect(() => {
    if (auth.status === "anonymous") navigate("/login");
  }, [auth.status, navigate]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!auth.token || !isMentor) return;
      setLoading(true);
      setError(null);
      try {
        const p = await profileApi.getMyMentorProfile(auth.token);
        if (cancelled) return;
        setForm((prev) => ({
          ...prev,
          fullName: p?.fullName ?? "",
          professionName: p?.professionName ?? "",
          description: p?.description ?? "",
          skillsCsv: (p?.skills ?? []).join(", "),
          locationLabel: p?.location?.label ?? "",
          city: (p?.location?.city ?? "") || "",
          country: (p?.location?.country ?? "") || "",
          phone: p?.phone ?? "",
          imageUrl: p?.imageUrl ?? "",
          emailPublic: p?.emailPublic ?? "",
        }));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Impossible de charger le profil");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [auth.token, isMentor]);

  const initials = useMemo(() => {
    const src = (isMentor ? form.fullName : auth.user?.email) || "?";
    return src
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");
  }, [auth.user?.email, form.fullName, isMentor]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    if (!auth.token || !isMentor) return;

    setSaving(true);
    try {
      await profileApi.updateMyMentorProfile(auth.token, {
        fullName: form.fullName.trim() || undefined,
        professionName: form.professionName.trim() || undefined,
        description: form.description.trim() || undefined,
        skills: splitSkills(form.skillsCsv),
        locationLabel: form.locationLabel.trim() || undefined,
        city: form.city.trim() || undefined,
        country: form.country.trim() || undefined,
        phone: form.phone.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        emailPublic: form.emailPublic.trim() || undefined,
      });
      setSuccess("Profil mis à jour");
    } catch (e: any) {
      setError(e?.message ?? "Impossible d’enregistrer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)]" style={{ background: "#F8F7FF" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="rounded-2xl border bg-white p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div
                className="text-2xl sm:text-3xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: "#111827" }}
              >
                Profil
              </div>
              <div className="mt-1 text-sm" style={{ color: "#6B7280" }}>
                {auth.user?.email} • {auth.user?.role}
              </div>
            </div>

            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)", color: "white", fontWeight: 800 }}
              aria-label="Avatar"
            >
              {initials || "?"}
            </div>
          </div>

          {!isMentor ? (
            <div
              className="mt-6 rounded-xl border p-4 text-sm"
              style={{ background: "#F5F3FF", borderColor: "#EDE9FE", color: "#4B5563" }}
            >
              Cette page permet surtout aux mentors de personnaliser leur fiche (annuaire, contact, etc.).
            </div>
          ) : null}

          {auth.status === "authenticated" && !isMentor ? (
            <div className="mt-4 text-sm" style={{ color: "#6B7280" }}>
              Connecte-toi avec un compte mentor pour modifier ta fiche.
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-xl border p-4 text-sm" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}>
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-6 rounded-xl border p-4 text-sm" style={{ background: "#ECFDF5", borderColor: "#A7F3D0", color: "#065F46" }}>
              {success}
            </div>
          ) : null}

          {isMentor ? (
            <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="fullName">
                  Nom complet
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                  placeholder="Ex: Samira Benali"
                  required
                />
              </div>

              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="professionName">
                  Métier
                </label>
                <Input
                  id="professionName"
                  name="professionName"
                  value={form.professionName}
                  onChange={(e) => setForm((p) => ({ ...p, professionName: e.target.value }))}
                  placeholder="Ex: Data Scientist"
                />
              </div>
              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="skills">
                  Compétences (séparées par des virgules)
                </label>
                <Input
                  id="skills"
                  name="skills"
                  value={form.skillsCsv}
                  onChange={(e) => setForm((p) => ({ ...p, skillsCsv: e.target.value }))}
                  placeholder="React, TypeScript, Tests"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Explique ce que tu proposes en mentorat…"
                  className="mt-2 w-full min-h-[120px] rounded-xl border px-3 py-2 text-sm"
                  style={{ borderColor: "#E5E7EB" }}
                />
              </div>

              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="locationLabel">
                  Localisation (label)
                </label>
                <Input
                  id="locationLabel"
                  name="locationLabel"
                  value={form.locationLabel}
                  onChange={(e) => setForm((p) => ({ ...p, locationLabel: e.target.value }))}
                  placeholder="Ex: Télétravail / Paris"
                />
              </div>
              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="city">
                  Ville
                </label>
                <Input id="city" name="city" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} placeholder="Paris" />
              </div>
              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="country">
                  Pays
                </label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                  placeholder="France"
                />
              </div>
              <div>
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="phone">
                  Téléphone (public)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+33 …"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="emailPublic">
                  Email public
                </label>
                <Input
                  id="emailPublic"
                  name="emailPublic"
                  value={form.emailPublic}
                  onChange={(e) => setForm((p) => ({ ...p, emailPublic: e.target.value }))}
                  placeholder="contact@example.com"
                  autoComplete="email"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm" style={{ color: "#374151", fontWeight: 700 }} htmlFor="imageUrl">
                  URL de l’image (avatar)
                </label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://…"
                />
              </div>

              <div className="sm:col-span-2 flex items-center justify-end gap-3 mt-2">
                <Button type="button" variant="ghost" onClick={() => navigate("/")}>Annuler</Button>
                <Button type="submit" disabled={!canEditMentor || saving || loading}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </Button>
              </div>
            </form>
          ) : null}

          {loading ? <div className="mt-4 text-sm" style={{ color: "#6B7280" }}>Chargement…</div> : null}
        </div>
      </div>
    </div>
  );
}
