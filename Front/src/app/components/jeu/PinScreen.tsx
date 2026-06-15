import { useState } from "react";
import { Gamepad2 } from "lucide-react";

interface PinScreenProps {
  connected: boolean;
  error: string;
  onJoin: (pin: string) => Promise<unknown>;
}

export function PinScreen({ connected, error, onJoin }: PinScreenProps) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pin.length !== 6) return;
    setLoading(true);
    await onJoin(pin);
    setLoading(false);
  };

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#1C1C2E] px-4 text-white">
      <form onSubmit={submit} className="w-full max-w-md text-center">
        <Gamepad2 className="mx-auto text-[#FF7957]" size={54} aria-hidden="true" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#FF7957]">Elles Bougent</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Rejoins la partie</h1>
        <p className="mt-3 font-semibold text-white/65">Entre le PIN affiché par l'animatrice.</p>
        <label htmlFor="session-pin" className="sr-only">PIN à 6 chiffres</label>
        <input
          id="session-pin"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={pin}
          onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="mt-8 w-full rounded-xl border-2 border-white/20 bg-white/10 px-5 py-5 text-center text-4xl font-black tracking-[0.25em] text-white outline-none placeholder:text-white/20 focus-visible:ring-4 focus-visible:ring-orange-300/60"
          aria-describedby={error ? "pin-error" : undefined}
        />
        {error ? <p id="pin-error" className="mt-3 font-bold text-red-300" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={!connected || pin.length !== 6 || loading}
          className="mt-5 w-full rounded-xl bg-[#E8431A] px-6 py-5 text-lg font-black outline-none focus-visible:ring-4 focus-visible:ring-white/60 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {!connected ? "Connexion au serveur..." : loading ? "Connexion..." : "Rejoindre"}
        </button>
      </form>
    </main>
  );
}
