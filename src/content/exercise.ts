import {
  callout,
  heading,
  keyvalue,
  list,
  para,
  steps,
  PLACEHOLDER_SOURCE,
  TRUSTED_REFS,
  type ContentSeed,
} from "./_helpers";
import { slugify } from "@/lib/utils";

/**
 * Pregnancy exercise & movement (PRD §14). Each entry has name, purpose, suitable stage,
 * step-by-step instructions, duration guidance, safety notes and stop signs. The AI instructor
 * avatar (PRD §14.1) is a future feature and is not built here.
 */

interface ExerciseInput {
  title: string;
  purpose: string;
  stage: string;
  steps: string[];
  dose: string;
  safety: string[];
}

const STOP_SIGNS = [
  "Vaginal bleeding or fluid leak",
  "Regular painful contractions",
  "Chest pain, dizziness or feeling faint",
  "Calf pain or swelling",
  "Headache or shortness of breath before starting",
  "Reduced baby movements afterwards",
];

const EXERCISES: ExerciseInput[] = [
  { title: "Daily walk", purpose: "Gentle cardiovascular activity, mood and sleep support.", stage: "All trimesters", steps: ["Start with 10–15 minutes at a pace where you can still talk.", "Wear supportive shoes and take water.", "Build up gradually to 20–30 minutes on most days if it feels good.", "Cool down with a slower few minutes."], dose: "Most days, 15–30 minutes", safety: ["Choose even ground", "Avoid overheating; pick cooler times of day", "Slow down if you can't hold a conversation"] },
  { title: "Pelvic tilts", purpose: "Ease lower-back tension and build gentle core awareness.", stage: "All trimesters", steps: ["On hands and knees, wrists under shoulders, knees under hips.", "Breathe out and gently round the lower back upward.", "Breathe in and return to a flat, neutral spine (don't sag).", "Move slowly and only within a comfortable range."], dose: "1–2 sets of 8–10, a few times a week", safety: ["Keep the movement small and pain-free", "Stop if you feel wrist strain — come onto forearms"] },
  { title: "Cat–cow (gentle range)", purpose: "Mobilise the spine and relieve stiffness.", stage: "First and second trimester; keep range small later", steps: ["Start on hands and knees.", "Inhale, gently lift the chest and tailbone (small movement).", "Exhale, round the back softly.", "Flow slowly between the two for several breaths."], dose: "5–8 slow cycles", safety: ["Avoid deep back arching", "Skip if it causes any abdominal pain"] },
  { title: "Wall push-ups", purpose: "Maintain upper-body and chest strength with low load.", stage: "All trimesters", steps: ["Stand arm's length from a wall, hands at shoulder height.", "Keep the body in a straight line from head to heels.", "Bend the elbows to bring the chest towards the wall.", "Press back to the start."], dose: "1–2 sets of 8–12", safety: ["Keep core gently engaged, don't hold your breath", "Step closer to the wall to make it easier"] },
  { title: "Seated hip and hamstring stretch", purpose: "Reduce tightness in hips and the back of the thighs.", stage: "All trimesters", steps: ["Sit tall on a sturdy chair.", "Straighten one leg with the heel on the floor, toes up.", "Hinge forward slightly from the hips until you feel a mild stretch.", "Hold, breathe, then switch sides."], dose: "2–3 holds of 20–30 seconds per side", safety: ["Mild stretch only — never sharp", "Keep the back long, don't hunch"] },
  { title: "Side-lying leg lifts", purpose: "Strengthen hip muscles that support the pelvis.", stage: "All trimesters (use pillows for comfort)", steps: ["Lie on your side with hips stacked, head supported.", "Lift the top leg to about hip height with control.", "Lower slowly without dropping.", "Complete the set, then switch sides."], dose: "1–2 sets of 10–12 per side", safety: ["Keep movement slow and controlled", "Stop if it pinches the hip or lower back"] },
  { title: "Pelvic-floor exercises", purpose: "Support bladder control and recovery after birth.", stage: "All trimesters and postpartum", steps: ["Sit or lie comfortably.", "Squeeze the muscles you'd use to stop passing wind and urine, lifting inward and upward.", "Hold for a few seconds, then fully relax for the same time.", "Also practise quick, light squeezes."], dose: "3 sets of 8–10 daily (long holds + quick squeezes)", safety: ["Keep breathing normally", "Relax fully between reps — the release matters as much as the squeeze"] },
  { title: "Box breathing for relaxation", purpose: "Calm the nervous system; useful for stress and labour prep.", stage: "All trimesters", steps: ["Sit or lie supported and comfortable.", "Breathe in through the nose for a count of four.", "Hold gently for four.", "Breathe out for four, then hold for four. Repeat."], dose: "3–5 minutes as needed", safety: ["Shorten the counts if holding feels uncomfortable", "Never force a breath-hold"] },
  { title: "Supported squat mobility", purpose: "Maintain hip and pelvic mobility for late pregnancy and birth positions.", stage: "Second and third trimester", steps: ["Hold a sturdy support (door frame, counter).", "Lower into a comfortable squat with feet flat and knees tracking over toes.", "Only go as low as feels easy.", "Press through the feet to stand."], dose: "5–8 slow reps, or short holds", safety: ["Keep weight in the heels", "Avoid if you have pelvic girdle pain that this worsens"] },
  { title: "Gentle prenatal flow (mini routine)", purpose: "A short combined mobility and relaxation sequence.", stage: "All trimesters (adjust range by stage)", steps: ["2 minutes easy marching on the spot.", "5 slow cat–cow cycles.", "5 pelvic tilts.", "2–3 hip/hamstring stretches per side.", "2 minutes box breathing to finish."], dose: "Once daily or every other day, ~12–15 minutes", safety: ["Warm up first with the marching", "Skip any move that causes pain and continue with the rest"] },
];

export function exerciseSeeds(): ContentSeed[] {
  return EXERCISES.map((e) => ({
    slug: slugify(e.title),
    title: e.title,
    contentType: "EXERCISE" as const,
    stage: "PREGNANCY" as const,
    category: "Movement",
    summary: `${e.title}: ${e.purpose}`,
    keyTakeaways: [`Purpose: ${e.purpose}`, `Suitable: ${e.stage}`, `Guide: ${e.dose}`],
    blocks: [
      keyvalue([
        { label: "Purpose", value: e.purpose },
        { label: "Suitable stage", value: e.stage },
        { label: "Duration / reps", value: e.dose },
      ]),
      heading("Step by step"),
      steps(e.steps),
      heading("Safety notes"),
      list(e.safety),
      callout("caution", `Stop and seek advice if you notice: ${STOP_SIGNS.join("; ")}.`, "Stop signs"),
      callout("info", "Check with your midwife or doctor before starting new exercise, especially if you have any pregnancy complications."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));
}
