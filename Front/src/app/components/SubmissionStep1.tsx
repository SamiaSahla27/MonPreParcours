import React from "react";
import { CompanySubmission, CompanySize, INDUSTRIES } from "../data/companySubmission";

interface Props {
  submission: CompanySubmission;
  updateSubmission: (updates: Partial<CompanySubmission>) => void;
}

export function Step1CompanyInfo({ submission, updateSubmission }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h3
          className="mb-1"
          style={{
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1a1035",
          }}
        >
          Informations sur l'entreprise
        </h3>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Renseignez les informations de base de votre entreprise
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Company Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Nom de l'entreprise <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="text"
            value={submission.companyName}
            onChange={(e) => updateSubmission({ companyName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Ex: Decathlon"
          />
        </div>

        {/* Website */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Site web <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="url"
            value={submission.website}
            onChange={(e) => updateSubmission({ website: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="https://www.exemple.com"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Secteur d'activité <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <select
            value={submission.industry}
            onChange={(e) => updateSubmission({ industry: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
          >
            <option value="">Sélectionnez un secteur</option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Taille de l'entreprise <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <select
            value={submission.size}
            onChange={(e) => updateSubmission({ size: e.target.value as CompanySize })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
          >
            <option value="">Sélectionnez une taille</option>
            <option value={CompanySize.SMALL}>{CompanySize.SMALL}</option>
            <option value={CompanySize.MEDIUM}>{CompanySize.MEDIUM}</option>
            <option value={CompanySize.LARGE}>{CompanySize.LARGE}</option>
            <option value={CompanySize.ENTERPRISE}>{CompanySize.ENTERPRISE}</option>
          </select>
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Pays <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="text"
            value={submission.country}
            onChange={(e) => updateSubmission({ country: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Ex: France"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Ville <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="text"
            value={submission.city}
            onChange={(e) => updateSubmission({ city: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Ex: Paris"
          />
        </div>

        {/* Contact Name */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Nom du contact <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="text"
            value={submission.contactName}
            onChange={(e) => updateSubmission({ contactName: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Ex: Marie Dupont"
          />
        </div>

        {/* Contact Role */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Poste du contact <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="text"
            value={submission.contactRole}
            onChange={(e) => updateSubmission({ contactRole: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Ex: Responsable RH"
          />
        </div>

        {/* Contact Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Email professionnel <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <input
            type="email"
            value={submission.contactEmail}
            onChange={(e) => updateSubmission({ contactEmail: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="contact@entreprise.com"
          />
        </div>

        {/* LinkedIn */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Page LinkedIn de l'entreprise (optionnel)
          </label>
          <input
            type="url"
            value={submission.linkedinUrl}
            onChange={(e) => updateSubmission({ linkedinUrl: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="https://www.linkedin.com/company/..."
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
            Brève description de l'entreprise <span style={{ color: "#F43F5E" }}>*</span>
          </label>
          <textarea
            value={submission.description}
            onChange={(e) => updateSubmission({ description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 resize-none"
            style={{
              border: "1.5px solid rgba(0,0,0,0.1)",
              color: "#1F2937",
            }}
            placeholder="Présentez votre entreprise en quelques lignes..."
          />
        </div>
      </div>
    </div>
  );
}
