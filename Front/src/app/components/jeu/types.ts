export type ModuleType =
  | "images"
  | "memory"
  | "vrfx"
  | "maison"
  | "bienveillant"
  | "emotions"
  | "chiffres";

export type SceneType =
  | "scene-office"
  | "scene-medical"
  | "scene-pilote"
  | "scene-voiture"
  | "scene-maison"
  | "scene-emotion"
  | "scene-sport"
  | "scene-chantier";

export interface VisualCard {
  type: SceneType;
  figures: string;
  scene: string;
  image?: string;
  imageAlt?: string;
  secondImage?: string;
  secondImageAlt?: string;
  timer?: string;
  label?: string;
}

export interface Option {
  e: string;
  l: string;
}

export interface Feedback {
  type: "insight" | "shock" | "info";
  lbl: string;
  txt: string;
}

export interface Question {
  id: number;
  mod: ModuleType;
  modLabel: string;
  question: string;
  visual?: VisualCard;
  opts: Option[];
  isPoll: boolean;
  correct?: number;
  colClass: "" | "col1" | "col3";
  fb: Feedback;
}

export interface CercleQuestion {
  q: string;
  short: string;
  type: "all" | "split" | "girls";
  title: string;
  body: string;
}

export type GameStage = "intro" | "quiz" | "interlude" | "circle" | "results";
