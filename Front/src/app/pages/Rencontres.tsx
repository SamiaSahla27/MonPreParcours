import React, { useMemo, useRef, useState } from "react";
import {
  Building2,
  CalendarDays,
  Globe,
  MapPin,
  Users,
} from "lucide-react";
import { cards } from "../data/cards";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";

type RencontreType =
  | "Tous"
  | "Portes ouvertes"
  | "Afterwork #recrutement"
  | "Immersion métier"
  | "En ligne";

type EventType = "Portes ouvertes" | "Afterwork #recrutement" | "Immersion métier";
type EventFormat = "Présentiel" | "En ligne";
type PublishFormat = "Présentiel" | "En ligne" | "Hybride";

interface RencontreItem {
  type: EventType;
  format: EventFormat;
  entreprise: string;
  secteur: string;
  description: string;
  date: string;
  places: string;
}

const filters: RencontreType[] = [
  "Tous",
  "Portes ouvertes",
  "Afterwork #recrutement",
  "Immersion métier",
  "En ligne",
];

const rencontres: RencontreItem[] = [
  {
    type: "Portes ouvertes",
    format: "Présentiel",
    entreprise: "Doctolib",
    secteur: "Santé · Paris 9e",
    description:
      "Viens découvrir comment on conçoit des produits de santé numérique. Rencontre l'équipe Product & Design.",
    date: "Jeudi 10 avril 2025 · 14h → 17h",
    places: "8 places restantes",
  },
  {
    type: "Afterwork #recrutement",
    format: "Présentiel",
    entreprise: "BlaBlaCar",
    secteur: "Tech · Paris 11e",
    description:
      "Un afterwork pour échanger avec des ingénieurs, des PMs et des designers. Questions libres, ambiance détendue.",
    date: "Mardi 15 avril 2025 · 18h30 → 20h30",
    places: "15 places restantes",
  },
  {
    type: "Immersion métier",
    format: "En ligne",
    entreprise: "Croix-Rouge française",
    secteur: "Social · Visioconférence",
    description:
      "Une matinée pour comprendre le quotidien d'une coordinatrice terrain. Témoignage + questions en direct.",
    date: "Vendredi 18 avril 2025 · 10h → 12h",
    places: "32 places restantes",
  },
  {
    type: "Portes ouvertes",
    format: "Présentiel",
    entreprise: "Bouygues Construction",
    secteur: "BTP · Saint-Quentin-en-Yvelines",
    description:
      "Visite d'un chantier actif avec les équipes ingénierie et sécurité. Tenue de chantier fournie.",
    date: "Samedi 26 avril 2025 · 9h → 12h",
    places: "6 places restantes",
  },
];

const typeStyles: Record<EventType, { background: string; color: string }> = {
  "Portes ouvertes": { background: "#FFF7ED", color: "#C2410C" },
  "Afterwork #recrutement": { background: "#EDE9FE", color: "#6D28D9" },
  "Immersion métier": { background: "#ECFDF5", color: "#047857" },
};

const formatStyles: Record<EventFormat, { background: string; color: string }> = {
  "Présentiel": { background: "#F1F5F9", color: "#334155" },
  "En ligne": { background: "#EFF6FF", color: "#1D4ED8" },
};

export function Rencontres() {
  const rencontresAccent = cards[1]?.accentColor ?? "#F97316";
  const rencontresLight = cards[1]?.lightColor ?? "#FFF7ED";
  const rencontresGradient =
    cards[1]?.gradient ?? "linear-gradient(135deg, #F97316 0%, #EA580C 100%)";
  const publishRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<RencontreType>("Tous");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("Portes ouvertes");
  const [eventFormat, setEventFormat] = useState<PublishFormat>("Présentiel");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [city, setCity] = useState("");
  const [visioLink, setVisioLink] = useState("");
  const [places, setPlaces] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredRencontres = useMemo(() => {
    if (activeFilter === "Tous") {
      return rencontres;
    }

    if (activeFilter === "En ligne") {
      return rencontres.filter((item) => item.format === "En ligne");
    }

    return rencontres.filter((item) => item.type === activeFilter);
  }, [activeFilter]);

  const showCity = eventFormat === "Présentiel" || eventFormat === "Hybride";
  const showVisio = eventFormat === "En ligne" || eventFormat === "Hybride";

  function scrollToPublish() {
    publishRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(249,115,22,0.08), transparent 24%), linear-gradient(180deg, #FFFCF8 0%, #F8FAFC 100%)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div
          className="relative overflow-hidden rounded-[32px] px-6 py-6 sm:px-8"
          style={{
            background: rencontresGradient,
            boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
          }}
        >
          <div
            className="absolute -right-10 -top-10 h-36 w-36 rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1"
                style={{ background: "rgba(255,255,255,0.16)" }}
              >
                <Users size={14} color="#FFFFFF" />
                <span
                  className="text-xs"
                  style={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    letterSpacing: "0.18em",
                  }}
                >
                  RENCONTRES PRO
                </span>
              </div>
              <h1
                className="mt-4 text-3xl sm:text-4xl"
                style={{
                  color: "#FFFFFF",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                Journées portes ouvertes & Afterworks
              </h1>
              <p
                className="mt-3 text-sm sm:text-base"
                style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.8 }}
              >
                Des entreprises t'ouvrent leurs portes et te rencontrent en vrai. Inscription gratuite.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={scrollToPublish}
              className="rounded-2xl border-white bg-transparent px-5 py-3 text-sm"
              style={{
                color: "#FFFFFF",
                borderColor: "#FFFFFF",
                fontWeight: 700,
              }}
            >
              Tu es une entreprise ? Publier un événement
            </Button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className="rounded-full px-4 py-2 text-sm transition-all duration-200"
                style={{
                  background: active ? rencontresAccent : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#6B7280",
                  border: `1px solid ${active ? rencontresAccent : "#D1D5DB"}`,
                  fontWeight: active ? 700 : 600,
                  boxShadow: active ? "0 10px 24px rgba(249,115,22,0.20)" : "none",
                }}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredRencontres.map((rencontre) => {
            const typeStyle = typeStyles[rencontre.type];
            const formatStyle = formatStyles[rencontre.format];

            return (
              <Card
                key={`${rencontre.entreprise}-${rencontre.date}`}
                className="rounded-3xl border"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#E5E7EB",
                  boxShadow: "0 12px 38px rgba(15,23,42,0.06)",
                }}
              >
                <CardContent className="flex h-full flex-col gap-5 p-6">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        background: typeStyle.background,
                        color: typeStyle.color,
                        fontWeight: 700,
                      }}
                    >
                      {rencontre.type}
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={{
                        background: formatStyle.background,
                        color: formatStyle.color,
                        fontWeight: 700,
                      }}
                    >
                      {rencontre.format}
                    </span>
                  </div>

                  <div>
                    <h2
                      className="text-2xl"
                      style={{
                        color: "#1A1A1A",
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {rencontre.entreprise}
                    </h2>
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "#6B7280", fontWeight: 700 }}
                    >
                      {rencontre.secteur}
                    </p>
                  </div>

                  <p
                    className="text-sm"
                    style={{ color: "#4B5563", lineHeight: 1.8 }}
                  >
                    {rencontre.description}
                  </p>

                  <div className="mt-auto space-y-3 border-t pt-5" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-start gap-3 text-sm" style={{ color: "#4B5563" }}>
                      <CalendarDays size={16} color={rencontresAccent} className="mt-0.5" />
                      <span>{rencontre.date}</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm" style={{ color: "#4B5563" }}>
                      <Users size={16} color={rencontresAccent} className="mt-0.5" />
                      <span>{rencontre.places}</span>
                    </div>
                    <Button
                      type="button"
                      className="mt-2 w-full rounded-2xl"
                      style={{
                        background: rencontresAccent,
                        color: "#FFFFFF",
                        fontWeight: 700,
                        boxShadow: "0 14px 32px rgba(249,115,22,0.18)",
                      }}
                    >
                      S'inscrire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div ref={publishRef} id="publier" className="mt-14">
          <div className="mb-6 border-t pt-8" style={{ borderColor: "#FED7AA" }}>
            <h2
              className="text-2xl sm:text-3xl"
              style={{ color: "#1A1A1A", fontWeight: 800, letterSpacing: "-0.03em" }}
            >
              Vous êtes une entreprise ? Publiez votre événement
            </h2>
            <p className="mt-2 text-sm sm:text-base" style={{ color: "#6B7280", lineHeight: 1.8 }}>
              Gratuit · Touchez des profils qualifiés par leur parcours IA
            </p>
          </div>

          <Card
            className="rounded-3xl border"
            style={{
              background: "#FFFFFF",
              borderColor: "#E5E7EB",
              boxShadow: "0 12px 38px rgba(15,23,42,0.06)",
            }}
          >
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Nom de l'événement</Label>
                  <Input
                    id="event-name"
                    value={eventName}
                    onChange={(event) => setEventName(event.target.value)}
                    placeholder="Ex: Portes ouvertes Product & Tech"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Type</Label>
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(event) => setEventType(event.target.value)}
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      style={{ borderColor: "#D1D5DB" }}
                    >
                      <option>Portes ouvertes</option>
                      <option>Afterwork</option>
                      <option>Immersion métier</option>
                      <option>Autre</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-format">Format</Label>
                    <select
                      id="event-format"
                      value={eventFormat}
                      onChange={(event) => setEventFormat(event.target.value as PublishFormat)}
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
                      style={{ borderColor: "#D1D5DB" }}
                    >
                      <option>Présentiel</option>
                      <option>En ligne</option>
                      <option>Hybride</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={eventDate}
                      onChange={(event) => setEventDate(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-time">Heure début</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end-time">Heure fin</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                    />
                  </div>
                </div>

                {(showCity || showVisio) && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {showCity && (
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <div className="relative">
                          <MapPin
                            size={16}
                            color={rencontresAccent}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            id="city"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            placeholder="Paris"
                            className="pl-9"
                          />
                        </div>
                      </div>
                    )}

                    {showVisio && (
                      <div className="space-y-2">
                        <Label htmlFor="visio-link">Lien visio</Label>
                        <div className="relative">
                          <Globe
                            size={16}
                            color={rencontresAccent}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            id="visio-link"
                            value={visioLink}
                            onChange={(event) => setVisioLink(event.target.value)}
                            placeholder="https://..."
                            className="pl-9"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="places">Nombre de places</Label>
                    <Input
                      id="places"
                      type="number"
                      min="1"
                      value={places}
                      onChange={(event) => setPlaces(event.target.value)}
                      placeholder="20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector">Secteur de l'entreprise</Label>
                    <div className="relative">
                      <Building2
                        size={16}
                        color={rencontresAccent}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                      />
                      <Input
                        id="sector"
                        value={sector}
                        onChange={(event) => setSector(event.target.value)}
                        placeholder="Santé, Tech, BTP..."
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="description">Description</Label>
                    <span className="text-xs" style={{ color: "#9CA3AF" }}>
                      {description.length}/300
                    </span>
                  </div>
                  <Textarea
                    id="description"
                    value={description}
                    maxLength={300}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Décris le format, les équipes présentes et ce que les participants vont découvrir."
                    className="min-h-[140px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-2xl py-3"
                  style={{
                    background: rencontresAccent,
                    color: "#FFFFFF",
                    fontWeight: 700,
                    boxShadow: "0 14px 32px rgba(249,115,22,0.18)",
                  }}
                >
                  Publier l'événement
                </Button>

                {submitted && (
                  <div
                    className="rounded-2xl px-4 py-4 text-sm"
                    style={{
                      background: rencontresLight,
                      color: "#9A3412",
                      lineHeight: 1.7,
                    }}
                  >
                    Votre événement a été transmis. Notre équipe revient vers vous sous 24h.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
