import { motion } from "framer-motion";
import { ChatMessage } from "../types";
import { SchoolCard } from "./SchoolCard";
import { TimelinePath } from "./TimelinePath";

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

function formatHour(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-3xl ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <article
          className={`rounded-2xl px-4 py-3 shadow-[0_8px_24px_rgba(95,73,187,0.12)] ${
            isUser
              ? "bg-indigo-600 text-white"
              : "border border-indigo-200/70 bg-white/85 text-indigo-950"
          }`}
        >
          <p className="whitespace-pre-line text-sm leading-6">{message.content}</p>
        </article>

        {message.attachments?.map((attachment) => {
          if (attachment.type === "timeline" && attachment.timeline) {
            return <TimelinePath key={`${message.id}-timeline`} steps={attachment.timeline} />;
          }

          if (attachment.type === "schools" && attachment.schools) {
            return (
              <div key={`${message.id}-schools`} className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
                {attachment.schools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            );
          }

          return null;
        })}

        <span className="px-1 text-xs text-indigo-700/70">{formatHour(message.createdAt)}</span>
      </div>
    </motion.div>
  );
}
