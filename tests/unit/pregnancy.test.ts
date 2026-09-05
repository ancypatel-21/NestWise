import { describe, expect, it } from "vitest";
import {
  approxMonths,
  dueDateFromWeek,
  pregnancyWeekFromDueDate,
  trimesterForWeek,
  weeksToMonths,
} from "@/lib/personalization/pregnancy";

describe("pregnancy week calculation (PRD §60 unit tests)", () => {
  it("a due date 280 days away is ~week 1", () => {
    const today = new Date("2026-01-01T00:00:00Z");
    const due = new Date(today.getTime() + 280 * 86_400_000);
    expect(pregnancyWeekFromDueDate(due, today)).toBe(1);
  });

  it("a due date 140 days away is ~week 20", () => {
    const today = new Date("2026-01-01T00:00:00Z");
    const due = new Date(today.getTime() + 140 * 86_400_000);
    expect(pregnancyWeekFromDueDate(due, today)).toBe(21);
  });

  it("a due date today is ~week 40", () => {
    const today = new Date("2026-06-15T00:00:00Z");
    expect(pregnancyWeekFromDueDate(today, today)).toBe(40);
  });

  it("clamps early / overdue inputs into 1..42", () => {
    const today = new Date("2026-01-01T00:00:00Z");
    const wayOff = new Date(today.getTime() + 400 * 86_400_000);
    const overdue = new Date(today.getTime() - 40 * 86_400_000);
    expect(pregnancyWeekFromDueDate(wayOff, today)).toBe(1);
    expect(pregnancyWeekFromDueDate(overdue, today)).toBe(42);
  });

  it("dueDateFromWeek is the inverse of pregnancyWeekFromDueDate", () => {
    const today = new Date("2026-03-10T00:00:00Z");
    for (const week of [6, 12, 20, 28, 36]) {
      const due = dueDateFromWeek(week, today);
      expect(pregnancyWeekFromDueDate(due, today)).toBe(week);
    }
  });
});

describe("weeks to months (PRD §5.1)", () => {
  it("formats the example: 8 weeks ≈ 2 months", () => {
    expect(weeksToMonths(8)).toBe("8 weeks — approximately 2 months");
  });
  it("singular month for very early weeks", () => {
    expect(weeksToMonths(4)).toBe("4 weeks — approximately 1 month");
  });
  it("approxMonths never returns 0", () => {
    expect(approxMonths(1)).toBeGreaterThanOrEqual(1);
  });
});

describe("trimesters", () => {
  it("splits at weeks 13 and 27", () => {
    expect(trimesterForWeek(13)).toBe(1);
    expect(trimesterForWeek(14)).toBe(2);
    expect(trimesterForWeek(27)).toBe(2);
    expect(trimesterForWeek(28)).toBe(3);
  });
});
