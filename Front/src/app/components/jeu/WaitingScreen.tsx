import { motion } from "framer-motion";
import { CheckCircle2, WifiOff } from "lucide-react";

interface WaitingScreenProps {
  pin: string;
  answerRecorded?: boolean;
  paused?: boolean;
}

export function WaitingScreen({ pin, answerRecorded = false, paused = false }: WaitingScreenProps) {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#11111D] px-4 text-center text-white">
      <div className="max-w-lg">
        {paused ? (
          <WifiOff className="mx-auto text-orange-300" size={48} aria-hidden="true" />
        ) : answerRecorded ? (
          <CheckCircle2 className="mx-auto text-green-300" size={52} aria-hidden="true" />
        ) : (
          <motion.div
            className="mx-auto h-16 w-16 rounded-full border-4 border-white/15 border-t-[#FF7957]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />
        )}
        <h1 className="mt-7 text-3xl font-black sm:text-5xl">
          {paused
            ? "Session en pause"
            : answerRecorded
              ? "Ta réponse est enregistrée ✓"
              : "En attente de l'animatrice..."}
        </h1>
        <p className="mt-4 font-semibold text-white/60">
          {paused ? "La partie reprendra automatiquement à sa reconnexion." : `Session ${pin}`}
        </p>
      </div>
    </main>
  );
}
