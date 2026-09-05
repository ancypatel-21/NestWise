import { describe, expect, it } from "vitest";
import { classifyCategory, classifySafety } from "@/lib/safety/classify";

describe("safety classifier (PRD §51)", () => {
  it("Level 1 for general education questions", () => {
    expect(classifySafety("Why is fatigue common in early pregnancy?")).toBe("LEVEL_1");
    expect(classifySafety("What foods contain iron?")).toBe("LEVEL_1");
  });

  it("Level 2 for personal-symptom phrasing", () => {
    expect(classifySafety("I have been vomiting all day")).toBe("LEVEL_2");
    expect(classifySafety("Should I be worried about this cramp?")).toBe("LEVEL_2");
    expect(classifySafety("Is this bleeding normal?")).toBe("LEVEL_2");
  });

  it("Level 3 for potential emergencies", () => {
    expect(classifySafety("I have severe bleeding and feel faint")).toBe("LEVEL_3");
    expect(classifySafety("I can't breathe properly")).toBe("LEVEL_3");
    expect(classifySafety("I haven't felt the baby move since yesterday")).toBe("LEVEL_3");
    expect(classifySafety("I'm having chest pain")).toBe("LEVEL_3");
    expect(classifySafety("I keep thinking about harming myself")).toBe("LEVEL_3");
  });

  it("escalates: emergency wording wins over personal wording", () => {
    expect(classifySafety("I have heavy bleeding and severe chest pain")).toBe("LEVEL_3");
  });
});

describe("category classifier (PRD §50)", () => {
  it("detects birth, postpartum, baby and parenting topics", () => {
    expect(classifyCategory("What happens during a c-section?")).toBe("BIRTH");
    expect(classifyCategory("How long does lochia last after birth?")).toBe("POSTPARTUM");
    expect(classifyCategory("How do I burp my newborn?")).toBe("BABY");
    expect(classifyCategory("How do I handle a toddler tantrum?")).toBe("PARENTING");
    expect(classifyCategory("What is happening at 12 weeks pregnant?")).toBe("PREGNANCY");
  });

  it("falls back to context, then GENERAL", () => {
    expect(classifyCategory("Tell me something interesting")).toBe("GENERAL");
    expect(classifyCategory("Tell me something interesting", { pregnancyWeek: 20 })).toBe(
      "PREGNANCY",
    );
    expect(classifyCategory("What should we do today?", { childAgeMonths: 30 })).toBe("PARENTING");
  });
});
