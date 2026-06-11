import { useEffect } from "react";
import JeuStereotypes from "../components/JeuStereotypes";

const title = "Et toi tu penses quoi ? — Elles Bougent";
const description = "Découvre tes biais inconscients sur les stéréotypes de genre en 20 questions";

function setMeta(selector: string, attribute: "name" | "property", value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  const created = !element;
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }
  const previousContent = element.content;
  element.content = content;
  return () => {
    if (created) element.remove();
    else element.content = previousContent;
  };
}

export function JeuStereotypesPage() {
  useEffect(() => {
    const previousTitle = document.title;
    const pageUrl = new URL("/jeu-stereotypes", window.location.origin).toString();
    const imageUrl = new URL(
      "/images/jeu-stereotypes/og-jeu-stereotypes.webp",
      window.location.origin,
    ).toString();
    document.title = title;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalCreated = !canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const previousCanonical = canonical.href;
    canonical.href = pageUrl;

    const cleanups = [
      setMeta('meta[name="description"]', "name", "description", description),
      setMeta('meta[property="og:title"]', "property", "og:title", title),
      setMeta('meta[property="og:description"]', "property", "og:description", description),
      setMeta('meta[property="og:type"]', "property", "og:type", "website"),
      setMeta('meta[property="og:url"]', "property", "og:url", pageUrl),
      setMeta('meta[property="og:image"]', "property", "og:image", imageUrl),
      setMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200"),
      setMeta('meta[property="og:image:height"]', "property", "og:image:height", "630"),
      setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image"),
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", title),
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description),
      setMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl),
    ];

    return () => {
      document.title = previousTitle;
      if (canonicalCreated) canonical.remove();
      else canonical.href = previousCanonical;
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return <JeuStereotypes />;
}
