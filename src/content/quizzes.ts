import type { Stage } from "@prisma/client";
import type { QuizQuestion } from "@/types";

/**
 * Stage-specific quizzes (PRD §10). Multiple choice, each with an immediate explanation.
 * Nothing here gamifies symptoms or emergencies.
 */
export interface QuizSeed {
  slug: string;
  title: string;
  category: string;
  stage: Stage;
  ageRange?: string;
  questions: QuizQuestion[];
}

export const QUIZZES: QuizSeed[] = [
  {
    slug: "week-8-knowledge",
    title: "Week 8 knowledge",
    category: "Pregnancy weeks",
    stage: "PREGNANCY",
    questions: [
      { prompt: "Roughly how many months is 8 weeks of pregnancy?", choices: ["About 1 month", "About 2 months", "About 3 months", "About 4 months"], answerIndex: 1, explanation: "8 weeks is about 2 months. Weeks and months don't line up exactly, which is why pregnancy is tracked in weeks." },
      { prompt: "Which is a common experience around week 8?", choices: ["A visible bump for everyone", "Nausea and tiredness", "Feeling kicks", "Milk production"], answerIndex: 1, explanation: "Nausea and fatigue are common in the first trimester. Feeling movement and a clear bump usually come later." },
      { prompt: "Size comparisons for the baby are best treated as…", choices: ["Exact measurements", "Medical readings", "Rough, friendly comparisons", "Growth targets"], answerIndex: 2, explanation: "They're rough comparisons only, not measurements or targets (PRD §8.1)." },
    ],
  },
  {
    slug: "first-trimester-basics",
    title: "First trimester basics",
    category: "Trimesters",
    stage: "PREGNANCY",
    questions: [
      { prompt: "The first trimester covers which weeks?", choices: ["Weeks 1–13", "Weeks 1–20", "Weeks 14–27", "Weeks 28–40"], answerIndex: 0, explanation: "The first trimester runs to about week 13." },
      { prompt: "Which is a reason to contact a provider in early pregnancy?", choices: ["Mild tiredness", "Occasional nausea", "Heavy vaginal bleeding with pain", "Food aversions"], answerIndex: 2, explanation: "Heavy bleeding with pain should always be checked promptly." },
      { prompt: "A helpful first-trimester nutrition habit is…", choices: ["Skipping meals to manage nausea", "Small frequent meals", "Cutting out all carbohydrates", "Doubling caffeine"], answerIndex: 1, explanation: "Small, frequent meals often help nausea and steady energy." },
    ],
  },
  {
    slug: "nutrition-awareness",
    title: "Nutrition awareness",
    category: "Nutrition",
    stage: "PREGNANCY",
    questions: [
      { prompt: "Which pairing helps your body absorb plant iron?", choices: ["Iron food + tea", "Iron food + vitamin-C food", "Iron food + coffee", "Iron food + dairy"], answerIndex: 1, explanation: "Vitamin C (peppers, citrus, tomato) boosts absorption of non-haem iron; tea and coffee reduce it." },
      { prompt: "Which cheese is generally advised against in pregnancy?", choices: ["Hard cheese", "Pasteurised cheddar", "Soft mould-ripened cheese", "Pasteurised mozzarella"], answerIndex: 2, explanation: "Soft mould-ripened and blue cheeses are commonly advised against; check your local guidance." },
      { prompt: "Caffeine in pregnancy is usually advised to be…", choices: ["Unlimited", "Completely avoided by everyone", "Kept moderate", "Only from tea"], answerIndex: 2, explanation: "Most guidance suggests a moderate daily limit — check the figure for your country." },
    ],
  },
  {
    slug: "baby-development",
    title: "Baby development",
    category: "Baby development",
    stage: "PREGNANCY",
    questions: [
      { prompt: "When do many people first feel clear fetal movements?", choices: ["Around weeks 6–8", "Around weeks 16–22", "Only after week 34", "Never before labour"], answerIndex: 1, explanation: "First movements are commonly felt somewhere around 16–22 weeks, often later in a first pregnancy." },
      { prompt: "In the third trimester the baby is mainly…", choices: ["Forming organs", "Gaining weight and maturing lungs and brain", "Developing the neural tube", "Growing limb buds"], answerIndex: 1, explanation: "Most organ formation is earlier; the third trimester is growth and maturation." },
    ],
  },
  {
    slug: "birth-preparation",
    title: "Birth preparation",
    category: "Birth",
    stage: "BIRTH",
    questions: [
      { prompt: "A birth 'plan' is best described as…", choices: ["A binding contract", "A set of preferences", "A medical order", "A fixed schedule"], answerIndex: 1, explanation: "Labour can change course, so NestWise uses 'preferences' rather than 'plan' (PRD §44.2)." },
      { prompt: "Which belongs in the mother's hospital bag?", choices: ["Car seat", "ID and maternity notes", "Cot mattress", "High chair"], answerIndex: 1, explanation: "Documents/ID and notes are core. The car seat is needed but stays in the car." },
      { prompt: "Skin-to-skin contact after birth helps by…", choices: ["Speeding up paperwork", "Steadying the baby's temperature, breathing and heart rate", "Replacing the first feed", "Guaranteeing sleep"], answerIndex: 1, explanation: "Skin-to-skin supports the newborn's temperature, breathing and heart rate, and bonding." },
    ],
  },
  {
    slug: "newborn-basics",
    title: "Newborn basics",
    category: "Newborn care",
    stage: "POSTPARTUM",
    questions: [
      { prompt: "Safer sleep means placing a baby to sleep…", choices: ["On their front", "On their side", "On their back on a firm flat surface", "Propped on a pillow"], answerIndex: 2, explanation: "Back sleeping on a firm, flat, clear surface is the core safer-sleep message." },
      { prompt: "Newborns in the early weeks typically feed…", choices: ["3 times a day", "Once a day", "8–12 times in 24 hours", "Only at night"], answerIndex: 2, explanation: "Frequent feeds — roughly 8–12 in 24 hours — are normal early on." },
      { prompt: "A good way to burp a newborn is to…", choices: ["Shake gently", "Hold upright against your chest and pat/rub the back", "Lay them flat and press the tummy", "Bounce vigorously"], answerIndex: 1, explanation: "Upright against the shoulder or sitting supported, with gentle patting or rubbing." },
    ],
  },
  {
    slug: "partner-readiness",
    title: "Partner readiness",
    category: "Partner preparation",
    stage: "PREGNANCY",
    questions: [
      { prompt: "The most useful kind of help is often…", choices: ["Asking 'what can I do?' repeatedly", "Owning a recurring task completely", "Waiting to be told", "Doing everything once then stopping"], answerIndex: 1, explanation: "Taking full ownership of a recurring task reduces the mental load for your partner." },
      { prompt: "During labour, a partner can most help by…", choices: ["Directing the medical team", "Offering calm presence, comfort measures and advocacy", "Filming everything", "Making decisions alone"], answerIndex: 1, explanation: "Presence, comfort measures, and helping communicate preferences are the partner's core role." },
    ],
  },
  {
    slug: "toddler-development-2-3",
    title: "Toddler development (2–3 years)",
    category: "Child development",
    stage: "CHILD",
    ageRange: "24-36 months",
    questions: [
      { prompt: "A helpful response to a tantrum is to…", choices: ["Match their volume", "Stay calm, keep them safe, name the feeling", "Ignore them entirely every time", "Offer a big reward to stop"], answerIndex: 1, explanation: "Calm presence and emotion-coaching help a child learn regulation over time." },
      { prompt: "Around ages 2–3, many children begin…", choices: ["Reading fluently", "Combining two or three words and enjoying pretend play", "Riding a bike", "Doing multiplication"], answerIndex: 1, explanation: "Two-to-three-word phrases and pretend play are common in this band — with wide variation." },
      { prompt: "Development at this age should be seen as…", choices: ["A pass/fail test", "A race between children", "A range, with individual timing", "Fixed by age alone"], answerIndex: 2, explanation: "Children develop at different rates; concerns are discussed with a pediatric professional (PRD §26)." },
    ],
  },
];
