import { list, para, PLACEHOLDER_SOURCE, TRUSTED_REFS, type ContentSeed } from "./_helpers";
import { slugify } from "@/lib/utils";

/**
 * Books, articles & resource recommendations (PRD §16). Each entry explains *why it's useful
 * right now* and is tagged to a pregnancy month or a post-birth stage.
 */
interface ResourceInput {
  title: string;
  type: "Book" | "Article" | "Explainer" | "Video" | "NestWise lesson";
  stage: "PREGNANCY" | "BIRTH" | "POSTPARTUM" | "CHILD" | "GENERAL";
  month?: number; // pregnancy month for stage-based surfacing
  why: string;
}

const RESOURCES: ResourceInput[] = [
  { title: "Understanding early pregnancy (explainer)", type: "Explainer", stage: "PREGNANCY", month: 2, why: "Month 2 is full of new sensations and questions; a calm overview helps you know what's typical." },
  { title: "What prenatal appointments cover", type: "Article", stage: "PREGNANCY", month: 3, why: "Knowing the schedule and purpose of visits makes the first appointments less daunting." },
  { title: "Fetal development, trimester by trimester", type: "Explainer", stage: "PREGNANCY", month: 5, why: "Mid-pregnancy is a good time to connect with how the baby is growing, especially around the anatomy scan." },
  { title: "Prenatal movement: a beginner's guide", type: "NestWise lesson", stage: "PREGNANCY", month: 5, why: "Energy often returns mid-pregnancy — a good window to build a gentle movement habit." },
  { title: "Preparing for birth without a rigid plan", type: "Book", stage: "PREGNANCY", month: 7, why: "Month 7 is when many people start thinking seriously about labour and what they'd prefer." },
  { title: "Newborn care basics", type: "Video", stage: "PREGNANCY", month: 8, why: "Practising diapering, burping and safe sleep now means less to learn in the tired first days." },
  { title: "Postpartum recovery: what to expect", type: "Explainer", stage: "PREGNANCY", month: 9, why: "Understanding recovery before birth helps you set up support and spot warning signs early." },
  { title: "Feeding your newborn: first two weeks", type: "Article", stage: "POSTPARTUM", why: "The early feeding rhythm is intense; knowing what's normal reduces worry." },
  { title: "Safer sleep for babies", type: "Explainer", stage: "POSTPARTUM", why: "A clear, current summary of safe-sleep guidance to share with everyone who cares for the baby." },
  { title: "Parent mental health after birth", type: "Article", stage: "POSTPARTUM", why: "Knowing the difference between the 'baby blues' and something that needs support is important for both parents." },
  { title: "Your baby's first year, month by month", type: "NestWise lesson", stage: "CHILD", why: "A gentle map of the first year that avoids treating development as pass/fail." },
  { title: "Positive discipline for toddlers", type: "Book", stage: "CHILD", why: "Practical, non-punitive strategies for the years when boundaries are tested most." },
  { title: "Play ideas that need almost nothing", type: "Article", stage: "CHILD", why: "Simple, low-cost activities that support development and connection." },
  { title: "Healthy screen habits for families", type: "Explainer", stage: "CHILD", why: "A calm framework for setting screen limits without daily battles." },
  { title: "How NestWise sources health content", type: "NestWise lesson", stage: "GENERAL", why: "Understand what 'reviewed' means here and where NestWise draws its information from." },
];

export function resourceSeeds(): ContentSeed[] {
  return RESOURCES.map((r) => ({
    slug: slugify(r.title),
    title: r.title,
    contentType: "RESOURCE" as const,
    stage: r.stage,
    category: r.type + (r.month ? ` · Month ${r.month}` : ""),
    summary: r.why,
    keyTakeaways: [`Type: ${r.type}`, `Why now: ${r.why}`],
    blocks: [para(`Why this is useful right now: ${r.why}`), list([`Format: ${r.type}`, r.month ? `Suggested around pregnancy month ${r.month}` : `Stage: ${r.stage.toLowerCase()}`])],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));
}
