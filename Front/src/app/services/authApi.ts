export type UserRole = "mentor" | "etudiant";

export type AuthMe = {
  id: string;
  email: string;
  role: UserRole;
};

function getBaseUrl() {
  var i = import.meta.env;
  return i?.VITE_BACKEND_URL ?? "/api";
}

async function http<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (init.token) headers.set("Authorization", `Bearer ${init.token}`);

  const res = await fetch(`${baseUrl}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error("Une erreur est survenue lors de la connexion. Veuillez vérifier vos identifiants et réessayer.");
  }
  return (await res.json()) as T;
}

export async function register(params: { email: string; password: string; role: UserRole }) {
  return await http<{ token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function login(params: { email: string; password: string }) {
  return await http<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function me(token: string) {
  return await http<AuthMe>("/auth/me", { method: "GET", token });
}
