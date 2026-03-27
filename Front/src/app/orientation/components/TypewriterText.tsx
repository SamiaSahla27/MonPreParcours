import { useEffect, useMemo, useState } from "react";

interface TypewriterTextProps {
  text: string;
  speedMs?: number;
  className?: string;
}

export function TypewriterText({
  text,
  speedMs = 14,
  className,
}: TypewriterTextProps) {
  if (import.meta.env.MODE === "test") {
    return <p className={className}>{text}</p>;
  }

  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setVisibleChars(0);

    const timer = window.setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= text.length) {
          window.clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [text, speedMs]);

  const renderedText = useMemo(() => text.slice(0, visibleChars), [text, visibleChars]);

  return (
    <p className={className} aria-live="polite">
      {renderedText}
      <span className="inline-block w-2 animate-pulse text-indigo-500">|</span>
    </p>
  );
}
