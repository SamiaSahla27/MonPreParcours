import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ChevronLeft, SendHorizontal } from "lucide-react";
import {
  DEFAULT_VERDICT,
  SEGMENT_PROFILE_OPTIONS,
  buildVerdictAsFirstMessage,
  getAssistantFollowUpReply,
  getMockAiGeneratedQuestionsBySegment,
  getPhase1QuestionsBySegment,
  getSegmentLabel,
} from "../orientation/mockData";
import {
  ChatMessage,
  OrientationSegment,
  PhaseQuestion,
  PhaseQuestionAnswer,
  SessionPhase,
} from "../orientation/types";
import { ChatMessageBubble } from "../orientation/components/ChatMessageBubble";
import { ChoiceCard } from "../orientation/components/ChoiceCard";
import { FuturisticThinking } from "../orientation/components/FuturisticThinking";
import { NeuralPulseCorner } from "../orientation/components/NeuralPulseCorner";
import { SessionTopBar } from "../orientation/components/SessionTopBar";
import { TypewriterText } from "../orientation/components/TypewriterText";

const viteMode = (import.meta as ImportMeta & { env?: { MODE?: string } }).env?.MODE;
const VERDICT_DELAY_MS = viteMode === "test" ? 0 : 1600;
const ASSISTANT_REPLY_DELAY_MS = viteMode === "test" ? 0 : 900;

const SEGMENT_SELECTION_QUESTION: PhaseQuestion = {
  id: "SEGMENT-SELECT",
  db_key: "type_personnalite",
  type: "single",
  segment: "lyceen",
  questionText: "Quel est ton type de personnalite ?",
  subText: "Choisis le profil qui te correspond pour definir ta phase",
  options: SEGMENT_PROFILE_OPTIONS.map((option) => ({
    title: option.label,
    value: option.segment,
    subtitle: option.helper,
  })),
  ui_config: {
    allowFreeText: false,
    submitButtonText: "Demarrer le quiz",
    helperNote: "Cette etape determine les questions adaptees a ton profil.",
  },
};

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function OrientationIASession() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<SessionPhase>("quiz");
  const [selectedSegment, setSelectedSegment] = useState<OrientationSegment | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
  const [phase1Answers, setPhase1Answers] = useState<PhaseQuestionAnswer[]>([]);
  const [aiAnswers, setAiAnswers] = useState<PhaseQuestionAnswer[]>([]);
  const [selectedOptionValues, setSelectedOptionValues] = useState<string[]>([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [archived, setArchived] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);

  const exportContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const generationTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

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
      if (quizQuestionIndex === 0) {
        return SEGMENT_SELECTION_QUESTION;
      }

      return phase1Questions[quizQuestionIndex - 1] ?? null;
    }

    if (phase === "ai-quiz") {
      return aiGeneratedQuestions[aiQuestionIndex] ?? null;
    }

    return null;
  }, [aiGeneratedQuestions, aiQuestionIndex, phase, phase1Questions, quizQuestionIndex]);

  const canGoBack = phase === "quiz" && quizQuestionIndex > 0 && !archived;

  const progressLabel = useMemo(() => {
    if (phase === "quiz") {
      const total = 1 + phase1Questions.length;
      return `Question ${Math.min(quizQuestionIndex + 1, total)}/${total}`;
    }

    if (phase === "ai-quiz") {
      const total = Math.max(aiGeneratedQuestions.length, 1);
      return `Questions IA ${Math.min(aiQuestionIndex + 1, total)}/${total}`;
    }

    if (phase === "generating") {
      return "Analyse IA en cours";
    }

    return `Analyse terminee - ${phase1Answers.length + aiAnswers.length} reponses`;
  }, [aiAnswers.length, aiGeneratedQuestions.length, aiQuestionIndex, phase, phase1Answers.length, phase1Questions.length, quizQuestionIndex]);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, assistantTyping, phase]);

  useEffect(() => {
    const storedAnswer =
      phase === "quiz" ? phase1Answers[quizQuestionIndex] : phase === "ai-quiz" ? aiAnswers[aiQuestionIndex] : undefined;

    setSelectedOptionValues(storedAnswer?.selectedValues ?? []);
    setCustomAnswer(storedAnswer?.freeText ?? "");
  }, [aiAnswers, aiQuestionIndex, phase, phase1Answers, quizQuestionIndex]);

  useEffect(() => {
    return () => {
      if (generationTimeoutRef.current) {
        window.clearTimeout(generationTimeoutRef.current);
      }

      if (replyTimeoutRef.current) {
        window.clearTimeout(replyTimeoutRef.current);
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
    const segmentLabel = effectiveSegment ? getSegmentLabel(effectiveSegment) : undefined;

    setPhase("generating");
    generationTimeoutRef.current = window.setTimeout(() => {
      setChatMessages((previous) => {
        if (previous.length > 0) {
          return previous;
        }

        return [buildVerdictAsFirstMessage(DEFAULT_VERDICT, segmentLabel)];
      });

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

  function toggleOptionValue(value: string) {
    if (!currentQuestion) {
      return;
    }

    if (currentQuestion.type === "single") {
      setSelectedOptionValues([value]);
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

  function buildCurrentAnswer(question: PhaseQuestion): PhaseQuestionAnswer {
    const selectedTitles = question.options
      .filter((option) => selectedOptionValues.includes(option.value))
      .map((option) => option.title);
    const trimmed = customAnswer.trim();

    return {
      questionId: question.id,
      dbKey: question.db_key,
      selectedValues: selectedOptionValues,
      selectedTitles,
      freeText: trimmed.length > 0 ? trimmed : undefined,
    };
  }

  function saveCurrentAnswer(answer: PhaseQuestionAnswer) {
    if (phase === "quiz") {
      setPhase1Answers((previous) => {
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

  function handleQuestionSubmit(event: FormEvent) {
    event.preventDefault();

    if (!currentQuestion || archived || !canSubmitCurrentQuestion) {
      return;
    }

    const answer = buildCurrentAnswer(currentQuestion);
    saveCurrentAnswer(answer);

    if (phase === "quiz") {
      if (quizQuestionIndex === 0) {
        const segmentValue = answer.selectedValues[0] as OrientationSegment | undefined;

        if (!segmentValue) {
          return;
        }

        setSelectedSegment(segmentValue);
        const segmentQuestionCount = getPhase1QuestionsBySegment(segmentValue).length;

        if (segmentQuestionCount === 0) {
          triggerAiQuestionPhase(segmentValue);
          return;
        }

        setQuizQuestionIndex(1);
        return;
      }

      if (!selectedSegment) {
        return;
      }

      const isLastPhase1Question = quizQuestionIndex >= phase1Questions.length;

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

  function handleSendMessage(event: FormEvent) {
    event.preventDefault();
    const trimmed = chatInput.trim();

    if (!trimmed || archived || phase !== "chat") {
      return;
    }

    const userMessage = {
      id: createMessageId("user"),
      role: "user" as const,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setChatMessages((previous) => [...previous, userMessage]);
    setChatInput("");
    setAssistantTyping(true);

    if (replyTimeoutRef.current) {
      window.clearTimeout(replyTimeoutRef.current);
    }

    replyTimeoutRef.current = window.setTimeout(() => {
      const assistantMessage = {
        id: createMessageId("assistant"),
        role: "assistant" as const,
        content: getAssistantFollowUpReply(trimmed),
        createdAt: new Date().toISOString(),
      };

      setChatMessages((previous) => [...previous, assistantMessage]);
      setAssistantTyping(false);
    }, ASSISTANT_REPLY_DELAY_MS);
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
      className="relative min-h-screen overflow-hidden bg-[#f8f5ff]"
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

                  <button
                    type="submit"
                    disabled={!canSubmitCurrentQuestion}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {currentQuestion.ui_config.submitButtonText || "Suivant"}
                  </button>
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

            {phase === "chat" ? (
              <motion.section
                key="chat"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mx-auto flex h-[calc(100vh-150px)] w-full max-w-6xl flex-col rounded-3xl border border-indigo-200/60 bg-white/60 shadow-[0_20px_70px_rgba(92,65,188,0.14)] backdrop-blur-xl"
              >
                <div className="border-b border-indigo-200/70 px-5 py-4">
                  <h3 className="text-lg font-bold text-indigo-950">Conseiller Orientation IA</h3>
                  <p className="text-sm text-indigo-800/80">
                    Verdict genere apres le quiz de phase 1 puis les 3 questions IA.
                  </p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
                  {chatMessages.map((message) => (
                    <ChatMessageBubble key={message.id} message={message} />
                  ))}

                  {assistantTyping ? (
                    <motion.div
                      className="max-w-md rounded-2xl border border-indigo-200/70 bg-white/85 px-4 py-3 text-sm text-indigo-800"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                    >
                      L'assistant prepare sa reponse...
                    </motion.div>
                  ) : null}
                  <div ref={chatEndRef} />
                </div>

                {!archived ? (
                  <form
                    onSubmit={handleSendMessage}
                    className="no-print border-t border-indigo-200/70 bg-white/80 px-4 py-4 sm:px-6"
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-indigo-200/70 bg-white px-3 py-2 shadow-[0_8px_20px_rgba(90,65,180,0.08)]">
                      <input
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        placeholder="Pose une question sur ton parcours, les debouches, les formations..."
                        className="h-10 flex-1 bg-transparent px-2 text-sm text-indigo-950 outline-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white transition hover:bg-indigo-700"
                      >
                        Envoyer
                        <SendHorizontal size={15} />
                      </button>
                    </div>
                  </form>
                ) : null}
              </motion.section>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}