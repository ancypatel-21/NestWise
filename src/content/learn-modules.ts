import {
  callout,
  heading,
  list,
  para,
  PLACEHOLDER_SOURCE,
  TRUSTED_REFS,
  type ContentSeed,
} from "./_helpers";
import { slugify } from "@/lib/utils";

/**
 * Pregnancy Learning Hub (PRD §9). 16 modules; each lesson has a short explanation, key
 * takeaways, optional deeper reading, and a quick quiz reference. Completion + bookmark are
 * handled by the UI.
 */
export interface ModuleMeta {
  slug: string;
  title: string;
  blurb: string;
  emoji: string;
  lessons: string[];
}

const RAW: Array<Omit<ModuleMeta, "slug">> = [
  { title: "Understanding Pregnancy", emoji: "🌱", blurb: "How pregnancy is measured and what the trimesters mean.", lessons: ["Weeks vs months", "The three trimesters", "What your due date really means"] },
  { title: "Baby Development", emoji: "👶", blurb: "How the baby grows, system by system.", lessons: ["First trimester milestones", "Movements and the senses", "The final weeks"] },
  { title: "Mother's Body", emoji: "🫀", blurb: "Common physical changes and why they happen.", lessons: ["Early body changes", "Mid-pregnancy changes", "Late-pregnancy comfort"] },
  { title: "Prenatal Appointments", emoji: "🗓️", blurb: "What happens at check-ups and how to prepare.", lessons: ["The schedule of visits", "Questions worth asking", "Bringing your partner"] },
  { title: "Prenatal Tests", emoji: "🔬", blurb: "Screening and diagnostic tests explained in plain language.", lessons: ["Screening vs diagnostic", "Common blood tests and scans", "Making informed choices"] },
  { title: "Nutrition", emoji: "🥗", blurb: "Eating well without strict rules.", lessons: ["Building a balanced plate", "Key nutrients in pregnancy", "Managing nausea and aversions"] },
  { title: "Sleep", emoji: "😴", blurb: "Rest strategies for each stage.", lessons: ["Sleep positions", "Night waking and comfort", "Winding down"] },
  { title: "Mental & Emotional Wellbeing", emoji: "💛", blurb: "Looking after your mind during big change.", lessons: ["Mood changes in pregnancy", "Stress and worry", "When to reach out for support"] },
  { title: "Exercise & Movement", emoji: "🧘", blurb: "Safe, gentle activity guidance.", lessons: ["Why movement helps", "Choosing activities by trimester", "Warning signs to stop"] },
  { title: "Preparing the Home", emoji: "🏠", blurb: "Getting the space ready calmly.", lessons: ["Safe sleep space basics", "Room-by-room prep", "Keeping it simple"] },
  { title: "Baby Essentials", emoji: "🧺", blurb: "What newborns actually need at first.", lessons: ["The short essentials list", "Feeding supplies", "What can wait"] },
  { title: "Financial Preparation", emoji: "💰", blurb: "Planning ahead for costs and leave.", lessons: ["Budgeting for a baby", "Understanding leave options", "Paperwork before birth"] },
  { title: "Birth Planning", emoji: "📝", blurb: "Thinking through birth preferences.", lessons: ["Preferences, not guarantees", "Pain-management options overview", "Who is on your team"] },
  { title: "Breastfeeding / Feeding Basics", emoji: "🍼", blurb: "Feeding fundamentals before day one.", lessons: ["How feeding works early on", "Positions and latch basics", "Formula and combination feeding"] },
  { title: "Newborn Basics", emoji: "🌙", blurb: "Core newborn-care skills to learn now.", lessons: ["Diapering and burping", "Safe sleep", "Soothing a crying newborn"] },
  { title: "Partner Preparation", emoji: "🤝", blurb: "How the partner gets ready to help.", lessons: ["Support during pregnancy", "Hospital and labour role", "The first two weeks at home"] },
];

export const LEARN_MODULES: ModuleMeta[] = RAW.map((m) => ({ ...m, slug: slugify(m.title) }));

export function learnLessonSeeds(): ContentSeed[] {
  const seeds: ContentSeed[] = [];
  for (const mod of LEARN_MODULES) {
    mod.lessons.forEach((lessonTitle, i) => {
      seeds.push({
        slug: `${mod.slug}--${slugify(lessonTitle)}`,
        title: lessonTitle,
        contentType: "LESSON",
        stage: "PREGNANCY",
        category: mod.title,
        summary: `${lessonTitle} — a short lesson in the "${mod.title}" module.`,
        keyTakeaways: [
          `${lessonTitle} is part of understanding ${mod.title.toLowerCase()}.`,
          "This is general education, not personal medical advice.",
          "Bring anything that worries you to your midwife or doctor.",
        ],
        blocks: [
          para(
            `This lesson gives a plain-language overview of "${lessonTitle}". It is placeholder content that keeps the right structure and safety framing until an expert-reviewed version is added.`,
          ),
          heading("Key points"),
          list([
            "What this topic covers and why it matters at this stage.",
            "A few practical, low-risk things you can do.",
            "What to avoid or be cautious about.",
            "When it's worth asking a professional.",
          ]),
          heading("Going deeper (optional)"),
          list(["A longer explainer", "A short trusted video", "A related NestWise lesson"]),
          callout(
            "info",
            "Finished reading? Mark the lesson complete and take the quick quiz to check what stuck.",
          ),
          ...(i === 0
            ? [callout("caution", "If a topic here raises a specific concern about your pregnancy, contact your care provider rather than waiting.")]
            : []),
        ],
        source: PLACEHOLDER_SOURCE,
        referenceUrls: TRUSTED_REFS,
        reviewedAt: null,
      });
    });
  }
  return seeds;
}
