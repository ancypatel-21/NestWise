import type { FamilyStage } from "@/types";

/** Icon keys resolved to components in NavLinks.tsx (client). Server code only passes strings. */
export type IconKey =
  | "home"
  | "journey"
  | "learn"
  | "ask"
  | "nutrition"
  | "movement"
  | "symptoms"
  | "progress"
  | "saved"
  | "bag"
  | "labor"
  | "firstDays"
  | "recovery"
  | "wellbeing"
  | "development"
  | "activities"
  | "games"
  | "family";

export interface NavItem {
  href: string;
  label: string;
  icon: IconKey;
}

/**
 * Top-level navigation adapts to the family's stage (PRD §6). Home, Ask, Learn, Progress,
 * Saved are always present; the middle changes between journeys.
 */
export function navForStage(stage: FamilyStage): NavItem[] {
  const home: NavItem = { href: "/home", label: "Home", icon: "home" };

  if (stage.mode === "pregnancy" || stage.mode === "unset") {
    return [
      home,
      { href: "/journey", label: "Journey", icon: "journey" },
      { href: "/learn", label: "Learn", icon: "learn" },
      { href: "/ask", label: "Ask NestWise", icon: "ask" },
      { href: "/nutrition", label: "Nutrition", icon: "nutrition" },
      { href: "/exercise", label: "Movement", icon: "movement" },
      { href: "/symptoms", label: "Symptoms", icon: "symptoms" },
      { href: "/progress", label: "Progress", icon: "progress" },
      { href: "/bookmarks", label: "Saved", icon: "saved" },
    ];
  }

  if (stage.mode === "birth-countdown") {
    return [
      home,
      { href: "/birth", label: "Birth prep", icon: "journey" },
      { href: "/birth/hospital-bag", label: "Hospital bag", icon: "bag" },
      { href: "/birth/learn", label: "Labor", icon: "labor" },
      { href: "/ask", label: "Ask NestWise", icon: "ask" },
      { href: "/journey", label: "Weeks", icon: "journey" },
      { href: "/progress", label: "Progress", icon: "progress" },
      { href: "/bookmarks", label: "Saved", icon: "saved" },
    ];
  }

  if (stage.mode === "postpartum") {
    return [
      home,
      { href: "/postpartum/first-days", label: "First days", icon: "firstDays" },
      { href: "/postpartum/body", label: "Recovery", icon: "recovery" },
      { href: "/postpartum/wellbeing", label: "Wellbeing", icon: "wellbeing" },
      { href: "/ask", label: "Ask NestWise", icon: "ask" },
      { href: "/learn", label: "Learn", icon: "learn" },
      { href: "/progress", label: "Progress", icon: "progress" },
      { href: "/bookmarks", label: "Saved", icon: "saved" },
    ];
  }

  // child
  return [
    home,
    { href: "/child/timeline", label: "Development", icon: "development" },
    { href: "/child/activities", label: "Activities", icon: "activities" },
    { href: "/child/games", label: "Games", icon: "games" },
    { href: "/child/family-games", label: "Family games", icon: "family" },
    { href: "/learn", label: "Parent learning", icon: "learn" },
    { href: "/ask", label: "Ask NestWise", icon: "ask" },
    { href: "/child/progress", label: "Progress", icon: "progress" },
    { href: "/bookmarks", label: "Saved", icon: "saved" },
  ];
}

/** Compact bottom bar for mobile — the 5 most important destinations for the stage. */
export function mobileNavForStage(stage: FamilyStage): NavItem[] {
  return navForStage(stage).slice(0, 5);
}
