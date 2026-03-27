import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Figure {
  name: string;
  domain: string;
  description: string;
  category: string;
  categoryColor: string;
}

const FIGURES: Figure[] = [
  {
    name: "Marie Curie",
    domain: "Science",
    description: "Pionnière de la recherche scientifique, Marie Curie a révolutionné la physique et la chimie grâce à ses travaux sur la radioactivité.",
    category: "Science",
    categoryColor: "#7C3AED",
  },
  {
    name: "Frida Kahlo",
    domain: "Art",
    description: "Artiste emblématique, Frida Kahlo a marqué l'histoire de l'art par des œuvres intimes, puissantes et profondément liées à son identité.",
    category: "Art",
    categoryColor: "#F97316",
  },
  {
    name: "Rosa Parks",
    domain: "Droits civiques",
    description: "Figure majeure de la lutte contre la ségrégation raciale, Rosa Parks est devenue un symbole du combat pour l'égalité aux États-Unis.",
    category: "Droits",
    categoryColor: "#F43F5E",
  },
  {
    name: "Malala Yousafzai",
    domain: "Éducation / droits des femmes",
    description: "Militante pakistanaise, Malala Yousafzai défend le droit des filles à l'éducation et incarne aujourd'hui un engagement mondial pour l'égalité.",
    category: "Éducation",
    categoryColor: "#10B981",
  },
  {
    name: "Nelson Mandela",
    domain: "Politique / droits humains",
    description: "Leader de la lutte contre l'apartheid, Nelson Mandela a profondément changé l'histoire de l'Afrique du Sud et la défense des droits humains.",
    category: "Politique",
    categoryColor: "#0EA5E9",
  },
  {
    name: "Alan Turing",
    domain: "Informatique / mathématiques",
    description: "Mathématicien visionnaire, Alan Turing a posé les bases de l'informatique moderne tout en devenant une figure forte de l'histoire LGBT.",
    category: "Science",
    categoryColor: "#7C3AED",
  },
  {
    name: "Harvey Milk",
    domain: "Politique / droits LGBT",
    description: "Harvey Milk fut l'un des premiers élus ouvertement gays aux États-Unis et une voix essentielle dans la lutte pour les droits LGBT.",
    category: "Politique",
    categoryColor: "#0EA5E9",
  },
  {
    name: "Marsha P. Johnson",
    domain: "Droits trans et LGBTQ+",
    description: "Militante trans et icône queer, Marsha P. Johnson est devenue une figure incontournable du combat pour les droits LGBTQ+.",
    category: "Droits",
    categoryColor: "#F43F5E",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function IconicFiguresModal({ isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [filter, setFilter] = React.useState<string>("Tous");

  const categories = ["Tous", ...Array.from(new Set(FIGURES.map(f => f.category)))];
  const filteredFigures = filter === "Tous" 
    ? FIGURES 
    : FIGURES.filter(f => f.category === filter);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredFigures.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredFigures.length) % filteredFigures.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(26, 16, 53, 0.75)",
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
      
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease-out",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 sm:px-8 pt-6 sm:pt-8 pb-4"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #ffffff 85%, rgba(255,255,255,0) 100%)",
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.75rem",
                  color: "#1a1035",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                8 figures qui ont fait avancer l'égalité et la visibilité
              </h2>
              <p
                className="mt-2 text-sm"
                style={{
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Les politiques d'inclusion en entreprise s'inscrivent dans une histoire plus large, portée par des personnalités qui ont transformé les droits, la représentation et la reconnaissance à travers le monde.
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-rose-50"
              style={{
                border: "1.5px solid rgba(244,63,94,0.2)",
                color: "#F43F5E",
              }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setCurrentIndex(0);
                }}
                className="text-xs px-3 py-1.5 rounded-full transition-all duration-200"
                style={{
                  background: filter === cat ? "#F43F5E" : "white",
                  color: filter === cat ? "white" : "#6B7280",
                  fontWeight: filter === cat ? 700 : 500,
                  border: `1.5px solid ${filter === cat ? "#F43F5E" : "rgba(0,0,0,0.1)"}`,
                  boxShadow: filter === cat ? "0 2px 8px rgba(244,63,94,0.25)" : "none",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content - Grid view for desktop, carousel for mobile */}
        <div className="px-6 sm:px-8 pb-8">
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-4">
            {filteredFigures.map((figure, idx) => (
              <FigureCard key={idx} figure={figure} />
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <FigureCard figure={filteredFigures[currentIndex]} />
            
            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  color: "#4B5563",
                  fontWeight: 600,
                }}
                aria-label="Figure précédente"
              >
                <ChevronLeft size={16} />
                Précédente
              </button>

              <span
                className="text-sm"
                style={{
                  color: "#9CA3AF",
                  fontWeight: 600,
                }}
              >
                {currentIndex + 1} / {filteredFigures.length}
              </span>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: "white",
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  color: "#4B5563",
                  fontWeight: 600,
                }}
                aria-label="Figure suivante"
              >
                Suivante
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FigureCard({ figure }: { figure: Figure }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-5 transition-all duration-300"
      style={{
        background: "#FFFFFF",
        border: `1.5px solid ${hovered ? "rgba(244,63,94,0.25)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(244,63,94,0.12)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {/* Category badge */}
      <span
        className="inline-block text-xs px-2.5 py-1 rounded-full mb-3"
        style={{
          background: `${figure.categoryColor}15`,
          color: figure.categoryColor,
          fontWeight: 700,
          border: `1px solid ${figure.categoryColor}30`,
        }}
      >
        {figure.category}
      </span>

      {/* Name */}
      <h3
        className="mb-1.5"
        style={{
          fontWeight: 700,
          fontSize: "1.125rem",
          color: "#1a1035",
          letterSpacing: "-0.01em",
        }}
      >
        {figure.name}
      </h3>

      {/* Domain */}
      <p
        className="text-sm mb-3"
        style={{
          color: "#F43F5E",
          fontWeight: 600,
        }}
      >
        {figure.domain}
      </p>

      {/* Description */}
      <p
        className="text-sm"
        style={{
          color: "#4B5563",
          lineHeight: 1.65,
        }}
      >
        {figure.description}
      </p>
    </div>
  );
}
