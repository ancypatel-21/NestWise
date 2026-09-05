import { PLACEHOLDER_SOURCE, TRUSTED_REFS, type ContentSeed } from "./_helpers";

/**
 * Daily NestWise facts (PRD §15) and parent facts / bonding tips (PRD §36).
 * Short, stage-relevant, saveable. Nothing fear-based; nothing that gamifies symptoms.
 */

interface FactInput {
  category: string;
  stage: "PREGNANCY" | "BIRTH" | "POSTPARTUM" | "CHILD" | "GENERAL";
  text: string;
}

const FACTS: FactInput[] = [
  { category: "Baby development", stage: "PREGNANCY", text: "A baby's fingerprints are fully formed months before birth." },
  { category: "Baby development", stage: "PREGNANCY", text: "Babies can hear muffled sounds from outside the womb well before they're born." },
  { category: "Baby development", stage: "PREGNANCY", text: "Taste buds form early, and flavours from food can reach the amniotic fluid." },
  { category: "Baby development", stage: "PREGNANCY", text: "A newborn's stomach on day one is roughly the size of a cherry, which is why early feeds are small and frequent." },
  { category: "Pregnancy", stage: "PREGNANCY", text: "Pregnancy is counted in weeks because calendar months don't divide evenly into 40 weeks." },
  { category: "Pregnancy", stage: "PREGNANCY", text: "Only about 1 in 20 babies arrives on their exact estimated due date." },
  { category: "Pregnancy", stage: "PREGNANCY", text: "Blood volume rises substantially in pregnancy to support the placenta and baby." },
  { category: "Mother's body", stage: "PREGNANCY", text: "The uterus grows from about the size of a pear to roughly the size of a watermelon by term." },
  { category: "Mother's body", stage: "PREGNANCY", text: "The hormone relaxin loosens ligaments through pregnancy, which is part of why joints can feel different." },
  { category: "Mother's body", stage: "PREGNANCY", text: "A slightly higher resting heart rate in pregnancy is expected as the heart works harder." },
  { category: "Partner support", stage: "PREGNANCY", text: "Partners who attend appointments tend to feel more confident and involved during labour." },
  { category: "Partner support", stage: "PREGNANCY", text: "Reading the same week-by-week page as your partner keeps you both on the same map." },
  { category: "Partner support", stage: "PREGNANCY", text: "Taking over one recurring chore completely is often more helpful than asking 'what can I do?'." },
  { category: "Nutrition", stage: "PREGNANCY", text: "Pairing plant iron sources with a vitamin-C food at the same meal helps the body absorb the iron." },
  { category: "Nutrition", stage: "PREGNANCY", text: "Tea and coffee close to meals can reduce iron absorption; a gap helps." },
  { category: "Nutrition", stage: "PREGNANCY", text: "Small, frequent meals often ease both nausea and heartburn." },
  { category: "Birth", stage: "BIRTH", text: "Early labour can last a long time; rest and food during it help you save energy." },
  { category: "Birth", stage: "BIRTH", text: "Skin-to-skin contact after birth helps steady a newborn's temperature, breathing and heart rate." },
  { category: "Birth", stage: "BIRTH", text: "Birth 'plans' are better thought of as preferences, because labour can take its own course." },
  { category: "Newborn care", stage: "POSTPARTUM", text: "Newborns typically feed 8–12 times in 24 hours in the early weeks." },
  { category: "Newborn care", stage: "POSTPARTUM", text: "Putting a baby to sleep on their back, on a firm flat surface, is the core of safer sleep." },
  { category: "Newborn care", stage: "POSTPARTUM", text: "A lot of newborn crying peaks at around 6–8 weeks and then eases." },
  { category: "Parenting", stage: "CHILD", text: "Naming a feeling for a young child ('you're frustrated') helps them learn to manage it." },
  { category: "Parenting", stage: "CHILD", text: "Short, predictable routines help children feel secure and reduce power struggles." },
  { category: "Parenting", stage: "CHILD", text: "Reading with a child daily, even for a few minutes, supports vocabulary for years." },
  { category: "Parenting", stage: "CHILD", text: "Children learn cooperation faster from being coached calmly than from being punished." },
];

// Parent bonding tips (PRD §36) — stored as GENERAL facts under a distinct category.
const PARENT_TIPS: string[] = [
  "Narrate your day to your baby — it's language exposure and connection at once.",
  "One-on-one 'special time' for 10 minutes, child-led, strengthens the relationship.",
  "A predictable goodbye routine makes separations easier for toddlers.",
  "Catch your child being kind and say exactly what you noticed.",
  "A shared family ritual (Friday pancakes, a walk) becomes a lasting anchor.",
  "Let your child hear you talk through a small mistake and how you'll fix it.",
];

export function factSeeds(): ContentSeed[] {
  const base: ContentSeed[] = FACTS.map((f, i) => ({
    slug: `fact-${i + 1}`,
    title: f.text,
    contentType: "FACT" as const,
    stage: f.stage,
    category: f.category,
    summary: f.text,
    keyTakeaways: [f.text],
    blocks: [{ type: "paragraph", text: f.text }],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  const tips: ContentSeed[] = PARENT_TIPS.map((t, i) => ({
    slug: `parent-tip-${i + 1}`,
    title: t,
    contentType: "FACT" as const,
    stage: "CHILD" as const,
    category: "Bonding tip",
    summary: t,
    keyTakeaways: [t],
    blocks: [{ type: "paragraph", text: t }],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  return [...base, ...tips];
}
