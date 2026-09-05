import { describe, expect, it } from "vitest";
import { ageFromDob, stageSlugForMonths } from "@/lib/personalization/age";

describe("child age calculation (PRD §60)", () => {
  it("reports months for a young baby", () => {
    const today = new Date("2026-06-01T00:00:00Z");
    const dob = new Date("2026-03-01T00:00:00Z");
    const age = ageFromDob(dob, today);
    expect(age.months).toBe(3);
    expect(age.label).toBe("3 months");
  });

  it("reports years and months for a toddler", () => {
    const today = new Date("2026-06-01T00:00:00Z");
    const dob = new Date("2024-02-01T00:00:00Z");
    const age = ageFromDob(dob, today);
    expect(age.years).toBe(2);
    expect(age.label).toMatch(/^2 years/);
  });

  it("never goes negative for a future dob", () => {
    const today = new Date("2026-01-01T00:00:00Z");
    const dob = new Date("2026-06-01T00:00:00Z");
    expect(ageFromDob(dob, today).months).toBe(0);
  });
});

describe("stage slug mapping (PRD §26)", () => {
  it("uses month-N for the first year", () => {
    expect(stageSlugForMonths(0)).toBe("month-1");
    expect(stageSlugForMonths(5)).toBe("month-6");
    expect(stageSlugForMonths(11)).toBe("month-12");
  });
  it("uses yearly bands after 12 months", () => {
    expect(stageSlugForMonths(12)).toBe("age-1-2");
    expect(stageSlugForMonths(30)).toBe("age-2-3");
    expect(stageSlugForMonths(140)).toBe("age-11-12");
  });
});
