import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import { SendHorizontal } from "lucide-react";
import {
  DEFAULT_VERDICT,
  ORIENTATION_QUIZ_QUESTIONS,
  buildVerdictAsFirstMessage,
  getAssistantFollowUpReply,
} from "../orientation/mockData";
import { ChatMessage, QuizAnswer, SessionPhase } from "../orientation/types";
import { ChatMessageBubble } from "../orientation/components/ChatMessageBubble";
import { ChoiceCard } from "../orientation/components/ChoiceCard";
import { FuturisticThinking } from "../orientation/components/FuturisticThinking";
import { NeuralPulseCorner } from "../orientation/components/NeuralPulseCorner";
import { SessionTopBar } from "../orientation/components/SessionTopBar";
import { TypewriterText } from "../orientation/components/TypewriterText";

const VERDICT_DELAY_MS = import.meta.env.MODE === "test" ? 0 : 1600;
const ASSISTANT_REPLY_DELAY_MS = import.meta.env.MODE === "test" ? 0 : 900;

function createMessageId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function OrientationIASession() {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<SessionPhase>("quiz");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [customAnswer, setCustomAnswer] = useState("");
  const [archived, setArchived] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [assistantTyping, setAssistantTyping] = useState(false);

  const exportContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const generationTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  const currentQuestion = ORIENTATION_QUIZ_QUESTIONS[currentQuestionIndex];

  const progressLabel = useMemo(() => {
    if (phase !== "quiz") {
      return `Quiz termine - ${answers.length}/${ORIENTATION_QUIZ_QUESTIONS.length} reponses`;
    }
    return `Question ${currentQuestionIndex + 1}/${ORIENTATION_QUIZ_QUESTIONS.length}`;
  }, [answers.length, currentQuestionIndex, phase]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, assistantTyping, phase]);

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

  function triggerVerdict(archiveAfter = false) {
    if (generationTimeoutRef.current) {
      window.clearTimeout(generationTimeoutRef.current);
    }

    setPhase("generating");
    generationTimeoutRef.current = window.setTimeout(() => {
      setChatMessages((previous) => {
        if (previous.length > 0) {
          return previous;
        }
        return [buildVerdictAsFirstMessage(DEFAULT_VERDICT)];
      });
      setPhase("chat");
      if (archiveAfter) {
        setArchived(true);
      }
    }, VERDICT_DELAY_MS);
  }

  function goToNextStep(answer: QuizAnswer) {
    setAnswers((previous) => [...previous, answer]);
    setCustomAnswer("");

    const isLastQuestion = currentQuestionIndex >= ORIENTATION_QUIZ_QUESTIONS.length - 1;
    if (isLastQuestion) {
      triggerVerdict(false);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  function handleOptionChoice(optionId: string, optionLabel: string) {
    if (!currentQuestion) {
      return;
    }

    goToNextStep({
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      selectedOptionLabel: optionLabel,
    });
  }

  function handleCustomAnswerSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = customAnswer.trim();
    if (!trimmed || !currentQuestion) {
      return;
    }

    goToNextStep({
      questionId: currentQuestion.id,
      freeText: trimmed,
    });
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
            {phase === "quiz" && currentQuestion ? (
              <motion.section
                key="quiz"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="mx-auto my-auto w-full max-w-4xl rounded-3xl border border-indigo-200/60 bg-white/70 p-6 shadow-[0_20px_70px_rgba(92,65,188,0.14)] backdrop-blur-xl md:p-8"
              >
                <div className="mb-6 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.11em] text-indigo-700">
                    Session active
                  </span>
                  <span className="text-sm font-semibold text-indigo-800">{progressLabel}</span>
                </div>

                <div className="rounded-2xl border border-indigo-200/60 bg-white/80 px-5 py-6">
                  <TypewriterText
                    text={currentQuestion.prompt}
                    className="text-center text-2xl font-extrabold leading-tight text-indigo-950"
                  />
                  <p data-testid="quiz-question-full" className="sr-only">
                    {currentQuestion.prompt}
                  </p>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {currentQuestion.options.map((option) => (
                    <ChoiceCard
                      key={option.id}
                      label={option.label}
                      helper={option.helper}
                      onClick={() => handleOptionChoice(option.id, option.label)}
                    />
                  ))}
                </div>

                <form onSubmit={handleCustomAnswerSubmit} className="mt-5 space-y-3">
                  <label className="text-sm font-semibold text-indigo-900">
                    Tu peux aussi ecrire une reponse libre
                  </label>
                  <textarea
                    value={customAnswer}
                    onChange={(event) => setCustomAnswer(event.target.value)}
                    placeholder={currentQuestion.inputPlaceholder}
                    className="min-h-24 w-full rounded-2xl border border-indigo-200/70 bg-white px-4 py-3 text-sm text-indigo-950 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-200/40"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                  >
                    Valider cette reponse
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
                    Conversation continue: pose tes questions et affine ton plan.
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
