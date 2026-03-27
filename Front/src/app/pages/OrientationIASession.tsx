import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { BarChart3, ChevronLeft, Plus, Sparkles, X } from "lucide-react";
import {
  DEFAULT_VERDICT,
  PRE_PROFILE_GENERIC_QUESTIONS,
  SEGMENT_PROFILE_OPTIONS,
  getMockAiGeneratedQuestionsBySegment,
  getPhase1QuestionsBySegment,
  getSegmentLabel,
} from "../orientation/mockData";
import {
  BaseOrientationQuestion,
  OrientationSegment,
  PhaseQuestion,
  PhaseQuestionAnswer,
  SessionPhase,
} from "../orientation/types";
import {
  OrientationResultSession,
  SchoolRecommendationCard,
  buildNextMockSession,
  createBaseResultSessions,
} from "../orientation/data/dashboardMock";
import { ChoiceCard } from "../orientation/components/ChoiceCard";
import { FuturisticThinking } from "../orientation/components/FuturisticThinking";
import { NeuralPulseCorner } from "../orientation/components/NeuralPulseCorner";
import { SessionTopBar } from "../orientation/components/SessionTopBar";
import { TypewriterText } from "../orientation/components/TypewriterText";

const viteMode = (import.meta as ImportMeta & { env?: { MODE?: string } }).env?.MODE;
const VERDICT_DELAY_MS = viteMode === "test" ? 0 : 1600;
const AUTO_SUBMIT_DELAY_MS = viteMode === "test" ? 0 : 130;

const SEGMENT_SELECTION_QUESTION: PhaseQuestion = {
  id: "SEGMENT-SELECT",
  db_key: "type_personnalite",
  type: "single",
  segment: "lyceen",
  questionText: "Quel est ton type de personnalite ?",
  subText: "Choisis le profil qui te correspond pour definir la phase specialisee",
  options: SEGMENT_PROFILE_OPTIONS.map((option) => ({
    title: option.label,
    value: option.segment,
    subtitle: option.helper,
  })),
  ui_config: {
    allowFreeText: false,
    submitButtonText: "Demarrer le profil",
    helperNote: "Le profil active des questions specifiques a ton niveau.",
  },
};

const pageFadeTransition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1] as const,
};

const timelineContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const timelineStepVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const dashboardGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const dashboardCardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function getSkillLevel(index: number, confidence: number): number {
  const base = confidence - index * 9 + (index % 2 === 0 ? 4 : -2);
  return Math.max(48, Math.min(97, base));
}

function getSchoolMatchScore(
  school: SchoolRecommendationCard,
  index: number,
  confidence: number
): number {
  const statusBonus = school.status === "Public" ? 4 : 1;
  const base = confidence - index * 4 + statusBonus;
  return Math.max(55, Math.min(98, base));
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}...`;
}

function getSchoolStatusBadgeStyles(status: SchoolRecommendationCard["status"]): string {
  return status === "Prive"
    ? "border-amber-200 bg-amber-100 text-amber-900"
    : "border-emerald-200 bg-emerald-100 text-emerald-800";
}

function getSchoolConclusionStyles(status: SchoolRecommendationCard["status"]): string {
  return status === "Prive"
    ? "border-amber-200 bg-amber-50 text-amber-950"
    : "border-emerald-200 bg-emerald-50 text-emerald-950";
}

function ConfidenceGauge({ confidence }: { confidence: number }) {
  const degrees = Math.min(100, Math.max(0, confidence)) * 3.6;

  return (
    <div className="flex flex-col items-center gap-2" aria-label={`Niveau de confiance ${confidence}%`}>
      <div
        className="relative h-28 w-28 rounded-full"
        style={{
          background: `conic-gradient(#5f63ff ${degrees}deg, #e6e8ff ${degrees}deg 360deg)`,
        }}
      >
        <div className="absolute inset-[7px] grid place-items-center rounded-full border border-indigo-100/80 bg-white shadow-[inset_0_4px_22px_rgba(91,99,255,0.12)]">
          <span className="text-xl font-extrabold text-indigo-900">{confidence}%</span>
        </div>
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
        Niveau de confiance
      </span>
    </div>
  );
}

function SessionTabs({
  sessions,
  activeSessionId,
  onSelect,
}: {
  sessions: OrientationResultSession[];
  activeSessionId: string;
  onSelect: (sessionId: string) => void;
}) {
  return (
    <div className="mt-6 overflow-x-auto pb-2">
      <div className="inline-flex min-w-full gap-2 rounded-2xl border border-indigo-100 bg-white/80 p-2 shadow-[0_10px_35px_rgba(54,55,100,0.08)]">
        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;

          return (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session.id)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_10px_24px_rgba(63,71,235,0.35)]"
                  : "bg-white text-indigo-900 hover:bg-indigo-50"
              }`}
              aria-pressed={isActive}
            >
              {session.tabLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function OrientationIASession() {
  const navigate = useNavigate();
  const genericQuestionCount = PRE_PROFILE_GENERIC_QUESTIONS.length;

  const [phase, setPhase] = useState<SessionPhase>("quiz");
  const [selectedSegment, setSelectedSegment] = useState<OrientationSegment | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<PhaseQuestionAnswer[]>([]);
  const [aiAnswers, setAiAnswers] = useState<PhaseQuestionAnswer[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [archived, setArchived] = useState(false);
  const [resultSessions, setResultSessions] = useState<OrientationResultSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);

  const exportContainerRef = useRef<HTMLDivElement | null>(null);
  const generationTimeoutRef = useRef<number | null>(null);
  const autoSubmitTimeoutRef = useRef<number | null>(null);
  const autoSubmitLockRef = useRef(false);

  const phase1Questions = useMemo(() => {
    if (!selectedSegment) {
      return [];
    }

    return getPhase1QuestionsBySegment(selectedSegment);
  }, [selectedSegment]);

  const aiGeneratedQuestions = useMemo(() => {
    if (!selectedSegment) {
      return [];
    }

    return getMockAiGeneratedQuestionsBySegment(selectedSegment, 3);
  }, [selectedSegment]);

  const currentQuestion = useMemo(() => {
    if (phase === "quiz") {
      if (quizQuestionIndex < genericQuestionCount) {
        return PRE_PROFILE_GENERIC_QUESTIONS[quizQuestionIndex] ?? null;
      }

      if (quizQuestionIndex === genericQuestionCount) {
        return SEGMENT_SELECTION_QUESTION;
      }

      if (!selectedSegment) {
        return null;
      }

      return phase1Questions[quizQuestionIndex - genericQuestionCount - 1] ?? null;
    }

    if (phase === "ai-quiz") {
      return aiGeneratedQuestions[aiQuestionIndex] ?? null;
    }

    return null;
  }, [aiGeneratedQuestions, aiQuestionIndex, genericQuestionCount, phase, phase1Questions, quizQuestionIndex, selectedSegment]);

  const activeSession = useMemo(() => {
    return resultSessions.find((session) => session.id === activeSessionId) ?? resultSessions[0];
  }, [activeSessionId, resultSessions]);

  const canGoBack = phase === "quiz" && quizQuestionIndex > 0 && !archived;

  const progressLabel = useMemo(() => {
    if (phase === "quiz") {
      const total = genericQuestionCount + 1 + phase1Questions.length;
      return `Question ${Math.min(quizQuestionIndex + 1, total)}/${total}`;
    }

    if (phase === "ai-quiz") {
      const total = Math.max(aiGeneratedQuestions.length, 1);
      return `Questions IA ${Math.min(aiQuestionIndex + 1, total)}/${total}`;
    }

    if (phase === "generating") {
      return "Analyse IA en cours";
    }

    return `Resultats: ${resultSessions.length} generation(s)`;
  }, [aiGeneratedQuestions.length, aiQuestionIndex, genericQuestionCount, phase, phase1Questions.length, quizQuestionIndex, resultSessions.length]);

  const canSubmitCurrentQuestion = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }

    const trimmed = customAnswer.trim();

    if (currentQuestion.type === "libre") {
      return trimmed.length > 0;
    }

    if (selectedOptionValues.length > 0) {
      return true;
    }

    if (currentQuestion.ui_config.allowFreeText) {
      return trimmed.length > 0;
    }

    return false;
  }, [currentQuestion, customAnswer, selectedOptionValues.length]);

  const requiresManualSubmit = useMemo(() => {
    if (!currentQuestion) {
      return false;
    }

    if (currentQuestion.type === "single" && !currentQuestion.ui_config.allowFreeText) {
      return false;
    }

    return true;
  }, [currentQuestion]);

  const skillVisuals = useMemo(() => {
    if (!activeSession) {
      return [];
    }

    return activeSession.verdict.skillsToImprove.map((skill, index) => ({
      skill,
      level: getSkillLevel(index, activeSession.verdict.confidence),
    }));
  }, [activeSession]);

  const schoolVisuals = useMemo(() => {
    if (!activeSession) {
      return [];
    }

    return activeSession.schools.map((school, index) => ({
      ...school,
      matchScore: getSchoolMatchScore(school, index, activeSession.verdict.confidence),
      conciseConclusion: truncateText(school.conclusion, 108),
    }));
  }, [activeSession]);

  const schoolMix = useMemo(() => {
    if (!activeSession) {
      return {
        publicCount: 0,
        privateCount: 0,
        publicPercent: 0,
      };
    }

    const publicCount = activeSession.schools.filter((school) => school.status === "Public").length;
    const privateCount = activeSession.schools.length - publicCount;
    const publicPercent = activeSession.schools.length
      ? Math.round((publicCount / activeSession.schools.length) * 100)
      : 0;

    return {
      publicCount,
      privateCount,
      publicPercent,
    };
  }, [activeSession]);

  useEffect(() => {
    const storedAnswer =
      phase === "quiz" ? quizAnswers[quizQuestionIndex] : phase === "ai-quiz" ? aiAnswers[aiQuestionIndex] : undefined;

    setSelectedOptionValues(storedAnswer?.selectedValues ?? []);
    setCustomAnswer(storedAnswer?.freeText ?? "");
    autoSubmitLockRef.current = false;
  }, [aiAnswers, aiQuestionIndex, phase, quizAnswers, quizQuestionIndex]);

  useEffect(() => {
    return () => {
      if (generationTimeoutRef.current) {
        window.clearTimeout(generationTimeoutRef.current);
      }

      if (autoSubmitTimeoutRef.current) {
        window.clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, []);

  function clearGenerationTimeout() {
    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
      generationTimeoutRef.current = null;
    }
  }

  function triggerVerdict(archiveAfter = false, segmentOverride?: OrientationSegment | null) {
    clearGenerationTimeout();
    const effectiveSegment = segmentOverride ?? selectedSegment;

    setPhase("generating");
    generationTimeoutRef.current = window.setTimeout(() => {
      const segmentLabel = effectiveSegment ? getSegmentLabel(effectiveSegment) : undefined;
      const baseSessions = createBaseResultSessions(DEFAULT_VERDICT, segmentLabel);

      setResultSessions(baseSessions);
      setActiveSessionId(baseSessions[0]?.id ?? "");
      setGenerationPrompt("");
      setGenerationError("");
      setPhase("chat");

      if (archiveAfter) {
        setArchived(true);
      }
    }, VERDICT_DELAY_MS);
  }

  function triggerAiQuestionPhase(segment: OrientationSegment) {
    clearGenerationTimeout();
    setPhase("generating");

    generationTimeoutRef.current = window.setTimeout(() => {
      const generated = getMockAiGeneratedQuestionsBySegment(segment, 3);

      if (generated.length === 0) {
        triggerVerdict(false, segment);
        return;
      }

      setAiAnswers([]);
      setAiQuestionIndex(0);
      setPhase("ai-quiz");
    }, VERDICT_DELAY_MS);
  }

  function buildCurrentAnswer(
    question: BaseOrientationQuestion,
    selectedValues: string[] = selectedOptionValues,
    answerText: string = customAnswer
  ): PhaseQuestionAnswer {
    const selectedTitles = question.options
      .filter((option) => selectedValues.includes(option.value))
      .map((option) => option.title);
    const trimmed = answerText.trim();

    return {
      questionId: question.id,
      dbKey: question.db_key,
      selectedValues,
      selectedTitles,
      freeText: trimmed.length > 0 ? trimmed : undefined,
    };
  }

  function saveCurrentAnswer(answer: PhaseQuestionAnswer) {
    if (phase === "quiz") {
      setQuizAnswers((previous) => {
        const next = [...previous];
        next[quizQuestionIndex] = answer;

        return next.slice(0, quizQuestionIndex + 1);
      });

      return;
    }

    if (phase === "ai-quiz") {
      setAiAnswers((previous) => {
        const next = [...previous];
        next[aiQuestionIndex] = answer;

        return next.slice(0, aiQuestionIndex + 1);
      });
    }
  }

  function submitCurrentQuestion(
    question: BaseOrientationQuestion,
    selectedValues: string[] = selectedOptionValues,
    answerText: string = customAnswer
  ) {
    if (archived) {
      return;
    }

    const trimmed = answerText.trim();
    const hasSelectedValues = selectedValues.length > 0;
    const canSubmit =
      question.type === "libre"
        ? trimmed.length > 0
        : hasSelectedValues || (question.ui_config.allowFreeText && trimmed.length > 0);

    if (!canSubmit) {
      return;
    }

    const answer = buildCurrentAnswer(question, selectedValues, answerText);
    saveCurrentAnswer(answer);

    if (phase === "quiz") {
      if (quizQuestionIndex < genericQuestionCount) {
        setQuizQuestionIndex((previous) => previous + 1);
        return;
      }

      if (quizQuestionIndex === genericQuestionCount) {
        const segmentValue = answer.selectedValues[0] as OrientationSegment | undefined;

        if (!segmentValue) {
          return;
        }

        setSelectedSegment(segmentValue);
        setQuizAnswers((previous) => previous.slice(0, genericQuestionCount + 1));

        const segmentQuestionCount = getPhase1QuestionsBySegment(segmentValue).length;
        if (segmentQuestionCount === 0) {
          triggerAiQuestionPhase(segmentValue);
          return;
        }

        setQuizQuestionIndex(genericQuestionCount + 1);
        return;
      }

      if (!selectedSegment) {
        return;
      }

      const phase1Index = quizQuestionIndex - genericQuestionCount - 1;
      const isLastPhase1Question = phase1Index >= phase1Questions.length - 1;

      if (isLastPhase1Question) {
        triggerAiQuestionPhase(selectedSegment);
        return;
      }

      setQuizQuestionIndex((previous) => previous + 1);
      return;
    }

    if (phase === "ai-quiz") {
      const isLastAiQuestion = aiQuestionIndex >= aiGeneratedQuestions.length - 1;

      if (isLastAiQuestion) {
        triggerVerdict(false);
        return;
      }

      setAiQuestionIndex((previous) => previous + 1);
    }
  }

  function toggleOptionValue(value: string) {
    if (!currentQuestion) {
      return;
    }

    if (currentQuestion.type === "single") {
      const nextSelected = [value];
      setSelectedOptionValues(nextSelected);

      const shouldAutoSubmit = !currentQuestion.ui_config.allowFreeText;
      if (!shouldAutoSubmit || autoSubmitLockRef.current) {
        return;
      }

      autoSubmitLockRef.current = true;
      autoSubmitTimeoutRef.current = window.setTimeout(() => {
        submitCurrentQuestion(currentQuestion, nextSelected, customAnswer);
      }, AUTO_SUBMIT_DELAY_MS);

      return;
    }

    if (currentQuestion.type !== "multi") {
      return;
    }

    const maxSelections = currentQuestion.ui_config.maxSelections ?? 2;

    setSelectedOptionValues((previous) => {
      if (previous.includes(value)) {
        return previous.filter((item) => item !== value);
      }

      if (previous.length >= maxSelections) {
        return previous;
      }

      return [...previous, value];
    });
  }

  function handleQuestionSubmit(event: FormEvent) {
    event.preventDefault();

    if (!currentQuestion || !canSubmitCurrentQuestion) {
      return;
    }

    submitCurrentQuestion(currentQuestion, selectedOptionValues, customAnswer);
  }

  function handleGoBack() {
    if (!canGoBack) {
      return;
    }

    setQuizQuestionIndex((previous) => previous - 1);
  }

  function handleCloseSession() {
    if (archived) {
      return;
    }

    if (phase === "chat") {
      setArchived(true);
      return;
    }

    triggerVerdict(true);
  }

  function handleGenerateNewSession() {
    if (archived) {
      return;
    }

    const trimmedPrompt = generationPrompt.trim();
    if (!trimmedPrompt) {
      setGenerationError("Precise ce que tu veux modifier avant de generer un nouveau resultat.");
      return;
    }

    const generationNumber = resultSessions.length + 1;
    const nextSession = buildNextMockSession(
      DEFAULT_VERDICT,
      generationNumber,
      trimmedPrompt,
      selectedSegment ? getSegmentLabel(selectedSegment) : undefined
    );

    setResultSessions((previous) => [...previous, nextSession]);
    setActiveSessionId(nextSession.id);
    setGenerationPrompt("");
    setGenerationError("");
    setIsGenerationModalOpen(false);
  }

  function handleOpenGenerationModal() {
    if (archived) {
      return;
    }

    setGenerationError("");
    setIsGenerationModalOpen(true);
  }

  function handleCloseGenerationModal() {
    setGenerationError("");
    setIsGenerationModalOpen(false);
  }

  async function handleExportPdf() {
    if (!exportContainerRef.current) {
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(exportContainerRef.current, {
      scale: 2,
      backgroundColor: "#f7f5ff",
      useCORS: true,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`orientationia-session-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#f8f5ff]"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
          }
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-12 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-200/25 blur-3xl" />
      </div>

      <NeuralPulseCorner />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="no-print">
          <SessionTopBar
            archived={archived}
            onQuit={() => navigate("/")}
            onCloseSession={handleCloseSession}
            onExportPdf={handleExportPdf}
            onPrint={handlePrint}
          />
        </div>

        {archived ? (
          <div className="no-print mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Cette session est terminee et archivee.
          </div>
        ) : null}

        <main ref={exportContainerRef} className="mt-4 flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {(phase === "quiz" || phase === "ai-quiz") && currentQuestion ? (
              <motion.section
                key={`${phase}-${quizQuestionIndex}-${aiQuestionIndex}-${selectedSegment ?? "none"}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mx-auto my-auto w-full max-w-4xl rounded-3xl border border-indigo-200/60 bg-white/70 p-6 shadow-[0_20px_70px_rgba(92,65,188,0.14)] backdrop-blur-xl md:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.11em] text-indigo-700">
                    {phase === "ai-quiz" ? "Questions IA" : "Session active"}
                  </span>
                  <span className="text-sm font-semibold text-indigo-800">{progressLabel}</span>
                </div>

                <div className="rounded-2xl border border-indigo-200/60 bg-white/80 px-5 py-6">
                  <TypewriterText
                    text={currentQuestion.questionText}
                    className="text-center text-2xl font-extrabold leading-tight text-indigo-950"
                  />
                  <p data-testid="quiz-question-full" className="sr-only">
                    {currentQuestion.questionText}
                  </p>
                  {currentQuestion.subText ? (
                    <p className="mt-2 text-center text-sm font-medium text-indigo-800/80">
                      {currentQuestion.subText}
                    </p>
                  ) : null}
                  {currentQuestion.ui_config.helperNote ? (
                    <p className="mt-2 text-center text-sm text-indigo-700/85">
                      {currentQuestion.ui_config.helperNote}
                    </p>
                  ) : null}
                </div>

                {currentQuestion.options.length > 0 ? (
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedOptionValues.includes(option.value);

                      return (
                        <ChoiceCard
                          key={option.value}
                          label={option.title}
                          helper={option.subtitle}
                          selected={isSelected}
                          onClick={() => toggleOptionValue(option.value)}
                        />
                      );
                    })}
                  </div>
                ) : null}

                {currentQuestion.type === "multi" && currentQuestion.ui_config.maxSelections ? (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.09em] text-indigo-700/80">
                    Choisis jusqu'a {currentQuestion.ui_config.maxSelections} options.
                  </p>
                ) : null}

                {(currentQuestion.type === "libre" || currentQuestion.ui_config.allowFreeText) ? (
                  <div className="mt-5 space-y-3">
                    <label className="text-sm font-semibold text-indigo-900">
                      {currentQuestion.ui_config.freeTextPrompt || "Tu peux aussi ecrire une reponse libre"}
                    </label>
                    <textarea
                      value={customAnswer}
                      onChange={(event) => setCustomAnswer(event.target.value)}
                      placeholder={
                        currentQuestion.ui_config.freeTextPlaceholder ||
                        "Ecris ta reponse ici"
                      }
                      className="min-h-24 w-full rounded-2xl border border-indigo-200/70 bg-white px-4 py-3 text-sm text-indigo-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/40"
                    />
                  </div>
                ) : null}

                {!requiresManualSubmit ? (
                  <p className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-2 text-sm font-semibold text-indigo-800">
                    Validation automatique active: choisis une reponse pour passer a la suite.
                  </p>
                ) : null}

                <form onSubmit={handleQuestionSubmit} className="mt-6 flex flex-wrap items-center gap-3">
                  {canGoBack ? (
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-bold text-indigo-800 transition hover:bg-indigo-50"
                    >
                      <ChevronLeft size={16} />
                      Question precedente
                    </button>
                  ) : null}

                  {requiresManualSubmit ? (
                    <button
                      type="submit"
                      disabled={!canSubmitCurrentQuestion}
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {currentQuestion.ui_config.submitButtonText || "Suivant"}
                    </button>
                  ) : null}
                </form>
              </motion.section>
            ) : null}

            {phase === "generating" ? (
              <motion.section
                key="generating"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mx-auto my-auto flex w-full items-center justify-center"
              >
                <FuturisticThinking />
              </motion.section>
            ) : null}

            {phase === "chat" && activeSession ? (
              <motion.section
                key="dashboard"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={pageFadeTransition}
                className="mx-auto w-full max-w-7xl space-y-4"
              >
                <article className="rounded-3xl border border-indigo-100 bg-white/80 p-5 shadow-[0_20px_55px_rgba(67,66,122,0.09)] backdrop-blur md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        Dashboard de restitution Orientation IA
                      </h1>
                      <p className="mt-1 text-sm text-slate-600 sm:text-base">
                        Vue compacte, visuelle et dynamique de ta generation active.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenGenerationModal}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      <Plus size={16} />
                      Nouvelle generation
                    </button>
                  </div>

                  <SessionTabs
                    sessions={resultSessions}
                    activeSessionId={activeSession.id}
                    onSelect={setActiveSessionId}
                  />
                </article>

                <motion.section
                  variants={dashboardGridVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 lg:grid-cols-12"
                >
                  <motion.article
                    variants={dashboardCardVariants}
                    className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-[0_18px_45px_rgba(58,53,106,0.08)] md:p-6 lg:col-span-8"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
                          Verdict orientation
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{activeSession.verdict.profile}</h2>
                        <p className="text-sm text-slate-600">{truncateText(activeSession.verdict.description, 180)}</p>
                      </div>

                      <ConfidenceGauge confidence={activeSession.verdict.confidence} />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700">Generation</p>
                        <p className="mt-1 text-xl font-extrabold text-indigo-950">#{resultSessions.indexOf(activeSession) + 1}</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700">Ecoles</p>
                        <p className="mt-1 text-xl font-extrabold text-indigo-950">{activeSession.schools.length}</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700">Timeline</p>
                        <p className="mt-1 text-xl font-extrabold text-indigo-950">{activeSession.timeline.length} etapes</p>
                      </div>
                      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-indigo-700">Mise a jour</p>
                        <p className="mt-1 text-sm font-bold text-indigo-950">{activeSession.generatedAt}</p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/75 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Cap principal vise
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                        {activeSession.verdict.mainTarget}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Derniere consigne: {activeSession.modificationPrompt || "Aucune"}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                        Competences a renforcer
                      </p>
                      <div className="mt-3 space-y-3">
                        {skillVisuals.map((item) => (
                          <div key={item.skill}>
                            <div className="mb-1 flex items-center justify-between">
                              <span className="text-sm font-semibold text-slate-800">{item.skill}</span>
                              <span className="text-xs font-bold text-indigo-700">{item.level}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-indigo-100">
                              <motion.div
                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.level}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.article>

                  <motion.article
                    variants={dashboardCardVariants}
                    className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-[0_18px_45px_rgba(58,53,106,0.08)] md:p-6 lg:col-span-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">Mix ecoles</h3>
                      <BarChart3 size={18} className="text-indigo-600" />
                    </div>

                    <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.11em] text-indigo-700">
                        Repartition public/prive
                      </p>
                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-indigo-100">
                        <motion.div
                          className="h-3 bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${schoolMix.publicPercent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>Public: {schoolMix.publicCount}</span>
                        <span>Prive: {schoolMix.privateCount}</span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {schoolVisuals.slice(0, 3).map((school) => (
                        <motion.div
                          key={school.id}
                          whileHover={{ y: -2 }}
                          className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-slate-900">{school.name}</p>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${getSchoolStatusBadgeStyles(
                                school.status
                              )}`}
                            >
                              {school.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{school.location}</p>
                          <div className="mt-2 h-1.5 rounded-full bg-indigo-100">
                            <motion.div
                              className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${school.matchScore}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-1 text-[11px] font-semibold text-indigo-700">
                            Match estime: {school.matchScore}%
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.article>

                  <motion.article
                    variants={dashboardCardVariants}
                    className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-[0_18px_45px_rgba(58,53,106,0.08)] md:p-6 lg:col-span-12"
                  >
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Timeline du cursus</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Vision etapes cles en version compacte.
                        </p>
                      </div>
                      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
                        {activeSession.timeline.length} etape(s)
                      </span>
                    </div>

                    <motion.ol
                      className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
                      variants={timelineContainerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {activeSession.timeline.map((step, index) => (
                        <motion.li
                          key={step.id}
                          variants={timelineStepVariants}
                          className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                          data-testid="timeline-step"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                              {index + 1}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-indigo-700">
                              {step.yearTitle}
                            </span>
                          </div>
                          <h4 className="mt-3 text-sm font-bold text-slate-900">{step.subtitle}</h4>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {truncateText(step.details[0] ?? "", 96)}
                          </p>
                        </motion.li>
                      ))}
                    </motion.ol>
                  </motion.article>

                  <motion.article
                    variants={dashboardCardVariants}
                    className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-[0_18px_45px_rgba(58,53,106,0.08)] md:p-6 lg:col-span-12"
                  >
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Ecoles et formations</h3>
                        <p className="mt-1 text-sm text-slate-600">
                          Cartes condensees avec score de correspondance et infos essentielles.
                        </p>
                      </div>
                      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800">
                        {activeSession.schools.length} recommandation(s)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {schoolVisuals.map((school) => (
                        <motion.article
                          key={school.id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(74,66,128,0.07)]"
                          data-testid="school-card"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-bold text-slate-900">{school.name}</h4>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-bold ${getSchoolStatusBadgeStyles(
                                school.status
                              )}`}
                            >
                              {school.status}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-600">{school.location}</p>

                          <div className="mt-3 h-2 rounded-full bg-indigo-100">
                            <motion.div
                              className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                              initial={{ width: 0 }}
                              animate={{ width: `${school.matchScore}%` }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                          </div>
                          <p className="mt-1 text-xs font-semibold text-indigo-700">
                            Score de correspondance: {school.matchScore}%
                          </p>

                          <div className="mt-3 space-y-1 text-xs text-slate-700">
                            <p>
                              <span className="font-semibold text-slate-900">Formation: </span>
                              {truncateText(school.program, 76)}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-900">Duree: </span>
                              {school.duration}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-900">Cout: </span>
                              {school.cost}
                            </p>
                          </div>

                          <div
                            className={`mt-3 rounded-xl border px-3 py-2 text-xs font-medium ${getSchoolConclusionStyles(
                              school.status
                            )}`}
                          >
                            {school.conciseConclusion}
                          </div>
                        </motion.article>
                      ))}
                    </div>
                  </motion.article>
                </motion.section>
              </motion.section>
            ) : null}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {isGenerationModalOpen ? (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Nouvelle generation"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-xl rounded-3xl border border-indigo-100 bg-white p-6 shadow-[0_24px_80px_rgba(30,36,90,0.28)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
                      <Sparkles size={14} />
                      Regeneration IA
                    </p>
                    <h2 className="mt-3 text-xl font-bold text-slate-900">Generer une nouvelle variante</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Decris ce que tu veux ajuster pour creer un nouveau dashboard.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseGenerationModal}
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                    aria-label="Fermer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleGenerateNewSession();
                  }}
                  className="mt-5 space-y-4"
                >
                  <textarea
                    value={generationPrompt}
                    onChange={(event) => {
                      setGenerationPrompt(event.target.value);
                      if (generationError) {
                        setGenerationError("");
                      }
                    }}
                    placeholder="Ex: Renforcer les options en alternance et budget public"
                    className="min-h-28 w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm text-indigo-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/40"
                  />

                  {generationError ? (
                    <p className="text-sm font-medium text-rose-700">{generationError}</p>
                  ) : null}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCloseGenerationModal}
                      className="rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                    >
                      <Sparkles size={15} />
                      Generer maintenant
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}