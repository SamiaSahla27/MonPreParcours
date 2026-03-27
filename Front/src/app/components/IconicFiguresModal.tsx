import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface Figure {
  name: string;
  domain: string;
  tagline: string;
  whyMatters: string;
  whatChanged: string;
  whyToday: string;
  categoryColor: string;
}

const FIGURES: Figure[] = [
  {
    name: "Marie Curie",
    domain: "Science",
    tagline: "Elle a ouvert la voie à des découvertes scientifiques majeures dans un monde où les femmes avaient très peu de place dans la recherche.",
    whyMatters: "Marie Curie a prouvé qu'une femme pouvait transformer la science à un niveau mondial, malgré les barrières sociales et académiques de son époque.",
    whatChanged: "Ses recherches sur la radioactivité ont marqué l'histoire de la physique, de la chimie et de la médecine.",
    whyToday: "Sa trajectoire rappelle que le talent ne dépend ni du genre ni du milieu, et que la place des femmes dans les sciences reste un enjeu essentiel.",
    categoryColor: "#7C3AED",
  },
  {
    name: "Frida Kahlo",
    domain: "Art",
    tagline: "Elle a transformé sa douleur, son identité et sa différence en une œuvre reconnue dans le monde entier.",
    whyMatters: "Frida Kahlo a imposé une manière radicalement personnelle de créer, en parlant du corps, de la souffrance, du genre et de l'identité.",
    whatChanged: "Elle a montré qu'on pouvait faire de l'art à partir de son vécu, sans se conformer aux attentes traditionnelles.",
    whyToday: "Son parcours parle de confiance en soi, d'expression personnelle et de représentation de réalités souvent invisibilisées.",
    categoryColor: "#F97316",
  },
  {
    name: "Rosa Parks",
    domain: "Droits civiques",
    tagline: "Par un refus simple mais immense, elle est devenue un symbole mondial de la lutte contre la ségrégation raciale.",
    whyMatters: "Rosa Parks a incarné le courage de dire non à une injustice quotidienne devenue \"normale\".",
    whatChanged: "Son geste a contribué à faire basculer le mouvement des droits civiques aux États-Unis.",
    whyToday: "Elle montre qu'un acte de résistance, même individuel, peut avoir un impact collectif énorme.",
    categoryColor: "#F43F5E",
  },
  {
    name: "Malala Yousafzai",
    domain: "Éducation / droits des femmes",
    tagline: "Très jeune, elle a défendu le droit des filles à aller à l'école face à la violence et à l'interdiction.",
    whyMatters: "Malala est devenue une voix mondiale pour l'éducation et l'égalité, alors même qu'on voulait la faire taire.",
    whatChanged: "Elle a rendu visible à l'échelle internationale le combat pour l'accès à l'éducation des filles.",
    whyToday: "Elle rappelle que l'école, l'accès au savoir et l'égalité des chances ne sont pas acquis partout.",
    categoryColor: "#10B981",
  },
  {
    name: "Nelson Mandela",
    domain: "Politique / droits humains",
    tagline: "Il a consacré sa vie à combattre un système raciste qui privait une majorité de ses droits fondamentaux.",
    whyMatters: "Mandela est devenu un symbole de résistance, de justice et de transformation politique.",
    whatChanged: "Il a joué un rôle majeur dans la fin de l'apartheid en Afrique du Sud.",
    whyToday: "Son parcours montre que les droits humains se défendent sur le temps long, avec courage, stratégie et persévérance.",
    categoryColor: "#0EA5E9",
  },
  {
    name: "Alan Turing",
    domain: "Informatique / mathématiques",
    tagline: "Il a changé l'histoire de l'informatique, tout en étant persécuté à cause de son homosexualité.",
    whyMatters: "Alan Turing a contribué à poser les bases du monde numérique moderne.",
    whatChanged: "Ses travaux ont marqué les mathématiques, l'informatique et la compréhension des machines intelligentes.",
    whyToday: "Il rappelle qu'une société peut bénéficier du génie d'une personne tout en la rejetant, et que la reconnaissance des personnes LGBT reste un enjeu de justice.",
    categoryColor: "#7C3AED",
  },
  {
    name: "Harvey Milk",
    domain: "Politique / droits LGBT",
    tagline: "Il a fait entrer la visibilité LGBT dans la sphère politique à une époque où cela exposait à de fortes violences.",
    whyMatters: "Harvey Milk a montré qu'être visible en politique pouvait déjà être un acte militant.",
    whatChanged: "Il a contribué à faire avancer la représentation des personnes gays dans l'espace public et institutionnel.",
    whyToday: "Il rappelle que la représentation compte : voir des personnes différentes accéder à des rôles visibles change les mentalités.",
    categoryColor: "#F59E0B",
  },
  {
    name: "Marsha P. Johnson",
    domain: "Droits trans et LGBTQ+",
    tagline: "Elle est devenue une figure majeure des luttes queer et trans, dans un contexte de rejet et de grande précarité.",
    whyMatters: "Marsha P. Johnson a porté une parole essentielle pour les personnes les plus marginalisées au sein même des minorités.",
    whatChanged: "Elle est aujourd'hui associée à l'histoire des mobilisations qui ont renforcé les luttes LGBTQ+.",
    whyToday: "Elle aide à comprendre que l'inclusion doit aussi prendre en compte celles et ceux qu'on voit le moins.",
    categoryColor: "#EC4899",
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function IconicFiguresModal({ isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<'next' | 'prev'>('next');

  const currentFigure = FIGURES[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, currentIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % FIGURES.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + FIGURES.length) % FIGURES.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 'next' : 'prev');
    setCurrentIndex(index);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "rgba(26, 16, 53, 0.8)",
        backdropFilter: "blur(12px)",
        animation: "fadeIn 0.3s ease-out",
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
              transform: translateY(30px) scale(0.96);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      
      <div
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: "white",
          boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6"
          style={{
            background: "linear-gradient(135deg, #FFF1F2 0%, #FFF7ED 100%)",
            borderBottom: "1.5px solid rgba(244,63,94,0.1)",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={20} style={{ color: "#F43F5E" }} />
                <span
                  className="text-xs"
                  style={{
                    color: "#F43F5E",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Histoire & Figures inspirantes
                </span>
              </div>
              
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.875rem",
                  color: "#1a1035",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                  marginBottom: "12px",
                }}
              >
                8 figures qui ont fait avancer l'égalité et la visibilité
              </h2>
              
              <p
                className="text-sm"
                style={{
                  color: "#4B5563",
                  lineHeight: 1.7,
                  maxWidth: "600px",
                }}
              >
                Les politiques d'inclusion en entreprise ne viennent pas de nulle part. 
                Elles s'inscrivent dans une histoire portée par des personnes qui ont fait 
                bouger les droits, la représentation et la reconnaissance à travers le monde.
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white"
              style={{
                border: "1.5px solid rgba(244,63,94,0.25)",
                color: "#F43F5E",
              }}
              aria-label="Fermer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Content - Single Figure Display */}
        <div className="px-6 sm:px-10 py-8 sm:py-10">
          <div
            key={currentIndex}
            style={{
              animation: `${direction === 'next' ? 'slideInRight' : 'slideInLeft'} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            {/* Category Badge */}
            <div className="mb-5">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                style={{
                  background: `${currentFigure.categoryColor}15`,
                  color: currentFigure.categoryColor,
                  fontWeight: 700,
                  border: `1.5px solid ${currentFigure.categoryColor}30`,
                }}
              >
                {currentFigure.domain}
              </span>
            </div>

            {/* Name */}
            <h3
              className="mb-4"
              style={{
                fontWeight: 800,
                fontSize: "2.25rem",
                color: "#1a1035",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {currentFigure.name}
            </h3>

            {/* Tagline */}
            <p
              className="mb-8 pb-8"
              style={{
                fontSize: "1.125rem",
                color: "#6B7280",
                lineHeight: 1.65,
                fontWeight: 500,
                borderBottom: "1.5px solid rgba(0,0,0,0.08)",
              }}
            >
              {currentFigure.tagline}
            </p>

            {/* Content Sections */}
            <div className="space-y-6">
              {/* Why Matters */}
              <ContentBlock
                title="Pourquoi cette personne compte"
                content={currentFigure.whyMatters}
                color="#F43F5E"
              />

              {/* What Changed */}
              <ContentBlock
                title="Ce qu'elle a changé"
                content={currentFigure.whatChanged}
                color="#F59E0B"
              />

              {/* Why Today */}
              <ContentBlock
                title="Pourquoi ça te concerne aujourd'hui"
                content={currentFigure.whyToday}
                color="#10B981"
              />
            </div>
          </div>
        </div>

        {/* Footer - Conclusion Message */}
        <div
          className="px-6 sm:px-10 py-6"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.05), rgba(139,92,246,0.05))",
            borderTop: "1.5px solid rgba(59,130,246,0.1)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(59,130,246,0.15)",
              }}
            >
              <Sparkles size={16} style={{ color: "#3B82F6" }} />
            </div>
            <p
              className="text-sm"
              style={{
                color: "#4B5563",
                lineHeight: 1.7,
                fontWeight: 500,
              }}
            >
              Ces avancées ont ouvert la voie à des politiques d'égalité, de diversité 
              et d'inclusion que les entreprises sont aujourd'hui appelées à mettre en 
              œuvre concrètement.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div
          className="px-6 sm:px-10 py-6"
          style={{
            borderTop: "1.5px solid rgba(0,0,0,0.08)",
            background: "#FAFAFA",
          }}
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-5">
            <span
              className="text-sm px-4 py-2 rounded-full"
              style={{
                background: "rgba(244,63,94,0.1)",
                color: "#F43F5E",
                fontWeight: 700,
              }}
            >
              {currentIndex + 1} / {FIGURES.length}
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <button
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-md"
              style={{
                background: "white",
                border: "1.5px solid rgba(0,0,0,0.1)",
                color: "#4B5563",
                fontWeight: 700,
                flex: 1,
              }}
              aria-label="Figure précédente"
            >
              <ChevronLeft size={18} />
              Précédente
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200 hover:shadow-md"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                color: "white",
                fontWeight: 700,
                flex: 1,
                border: "none",
              }}
              aria-label="Figure suivante"
            >
              Suivante
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Dot Navigation */}
          <div className="flex items-center justify-center gap-2">
            {FIGURES.map((figure, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="group transition-all duration-200"
                aria-label={`Aller à ${figure.name}`}
                title={figure.name}
              >
                <div
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: index === currentIndex ? "32px" : "8px",
                    height: "8px",
                    background: index === currentIndex
                      ? "#F43F5E"
                      : "rgba(0,0,0,0.2)",
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Block Component
function ContentBlock({ title, content, color }: { title: string; content: string; color: string }) {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: `${color}08`,
        border: `1.5px solid ${color}20`,
      }}
    >
      <h4
        className="mb-2 flex items-center gap-2"
        style={{
          fontWeight: 700,
          fontSize: "0.875rem",
          color: color,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        <div
          style={{
            width: "4px",
            height: "16px",
            background: color,
            borderRadius: "2px",
          }}
        />
        {title}
      </h4>
      <p
        style={{
          color: "#374151",
          lineHeight: 1.7,
          fontSize: "0.9375rem",
          fontWeight: 500,
        }}
      >
        {content}
      </p>
    </div>
  );
}
