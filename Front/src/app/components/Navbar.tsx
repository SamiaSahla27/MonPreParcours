import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Bell, ChevronDown, X } from "lucide-react";

const SEARCH_SUGGESTIONS = [
  { label: "Data Scientist", type: "Métier" },
  { label: "UX Designer", type: "Métier" },
  { label: "Développeur React", type: "Compétence" },
  { label: "Intelligence Artificielle", type: "Secteur" },
  { label: "Marketing Digital", type: "Secteur" },
];

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeLink, setActiveLink] = useState("Explorer");
  const navigate = useNavigate();

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
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
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
            <button
              className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-violet-50"
            >
              <Bell size={18} style={{ color: "#6B7280" }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#F43F5E" }}
              />
            </button>

            {/* Avatar */}
            <button className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm"
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)",
                  color: "white",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                E
              </div>
              <ChevronDown size={14} style={{ color: "#9CA3AF" }} className="hidden sm:block" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}