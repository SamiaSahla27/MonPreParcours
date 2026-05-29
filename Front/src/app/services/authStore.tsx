import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "./authApi";

const TOKEN_KEY = "auth.token";

export type AuthState = {
  token: string | null;
  user: authApi.AuthMe | null;
  status: "anonymous" | "loading" | "authenticated";
};

export type AuthContextValue = AuthState & {
  login: (params: { email: string; password: string }) => Promise<void>;
  register: (params: { email: string; password: string; role: authApi.UserRole }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider(props: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<authApi.AuthMe | null>(null);
  const [status, setStatus] = useState<AuthState["status"]>(() => (token ? "loading" : "anonymous"));

  const refreshMe = useCallback(async (t: string) => {
    setStatus("loading");
    try {
      const me = await authApi.me(t);
      setUser(me);
      setStatus("authenticated");
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
      setStatus("anonymous");
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    refreshMe(token);
  }, [token, refreshMe]);

  const login = useCallback(async (params: { email: string; password: string }) => {
    const res = await authApi.login(params);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
  }, [refreshMe]);

  const register = useCallback(async (params: { email: string; password: string; role: authApi.UserRole }) => {
    const res = await authApi.register(params);
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    await refreshMe(res.token);
  }, [refreshMe]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setStatus("anonymous");
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ token, user, status, login, register, logout }), [token, user, status, login, register, logout]);

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
