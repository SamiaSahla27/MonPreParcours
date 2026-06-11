import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
}

const stats = [
  { value: "20", label: "questions" },
  { value: "2", label: "parties" },
  { value: "20", label: "minutes" },
];

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#1C1C2E] px-4 py-10 text-white sm:px-8 sm:py-16">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/jeu-stereotypes/intro-jeu-stereotypes.png')" }}
        initial={{ scale: 1.04 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,10,45,0.96)_0%,rgba(28,18,62,0.86)_43%,rgba(28,18,62,0.42)_72%,rgba(28,18,62,0.28)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(18,8,38,0.7)_0%,transparent_42%)] sm:hidden" />

      <div className="relative mx-auto flex min-h-[calc(100vh-152px)] max-w-6xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
        >
          <Sparkles size={15} />
          Elles Bougent
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl text-5xl font-black leading-[0.95] sm:text-7xl lg:text-8xl"
        >
          Et toi,
          <br />
          tu penses <span className="text-[#FF7957]">quoi ?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/72 sm:text-xl"
        >
          Images, instincts, idées reçues : découvre ce que tes premières réactions disent vraiment de tes biais.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.45 } } }}
          className="mt-10 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="border-l-2 border-[#FF7957] pl-3 sm:pl-5"
            >
              <p className="text-2xl font-black sm:text-4xl">{stat.value}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-white/55 sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          type="button"
          onClick={onStart}
          className="mt-12 flex w-full max-w-sm items-center justify-center gap-3 rounded-xl bg-[#E8431A] px-6 py-5 text-lg font-black text-white shadow-[0_16px_45px_rgba(232,67,26,0.4)] outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
        >
          Je commence
          <ArrowRight size={21} />
        </motion.button>
      </div>
    </section>
  );
}
