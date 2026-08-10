export type ExpectedValue =
  | { type: "input"; selector: string; value: string }
  | { type: "select"; selector: string; value: string }
  | { type: "radio"; name: string; value: string }
  | { type: "action" };

export interface TourStep {
  element: string;
  title: string;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  required?: boolean;
  practicePrompt?: string;
  expected?: ExpectedValue;
  onEnter?: (mode: "watch" | "practice") => void;
  onWatchFill?: () => void;
  navigateTo?: string;
  navigateStorageKey?: string;
  openModalOnNext?: string;
  switchTabOnNext?: string;
  skillLabel?: string;
  skillIndex?: number;
  whyMatters?: string;
  commonMistakes?: string;
  hint?: string;
  validationMessage?: string;
  /** If set, step only runs for these scenario ids. Omit = all scenarios. */
  scenarioIds?: string[];
}

export interface Scenario {
  id: string;
  title: string;
  story: string;
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: number;
  explain: string;
}

export interface ModuleSummary {
  title: string;
  intro: string;
  takeaways: string[];
  recap: string[];
}

export interface TourConfig {
  moduleId: string;
  pageKey: string;
  pageHref?: string;
  parentModuleName: string;
  learningModuleTitle?: string;
  learningModuleHref?: string;
  learningPageKey?: string;
  resume?: boolean;
  mode?: "watch" | "practice";
  scenario?: Scenario;
  track: "WMS" | "OMS";
  number: number;
  title: string;
  skills: string[];
  homeHref: string;
  glossaryKeys?: string[];
  pitfalls: string[];
  scenarios: Scenario[];
  summary: ModuleSummary;
  quiz: QuizQuestion[];
  steps: TourStep[];
  defaultStory?: string;
  startIndex?: number;
}

export interface SupportContact {
  role: string;
  name: string;
  note: string;
}

export interface SupportTeam {
  title: string;
  contacts: SupportContact[];
}

export interface ModuleDef {
  id: string;
  track: "WMS" | "OMS";
  number: number;
  title: string;
  description: string;
  href: string;
  duration: string;
  skills: string[];
}

export interface ModuleProgress {
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  quizTotal?: number;
  quizSkipped?: boolean;
}

export type TrainingMode = "watch" | "practice";
export type TrainingPhase =
  | "idle"
  | "path-picker"
  | "mode-picker"
  | "scenario-picker"
  | "active"
  | "paused"
  | "summary"
  | "quiz";

export type PathGroupId = "picking" | "packing";
