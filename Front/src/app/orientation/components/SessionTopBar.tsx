import { LogOut, Printer, ShieldCheck, XCircle } from "lucide-react";

interface SessionTopBarProps {
  archived: boolean;
  onQuit: () => void;
  onCloseSession: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

export function SessionTopBar({
  archived,
  onQuit,
  onCloseSession,
  onExportPdf,
  onPrint,
}: SessionTopBarProps) {
  return (
    <header className="z-20 flex w-full items-center justify-between rounded-2xl border border-indigo-200/60 bg-white/70 px-4 py-3 shadow-[0_8px_30px_rgba(87,63,182,0.14)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.1em] text-indigo-700">Session Orientation IA</p>
          <p className="text-xs text-indigo-900/80">
            {archived ? "Mode archive read-only" : "Session active immersive"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {archived ? (
          <>
            <button
              type="button"
              onClick={onExportPdf}
              className="rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-900 transition hover:bg-indigo-50"
            >
              Exporter en PDF
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Printer size={14} />
              Imprimer
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onQuit}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <LogOut size={14} />
              Quitter
            </button>
            <button
              type="button"
              onClick={onCloseSession}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <XCircle size={14} />
              Cloturer la session
            </button>
          </>
        )}
      </div>
    </header>
  );
}
