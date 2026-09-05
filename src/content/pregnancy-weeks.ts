import { trimesterForWeek } from "@/lib/personalization/pregnancy";
import {
  callout,
  heading,
  list,
  PLACEHOLDER_SOURCE,
  TRUSTED_REFS,
  type ContentSeed,
} from "./_helpers";

/**
 * Week-by-week pregnancy pages, weeks 4–40 (PRD §8). Each entry carries baby development,
 * mother's changes, a mother checklist and a partner guide, plus the recurring
 * "How can I support my partner this week?" prompt (PRD §8.4).
 *
 * Copy is deliberately general placeholder text. Size comparisons are avoided as measurements
 * (PRD §8.1).
 */

const SIZE_HINT: Record<number, string> = {
  4: "a poppy seed",
  6: "a lentil",
  8: "a raspberry",
  10: "a small strawberry",
  12: "a lime",
  16: "an avocado",
  20: "a banana",
  24: "an ear of corn",
  28: "an eggplant",
  32: "a large jicama",
  36: "a head of romaine lettuce",
  40: "a small pumpkin",
};

function nearestSizeHint(week: number): string {
  const keys = Object.keys(SIZE_HINT).map(Number);
  const k = keys.reduce((a, b) => (Math.abs(b - week) < Math.abs(a - week) ? b : a), keys[0]);
  return SIZE_HINT[k];
}

const TRIMESTER_BABY: Record<1 | 2 | 3, string[]> = {
  1: [
    "Major organs and body systems are forming, including the neural tube, heart and early limb buds.",
    "The heart begins to beat and circulate blood in a simple loop.",
    "Facial features, fingers and toes gradually take shape.",
  ],
  2: [
    "The baby is growing quickly and beginning coordinated movements you may start to feel.",
    "Hearing is developing, and the baby may respond to sounds outside the body.",
    "Skin, hair and nails continue to develop; the baby has sleep and wake cycles.",
  ],
  3: [
    "The baby is mainly gaining weight and building fat stores for temperature control.",
    "The lungs and brain are maturing in preparation for life outside the womb.",
    "Movements feel stronger but may change in character as space becomes limited.",
  ],
};

const TRIMESTER_MOTHER: Record<1 | 2 | 3, string[]> = {
  1: [
    "Nausea, tiredness, tender breasts and shifting appetite are common early experiences.",
    "Mood can move around as hormone levels change quickly.",
    "Many people have no visible bump yet and few outward signs.",
  ],
  2: [
    "Energy often returns for a while and early nausea tends to ease for many people.",
    "A visible bump usually develops; mild round-ligament aches can come with it.",
    "Heartburn, congestion and occasional dizziness are common.",
  ],
  3: [
    "Sleep is often broken; back and pelvic discomfort and swelling in the feet are common.",
    "Braxton Hicks (practice) tightenings may come and go.",
    "Shortness of breath is common until the baby settles lower before birth.",
  ],
};

export function pregnancyWeekSeeds(): ContentSeed[] {
  const seeds: ContentSeed[] = [];
  for (let week = 4; week <= 40; week++) {
    const tri = trimesterForWeek(week);
    seeds.push({
      slug: `week-${week}`,
      title: `Week ${week}`,
      contentType: "WEEK_PREGNANCY",
      stage: "PREGNANCY",
      category: `Trimester ${tri}`,
      pregnancyWeek: week,
      summary: `A calm overview of week ${week}: how the baby is developing, what many people notice in their body, a short checklist, and a partner guide.`,
      keyTakeaways: [
        `Week ${week} falls in trimester ${tri}; pregnancy is tracked in weeks because months do not map evenly.`,
        TRIMESTER_BABY[tri][0],
        TRIMESTER_MOTHER[tri][0],
        "Every pregnancy is different — use this as general context, not a checklist you must match.",
      ],
      blocks: [
        heading("Baby development"),
        list([
          `Roughly the size of ${nearestSizeHint(week)} this week (a rough comparison, not a measurement).`,
          ...TRIMESTER_BABY[tri],
        ]),
        heading("Your body this week"),
        list(TRIMESTER_MOTHER[tri]),
        callout(
          "info",
          "Common experiences vary widely. Missing a symptom on this list is not a problem, and having others is usually normal too.",
        ),
        heading("This week's checklist"),
        list([
          "Keep fluids and regular, balanced meals going as best you can.",
          "Note any questions for your next appointment.",
          "Move gently in a way that feels good — a short walk or light stretching.",
          "Pick one short NestWise lesson to read.",
        ]),
        callout(
          "caution",
          "Contact your midwife or doctor about heavy bleeding, severe or constant abdominal pain, a bad headache with vision changes, fever, or (from mid-pregnancy) a clear drop in the baby's usual movements.",
          "When to check with a professional",
        ),
        heading("Partner / Father guide"),
        list([
          `What she may be feeling: ${TRIMESTER_MOTHER[tri][0].toLowerCase()}`,
          "Learn this week: read the same week page so you share the picture.",
          "Practical help: take on a chore she usually does without being asked.",
          "Emotional support: ask how she's doing and listen without fixing.",
          "Appointment prep: offer to come along and hold the list of questions.",
        ]),
        heading("How can I support my partner this week?"),
        list([
          "Pick one concrete task and own it end to end.",
          "Protect her rest — handle an evening so she can sleep earlier.",
          "Check in once about how she's feeling, not just what needs doing.",
        ]),
      ],
      source: PLACEHOLDER_SOURCE,
      referenceUrls: TRUSTED_REFS,
      reviewedAt: null,
    });
  }
  return seeds;
}
