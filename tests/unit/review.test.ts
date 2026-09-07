import { describe, expect, it } from "vitest";
import { BOX_INTERVAL_DAYS, MAX_BOX, boxLabel, nextSchedule } from "@/lib/review";

describe("spaced-repetition scheduler", () => {
  it("advances a box and pushes the due date out on a correct answer", () => {
    const before = Date.now();
    const { box, dueAt } = nextSchedule(2, true);
    expect(box).toBe(3);
    const days = (dueAt.getTime() - before) / 86_400_000;
    expect(days).toBeGreaterThan(BOX_INTERVAL_DAYS[3] - 0.1);
    expect(days).toBeLessThan(BOX_INTERVAL_DAYS[3] + 0.1);
  });

  it("drops back to box 1 on a wrong answer", () => {
    expect(nextSchedule(4, false).box).toBe(1);
    expect(nextSchedule(1, false).box).toBe(1);
  });

  it("caps at the max box", () => {
    expect(nextSchedule(MAX_BOX, true).box).toBe(MAX_BOX);
  });

  it("labels every box", () => {
    for (let b = 1; b <= MAX_BOX; b++) expect(boxLabel(b)).toBeTruthy();
  });
});
