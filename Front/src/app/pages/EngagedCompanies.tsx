import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Heart, Sparkles, ArrowRight, Info, Building2 } from "lucide-react";
import { CompanyCard } from "../components/search/CompanyCard";
import { IconicFiguresModal } from "../components/IconicFiguresModal";
import { CompanySubmissionModal } from "../components/CompanySubmissionModal";
import { MOCK_RESULTS } from "../data/searchData";

export function EngagedCompanies() {
  const navigate = useNavigate();
  const [isFiguresModalOpen, setIsFiguresModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  // Filter only company results
  const companies = MOCK_RESULTS.filter((r) => r.type === "company");

  return (
    <div
      className="min-h-screen"
      style={{ background: "#F8F7FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Hero Section */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF1F2 0%, #FFF7ED 50%, #F5F3FF 100%)",
          borderBottom: "1.5px solid rgba(244,63,94,0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-6 px-3 py-2 rounded-xl text-sm transition-all duration-200 hover:bg-white/50"
            style={{
              border: "1.5px solid rgba(244,63,94,0.2)",
              color: "#F43F5E",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </button>

          {/* Hero content */}
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                style={{
                  background: "rgba(244,63,94,0.15)",
                  border: "1.5px solid rgba(244,63,94,0.25)",
                }}
              >
                <Heart size={14} style={{ color: "#F43F5E" }} />
                <span
                  className="text-xs"
                  style={{
                    color: "#F43F5E",
                    fontWeight: 700,
                  }}
                >
                  Engagement & Inclusion
                </span>
              </div>

              <h1
                style={{
                  fontWeight: 800,
                  fontSize: "2.5rem",
                  color: "#1a1035",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  marginBottom: "1rem",
                }}
              >
                Entreprises engagées
              </h1>

              <p
                className="text-lg mb-6"
                style={{
                  color: "#4B5563",
                  lineHeight: 1.7,
                  maxWidth: "600px",
                }}
              >
                Découvrez les entreprises qui s'engagent concrètement pour la diversité, 
                l'inclusion et l'égalité professionnelle. Consultez leurs actions, labels 
                et scores vérifiés.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/companies-directory")}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                    color: "white",
                    fontWeight: 700,
                    boxShadow: "0 4px 12px rgba(244,63,94,0.35)",
                  }}
                >
                  Explorer toutes les entreprises
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Decorative illustration */}
            <div
              className="w-full lg:w-80 h-64 rounded-3xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(244,63,94,0.1), rgba(249,115,22,0.1))",
                border: "1.5px solid rgba(244,63,94,0.15)",
              }}
            >
              <Heart size={80} style={{ color: "#F43F5E", opacity: 0.3 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Explanatory Section */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-8"
          style={{
            background: "white",
            border: "1.5px solid rgba(124,58,237,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #EDE9FE, #DDD6FE)",
                border: "1.5px solid rgba(124,58,237,0.2)",
              }}
            >
              <Info size={18} style={{ color: "#7C3AED" }} />
            </div>
            <div className="flex-1">
              <h2
                style={{
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#1a1035",
                  letterSpacing: "-0.02em",
                  marginBottom: "1rem",
                }}
              >
                Comprendre l'inclusivité et l'engagement des entreprises
              </h2>
              
              <p
                className="text-base mb-4"
                style={{
                  color: "#4B5563",
                  lineHeight: 1.7,
                }}
              >
                Une entreprise inclusive cherche à créer un environnement dans lequel chacun·e 
                peut accéder aux mêmes opportunités, être respecté·e et évoluer équitablement, 
                quels que soient son parcours, son identité ou ses besoins.
              </p>
              
              <p
                className="text-base"
                style={{
                  color: "#4B5563",
                  lineHeight: 1.7,
                }}
              >
                Son engagement se mesure à travers des actions concrètes : recrutement plus juste, 
                accessibilité, égalité professionnelle, programmes de mentorat, politiques internes, 
                labels reconnus ou résultats vérifiables.
              </p>
            </div>
          </div>
        </div>

        {/* CTA to Modal */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-10"
          style={{
            background: "linear-gradient(135deg, rgba(244,63,94,0.05), rgba(249,115,22,0.05))",
            border: "1.5px solid rgba(244,63,94,0.15)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                boxShadow: "0 4px 16px rgba(244,63,94,0.3)",
              }}
            >
              <Sparkles size={28} style={{ color: "white" }} />
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h3
                className="mb-2"
                style={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#1a1035",
                  letterSpacing: "-0.01em",
                }}
              >
                Découvrir l'histoire de l'inclusion
              </h3>
              <p
                className="text-sm"
                style={{
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Explorez 8 figures inspirantes qui ont fait avancer l'égalité, 
                la visibilité et les droits à travers le monde.
              </p>
            </div>

            <button
              onClick={() => setIsFiguresModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105"
              style={{
                background: "white",
                color: "#F43F5E",
                fontWeight: 700,
                border: "1.5px solid rgba(244,63,94,0.2)",
                boxShadow: "0 2px 8px rgba(244,63,94,0.1)",
              }}
            >
              Découvrir les figures
              <Sparkles size={16} />
            </button>
          </div>
        </div>

        {/* CTA for Company Submission */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-10"
          style={{
            background: "white",
            border: "1.5px solid rgba(244,63,94,0.15)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(244,63,94,0.1), rgba(249,115,22,0.1))",
                border: "1.5px solid rgba(244,63,94,0.2)",
              }}
            >
              <Building2 size={28} style={{ color: "#F43F5E" }} />
            </div>
            
            <div className="flex-1">
              <h3
                className="mb-2"
                style={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  color: "#1a1035",
                  letterSpacing: "-0.01em",
                }}
              >
                Faire référencer mon entreprise
              </h3>
              <p
                className="text-sm mb-3"
                style={{
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Votre entreprise met en place des actions concrètes en faveur de l'inclusion, 
                de l'égalité ou de la diversité ? Soumettez votre dossier pour demander son 
                référencement. Chaque candidature est étudiée à partir d'engagements déclarés 
                et de justificatifs vérifiables avant publication.
              </p>
              <p
                className="text-xs"
                style={{
                  color: "#9CA3AF",
                  lineHeight: 1.6,
                }}
              >
                <strong>Note de transparence :</strong> Le référencement repose sur des éléments 
                fournis par l'entreprise et sur une vérification du dossier. Il ne constitue pas 
                une certification absolue, mais une validation de preuves concrètes et consultables.
              </p>
            </div>

            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                color: "white",
                fontWeight: 700,
                boxShadow: "0 4px 12px rgba(244,63,94,0.35)",
              }}
            >
              <Building2 size={16} />
              Soumettre mon entreprise
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <IconicFiguresModal
        isOpen={isFiguresModalOpen}
        onClose={() => setIsFiguresModalOpen(false)}
      />
      <CompanySubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
      />
    </div>
  );
}
