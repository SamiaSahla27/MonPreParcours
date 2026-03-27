import React from "react";
import { CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export function SuccessScreen({ isOpen, onClose, companyName }: Props) {
  if (!isOpen) return null;

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
      <div
        className="w-full max-w-lg rounded-3xl p-8 text-center"
        style={{
          background: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease-out",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #10B981, #059669)",
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={40} style={{ color: "white" }} />
        </div>

        <h2
          className="mb-3"
          style={{
            fontWeight: 800,
            fontSize: "1.75rem",
            color: "#1a1035",
            letterSpacing: "-0.02em",
          }}
        >
          Dossier envoyé avec succès !
        </h2>

        <p
          className="text-base mb-6"
          style={{
            color: "#6B7280",
            lineHeight: 1.7,
          }}
        >
          Merci, votre dossier pour <strong>{companyName}</strong> a bien été envoyé. 
          Il est désormais en cours d'examen.
        </p>

        <div
          className="rounded-2xl p-5 mb-6 text-left"
          style={{
            background: "#F0F9FF",
            border: "1.5px solid #BAE6FD",
          }}
        >
          <p className="text-sm font-semibold mb-2" style={{ color: "#0369A1" }}>
            Prochaines étapes
          </p>
          <ul className="text-xs space-y-2" style={{ color: "#075985" }}>
            <li>✓ Votre dossier est en cours d'examen par notre équipe</li>
            <li>✓ Nous étudierons les engagements et justificatifs fournis</li>
            <li>✓ Vous serez contacté sous 7 à 10 jours ouvrés</li>
            <li>✓ Votre entreprise sera visible après validation du dossier</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 rounded-xl text-sm transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #F43F5E, #E11D48)",
            color: "white",
            fontWeight: 700,
            boxShadow: "0 4px 12px rgba(244,63,94,0.35)",
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
