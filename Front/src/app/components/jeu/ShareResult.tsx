import { useState } from "react";
import { Download, Share2, X } from "lucide-react";
import QRCode from "qrcode";

interface ShareResultProps {
  score: number;
  maximumScore: number;
  message: string;
}

async function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = source;
  });
}

async function createResultImage(score: number, maximumScore: number, message: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas indisponible");

  context.fillStyle = "#1C1C2E";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6A1A8A";
  context.fillRect(0, 0, 34, canvas.height);
  context.fillStyle = "#E8431A";
  context.beginPath();
  context.arc(1080, 80, 190, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#FF7957";
  context.font = "800 28px Arial";
  context.fillText("ELLES BOUGENT", 82, 82);

  context.fillStyle = "#FFFFFF";
  context.font = "900 58px Arial";
  context.fillText("Et toi, tu penses quoi ?", 82, 175);

  context.fillStyle = "#FFFFFF";
  context.font = "900 132px Arial";
  context.fillText(String(score), 82, 340);
  const scoreWidth = context.measureText(String(score)).width;
  context.fillStyle = "rgba(255,255,255,0.55)";
  context.font = "700 42px Arial";
  context.fillText(` / ${maximumScore} points`, 92 + scoreWidth, 340);

  context.fillStyle = "#FFFFFF";
  context.font = "800 34px Arial";
  context.fillText(message, 82, 415);

  context.fillStyle = "rgba(255,255,255,0.68)";
  context.font = "600 24px Arial";
  context.fillText("Découvre tes biais inconscients sur les métiers.", 82, 478);

  const gameUrl = new URL("/jeu-stereotypes", window.location.origin).toString();
  const qrSource = await QRCode.toDataURL(gameUrl, {
    width: 220,
    margin: 1,
    color: { dark: "#1C1C2E", light: "#FFFFFF" },
  });
  const qrImage = await loadImage(qrSource);
  context.fillStyle = "#FFFFFF";
  context.fillRect(904, 330, 238, 238);
  context.drawImage(qrImage, 913, 339, 220, 220);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Création de l'image impossible"));
    }, "image/png");
  });
}

export function ShareResult({ score, maximumScore, message }: ShareResultProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);

  const prepareImage = async () => {
    setLoading(true);
    try {
      const blob = await createResultImage(score, maximumScore, message);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      const nextUrl = URL.createObjectURL(blob);
      setImageBlob(blob);
      setImageUrl(nextUrl);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "mon-resultat-elles-bougent.png";
    link.click();
  };

  const share = async () => {
    if (!imageBlob) return;
    const file = new File([imageBlob], "mon-resultat-elles-bougent.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Mon résultat Elles Bougent",
        text: message,
        files: [file],
      });
      return;
    }
    download();
  };

  if (!imageUrl) {
    return (
      <button
        type="button"
        onClick={() => void prepareImage()}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8431A] px-5 py-4 font-black text-white outline-none transition hover:bg-[#C93412] focus-visible:ring-4 focus-visible:ring-orange-300/60 disabled:opacity-60"
        aria-label="Générer une image pour partager mon résultat"
      >
        <Share2 size={19} aria-hidden="true" />
        {loading ? "Création de l'image..." : "Partager mon résultat"}
      </button>
    );
  }

  return (
    <section className="rounded-xl border border-[#E2DDD6] bg-[#F8F6F2] p-4" aria-label="Aperçu du résultat à partager">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black text-[#1C1C2E]">Ton image est prête</h3>
        <button
          type="button"
          onClick={() => {
            URL.revokeObjectURL(imageUrl);
            setImageUrl(null);
            setImageBlob(null);
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
          aria-label="Fermer l'aperçu du résultat"
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      <img src={imageUrl} alt="Carte de résultat Elles Bougent avec score et QR code" className="mt-3 w-full rounded-lg" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={download}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-[#1C1C2E] px-4 py-3 font-black outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
        >
          <Download size={18} aria-hidden="true" />
          Télécharger
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#1C1C2E] px-4 py-3 font-black text-white outline-none focus-visible:ring-4 focus-visible:ring-orange-300/60"
        >
          <Share2 size={18} aria-hidden="true" />
          Partager
        </button>
      </div>
    </section>
  );
}
