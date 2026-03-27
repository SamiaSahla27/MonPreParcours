import React, { useState, useEffect } from "react";
import { X, Check, Building2, FileCheck, Shield, Send } from "lucide-react";
import {
  CompanySubmission,
  SubmissionStatus,
  COMMITMENT_TYPES,
  validateSubmission,
  CompanySize,
} from "../data/companySubmission";
import { submitCompanyApplication } from "../data/companySubmissionService";
import { Step1CompanyInfo } from "./SubmissionStep1";
import { Step2Commitments } from "./SubmissionStep2";
import { Step3Evidences } from "./SubmissionStep3";
import { Step4Review } from "./SubmissionStep4";
import { SuccessScreen } from "./SubmissionSuccess";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 1, label: "Informations", icon: Building2 },
  { id: 2, label: "Engagements", icon: FileCheck },
  { id: 3, label: "Preuves", icon: Shield },
  { id: 4, label: "Validation", icon: Send },
];

export function CompanySubmissionModal({ isOpen, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [submission, setSubmission] = useState<CompanySubmission>({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    country: "",
    city: "",
    contactEmail: "",
    contactName: "",
    contactRole: "",
    linkedinUrl: "",
    description: "",
    commitments: COMMITMENT_TYPES.map((ct) => ({
      id: ct.id,
      type: ct.label,
      description: "",
      selected: false,
    })),
    evidences: [],
    swornStatementAccepted: false,
    status: SubmissionStatus.DRAFT,
  });

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

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setIsSubmitted(false);
        setErrors([]);
      }, 300);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    setErrors([]);
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setErrors([]);
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const validation = validateSubmission(submission);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      // Submit to backend
      const result = await submitCompanyApplication(submission);
      
      if (result.success) {
        console.log("✅ Submission successful:", result.submission);
        setIsSubmitted(true);
      } else {
        setErrors(["Une erreur est survenue lors de la soumission. Veuillez réessayer."]);
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      setErrors(["Une erreur technique est survenue. Veuillez réessayer plus tard."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateSubmission = (updates: Partial<CompanySubmission>) => {
    setSubmission({ ...submission, ...updates });
  };

  if (isSubmitted) {
    return (
      <SuccessScreen 
        isOpen={isOpen} 
        onClose={onClose}
        companyName={submission.companyName}
      />
    );
  }

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
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl flex flex-col"
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
          className="flex-shrink-0 px-6 sm:px-8 pt-6 sm:pt-8 pb-4"
          style={{
            borderBottom: "1.5px solid rgba(244,63,94,0.1)",
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
                Faire référencer mon entreprise
              </h2>
              <p
                className="mt-2 text-sm"
                style={{
                  color: "#6B7280",
                  lineHeight: 1.6,
                }}
              >
                Soumettez votre dossier avec justificatifs pour apparaître dans notre liste d'entreprises engagées
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

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: isActive
                          ? "linear-gradient(135deg, #F43F5E, #E11D48)"
                          : isCompleted
                          ? "#10B981"
                          : "#F3F4F6",
                        color: isActive || isCompleted ? "white" : "#9CA3AF",
                        boxShadow: isActive ? "0 2px 8px rgba(244,63,94,0.3)" : "none",
                      }}
                    >
                      {isCompleted ? <Check size={16} /> : <Icon size={16} />}
                    </div>
                    <span
                      className="hidden sm:inline text-xs"
                      style={{
                        color: isActive ? "#F43F5E" : isCompleted ? "#10B981" : "#9CA3AF",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 mx-2"
                      style={{
                        background: isCompleted ? "#10B981" : "#E5E7EB",
                        maxWidth: "40px",
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {currentStep === 1 && (
            <Step1CompanyInfo submission={submission} updateSubmission={updateSubmission} />
          )}
          {currentStep === 2 && (
            <Step2Commitments submission={submission} updateSubmission={updateSubmission} />
          )}
          {currentStep === 3 && (
            <Step3Evidences submission={submission} updateSubmission={updateSubmission} />
          )}
          {currentStep === 4 && (
            <Step4Review submission={submission} updateSubmission={updateSubmission} />
          )}

          {/* Error messages */}
          {errors.length > 0 && (
            <div
              className="mt-4 p-4 rounded-xl"
              style={{
                background: "#FEF2F2",
                border: "1.5px solid #FCA5A5",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "#DC2626" }}
              >
                Veuillez corriger les erreurs suivantes :
              </p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm" style={{ color: "#B91C1C" }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex-shrink-0 px-6 sm:px-8 py-4 flex items-center justify-between gap-3"
          style={{
            borderTop: "1.5px solid rgba(244,63,94,0.1)",
          }}
        >
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-4 py-2.5 rounded-xl text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "white",
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#4B5563",
              fontWeight: 600,
            }}
          >
            Précédent
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #F43F5E, #E11D48)",
                color: "white",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(244,63,94,0.3)",
              }}
            >
              Continuer
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "white",
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Soumettre le dossier
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
