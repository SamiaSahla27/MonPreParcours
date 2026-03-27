import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Bell, ChevronDown, X } from "lucide-react";
import { useAuth } from "../services/authStore";
import * as mentorsApi from "../services/mentorsApi";
import { RealtimeClient, type MentorNotification } from "../services/realtimeClient";

type Suggestion = { label: string; type: string };

export function Navbar() {
  const auth = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeLink, setActiveLink] = useState("Explorer");
  const navigate = useNavigate();

  const isAuthenticated = auth.status === "authenticated";

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? "/api";
  const realtimeClient = useMemo(() => {
    if (!auth.token) return null;
    return new RealtimeClient({ baseUrl: backendUrl, token: auth.token });
  }, [backendUrl, auth.token]);

  const isMentor = isAuthenticated && auth.user?.role === "mentor";

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const [notifications, setNotifications] = useState<MentorNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState<{ title: string; subtitle?: string } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!notifOpen) return;
      const target = e.target as Node | null;
      if (notifRef.current && target && !notifRef.current.contains(target)) setNotifOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen]);

  useEffect(() => {
    if (!realtimeClient || !isMentor) return;

    // Always register presence so the mentor joins their userId room.
    // Do not rely only on onConnected callback (it can be missed if already connected).
    realtimeClient.registerPresence();

    realtimeClient.onConnected(() => {
      // eslint-disable-next-line no-console
      console.log("[realtime] navbar socket connected");
      realtimeClient.registerPresence();
    });

    realtimeClient.onDisconnected(() => {
      // eslint-disable-next-line no-console
      console.log("[realtime] navbar socket disconnected");
    });

    realtimeClient.onMentorNotification((n) => {
      // Debug: confirm notification receipt (can be removed later)
      // eslint-disable-next-line no-console
      console.log("[realtime] mentor.notification received", n);
      setNotifications((prev) => [n, ...prev].slice(0, 20));

      const alreadyInConversation = window.location.pathname === "/mentorat";
      const sameConversation =
        alreadyInConversation &&
        new URLSearchParams(window.location.search).get("mentorId") === n.mentorId &&
        new URLSearchParams(window.location.search).get("etudiantId") === n.etudiantId;

      if (!sameConversation) {
        setUnreadCount((c) => c + 1);
        const title =
          n.type === "message" ? "Nouveau message" : n.type === "call" ? "Appel entrant" : "Nouveau contact";
        const subtitle =
          n.type === "message"
            ? (n.previewText ? n.previewText : "Un étudiant t’a envoyé un message.")
            : n.type === "call"
              ? "Un étudiant veut démarrer une visio."
              : "Un étudiant souhaite te contacter.";

        setToast({ title, subtitle });
        if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = window.setTimeout(() => setToast(null), 3500);
      }
    });

    return () => {
      realtimeClient.disconnect();
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    };
  }, [realtimeClient, isMentor]);

  const [professionSuggestions, setProfessionSuggestions] = useState<string[]>([]);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!searchFocused || suggestionsLoaded) return;
      try {
        const items = await mentorsApi.listProfessions();
        if (!cancelled) {
          setProfessionSuggestions(items);
          setSuggestionsLoaded(true);
        }
      } catch {
        if (!cancelled) setSuggestionsLoaded(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [searchFocused, suggestionsLoaded]);

  const SEARCH_SUGGESTIONS: Suggestion[] = useMemo(() => {
    const unique = Array.from(new Set(professionSuggestions.map((p) => p.trim()).filter(Boolean)));
    return unique.map((p) => ({ label: p, type: "Métier" }));
  }, [professionSuggestions]);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileOpen) return;
      const target = e.target as Node | null;
      if (profileRef.current && target && !profileRef.current.contains(target)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [profileOpen]);

  const filtered = searchQuery
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_SUGGESTIONS;

  const showEmpty = searchQuery.length > 1 && filtered.length === 0;

  const goToSearch = (q: string) => {
    if (q.trim()) {
      setSearchQuery("");
      setSearchFocused(false);
      navigate(`/mentors?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(124,58,237,0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)" }}
            >
              <span className="text-white text-sm">✦</span>
            </div>
            <span
              className="text-xl hidden sm:block"
              style={{ color: "#1a1035", fontWeight: 800, letterSpacing: "-0.02em" }}
            >
              Orient<span style={{ color: "#7C3AED" }}>IA</span>
            </span>
          </Link>

          {/* Nav links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-1">
            {["Explorer", "Mon parcours", "Ressources"].map((link) => (
              <button
                key={link}
                onClick={() => { setActiveLink(link); if (link === "Explorer") navigate("/"); }}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: activeLink === link ? 600 : 500,
                  color: activeLink === link ? "#7C3AED" : "#4B5563",
                  background: activeLink === link ? "#EDE9FE" : "transparent",
                }}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm relative hidden sm:block">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200"
              style={{
                background: searchFocused ? "#FAFAFA" : "#F5F3FF",
                borderColor: searchFocused ? "#7C3AED" : "transparent",
                boxShadow: searchFocused ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
              }}
            >
              <Search size={16} style={{ color: "#9CA3AF", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Rechercher un métier, secteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") goToSearch(searchQuery); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="flex-1 bg-transparent text-sm outline-none min-w-0"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  color: "#1F2937",
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X size={14} style={{ color: "#9CA3AF" }} />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {searchFocused && (
              <div
                className="absolute top-full mt-2 w-full rounded-xl border overflow-hidden z-50"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(124,58,237,0.15)",
                  boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
                }}
              >
                {showEmpty ? (
                  <div className="px-4 py-8 text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-sm" style={{ color: "#6B7280", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Aucun résultat pour «{" "}
                      <span style={{ color: "#7C3AED", fontWeight: 600 }}>{searchQuery}</span> »
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      Essaie un terme différent
                    </p>
                  </div>
                ) : (
                  <>
                    <p
                      className="px-4 pt-3 pb-1 text-xs uppercase tracking-wider"
                      style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                    >
                      {searchQuery ? "Résultats" : "Suggestions"}
                    </p>
                    {filtered.map((s) => (
                      <button
                        key={s.label}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-50 transition-colors text-left"
                        onMouseDown={() => { goToSearch(s.label); }}
                      >
                        <Search size={13} style={{ color: "#C4B5FD" }} />
                        <span className="flex-1 text-sm" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {s.label}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "#EDE9FE", color: "#7C3AED", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
                        >
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-violet-50"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    color: "#7C3AED",
                  }}
                >
                  Connexion
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    background: "#EDE9FE",
                    color: "#7C3AED",
                  }}
                >
                  Inscription
                </button>
              </>
            ) : (
              <>
                <div
                  className="hidden sm:flex items-center text-xs px-2 py-1 rounded-full"
                  style={{
                    background: "#F5F3FF",
                    color: "#6B7280",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {auth.user?.role} • {auth.user?.email}
                </div>
                <button
                  onClick={() => {
                    auth.logout();
                    navigate("/");
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm transition-all duration-200 hover:bg-violet-50"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    color: "#7C3AED",
                  }}
                >
                  Déconnexion
                </button>
              </>
            )}

            {isAuthenticated ? (
              <>
                {/* Progress pill - hidden on mobile */}
                <div
                  className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: "#EDE9FE",
                    color: "#7C3AED",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  <div className="w-16 h-1.5 rounded-full" style={{ background: "#DDD6FE" }}>
                    <div className="h-full rounded-full" style={{ width: "45%", background: "#7C3AED" }} />
                  </div>
                  45% du parcours
                </div>

                {/* Bell */}
                {isMentor ? (
                  <div className="relative" ref={notifRef}>
                    <button
                      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-violet-50"
                      onClick={() => {
                        setNotifOpen((v) => !v);
                        setUnreadCount(0);
                      }}
                      aria-label="Notifications"
                    >
                      <Bell size={18} style={{ color: "#6B7280" }} />
                      {unreadCount > 0 ? (
                        <span
                          className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full flex items-center justify-center text-[10px]"
                          style={{ background: "#F43F5E", color: "#FFFFFF", fontWeight: 800 }}
                        >
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      ) : null}
                    </button>

                    {notifOpen ? (
                      <div
                        className="absolute right-0 mt-2 w-80 rounded-xl border overflow-hidden z-50"
                        style={{
                          background: "#FFFFFF",
                          borderColor: "rgba(124,58,237,0.15)",
                          boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
                        }}
                      >
                        <div className="px-4 pt-3 pb-2 border-b" style={{ borderColor: "rgba(124,58,237,0.10)" }}>
                          <div
                            className="text-sm"
                            style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                          >
                            Notifications
                          </div>
                          <div
                            className="text-xs mt-0.5"
                            style={{ color: "#9CA3AF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                          >
                            Temps réel (non sauvegardé)
                          </div>
                        </div>

                        {notifications.length === 0 ? (
                          <div className="px-4 py-6">
                            <p className="text-sm" style={{ color: "#6B7280", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                              Aucune notification.
                            </p>
                          </div>
                        ) : (
                          <div className="max-h-80 overflow-auto">
                            {notifications.map((n, idx) => (
                              <button
                                key={`${n.conversationId}:${n.createdAt}:${idx}`}
                                className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors"
                                onClick={() => {
                                  setNotifOpen(false);
                                  navigate(
                                    `/mentorat?mentorId=${encodeURIComponent(n.mentorId)}&etudiantId=${encodeURIComponent(n.etudiantId)}`,
                                  );
                                }}
                              >
                                <div className="text-sm" style={{ color: "#1F2937", fontWeight: 700 }}>
                                  {n.type === "message"
                                    ? "Nouveau message"
                                    : n.type === "call"
                                      ? "Appel entrant"
                                      : "Nouveau contact"}
                                </div>
                                {n.type === "message" && n.previewText ? (
                                  <div className="text-xs mt-1" style={{ color: "#6B7280" }}>
                                    {n.previewText}
                                  </div>
                                ) : null}
                                <div className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
                                  {new Date(n.createdAt).toLocaleString()}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {/* Avatar */}
                <div className="relative" ref={profileRef}>
                  <button
                    className="flex items-center gap-2"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Menu profil"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                        color: "white",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      {(auth.user?.email?.[0] ?? "E").toUpperCase()}
                    </div>
                    <ChevronDown size={14} style={{ color: "#9CA3AF" }} className="hidden sm:block" />
                  </button>

                  {profileOpen ? (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-xl border overflow-hidden z-50"
                      style={{
                        background: "#FFFFFF",
                        borderColor: "rgba(124,58,237,0.15)",
                        boxShadow: "0 8px 30px rgba(124,58,237,0.12)",
                      }}
                    >
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-50 transition-colors text-left"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{
                            color: "#1F2937",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          Profil
                        </span>
                      </button>

                      <button
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-violet-50 transition-colors text-left"
                        onClick={() => {
                          setProfileOpen(false);
                          auth.logout();
                          navigate("/");
                        }}
                      >
                        <span
                          className="text-sm"
                          style={{
                            color: "#7C3AED",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 700,
                          }}
                        >
                          Déconnexion
                        </span>
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {toast ? (
        <div className="fixed top-20 right-4 z-[60]">
          <div
            className="w-80 rounded-xl border px-4 py-3"
            style={{
              background: "#FFFFFF",
              borderColor: "rgba(124,58,237,0.18)",
              boxShadow: "0 12px 40px rgba(124,58,237,0.18)",
            }}
          >
            <div className="text-sm" style={{ color: "#1F2937", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
              {toast.title}
            </div>
            {toast.subtitle ? (
              <div className="text-xs mt-1" style={{ color: "#6B7280", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {toast.subtitle}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  );
}