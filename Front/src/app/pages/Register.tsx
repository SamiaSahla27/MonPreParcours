import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../services/authStore";
import type { UserRole } from "../services/authApi";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export function Register() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("etudiant");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    try {
      await auth.register({ email, password, role });
      navigate("/mentorat");
    } catch (e: any) {
      setError(e?.message ?? "REGISTER_FAILED");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submit();
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border p-6 sm:p-8" style={{ background: "#FFFFFF", borderColor: "rgba(124,58,237,0.12)" }}>
            <h1
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "1.75rem",
                color: "#1a1035",
                letterSpacing: "-0.02em",
              }}
            >
              Inscription
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Crée ton compte et choisis ton rôle.
            </p>

            <form className="mt-6 grid gap-3" onSubmit={onSubmit} autoComplete="on">
              <div className="grid gap-1.5">
                <label htmlFor="email" className="text-sm" style={{ color: "#1F2937", fontWeight: 600 }}>
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: prenom.nom@email.com"
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="new-password" className="text-sm" style={{ color: "#1F2937", fontWeight: 600 }}>
                  Mot de passe
                </label>
                <Input
                  id="new-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Au moins 6 caractères
                </p>
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="role" className="text-sm" style={{ color: "#1F2937", fontWeight: 600 }}>
                  Rôle
                </label>
                <select
                  id="role"
                  name="role"
                  className="h-10 w-full rounded-md border px-3 text-sm"
                  style={{ background: "#FFFFFF", borderColor: "rgba(17,24,39,0.15)" }}
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>

              {error && (
                <div
                  className="text-sm rounded-lg border px-3 py-2"
                  style={{ background: "#FEF2F2", borderColor: "rgba(239,68,68,0.25)", color: "#B91C1C" }}
                >
                  {error}
                </div>
              )}

              <Button type="submit" disabled={auth.status === "loading"}>
                Créer mon compte
              </Button>

              <Button variant="ghost" type="button" onClick={() => navigate("/login")}>
                J’ai déjà un compte
              </Button>
            </form>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ✦ Propulsé par l'IA pour ton avenir
          </p>
        </div>
      </main>
    </div>
  );
}
