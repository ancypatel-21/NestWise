import type { Stage } from "@prisma/client";
import type { QuizQuestion } from "@/types";

/**
 * Stage quizzes that sit outside the pregnancy Learn modules (those have their own module quizzes
 * in learn-quizzes.ts): birth, first weeks after birth, and toddler development. Multiple choice,
 * each with an immediate explanation. Nothing here gamifies symptoms or emergencies.
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
    slug: "birth-preparation",
    title: "Birth preparation",
    category: "Birth",
    stage: "BIRTH",
    questions: [
      { prompt: "A birth 'plan' is best described as…", choices: ["A binding contract", "A set of preferences", "A medical order", "A fixed schedule"], answerIndex: 1, explanation: "Labour can change course, so NestWise uses 'preferences' rather than 'plan'." },
      { prompt: "Which belongs in the mother's hospital bag?", choices: ["Car seat", "ID and maternity notes", "Cot mattress", "High chair"], answerIndex: 1, explanation: "Documents/ID and notes are core. The car seat is needed but stays in the car." },
      { prompt: "Skin-to-skin contact after birth helps by…", choices: ["Speeding up paperwork", "Steadying the baby's temperature, breathing and heart rate", "Replacing the first feed", "Guaranteeing sleep"], answerIndex: 1, explanation: "Skin-to-skin supports the newborn's temperature, breathing and heart rate, and bonding." },
      { prompt: "The most effective pain relief in labour is…", choices: ["Gas and air", "An opioid injection", "An epidural", "A TENS machine"], answerIndex: 2, explanation: "An epidural is the most effective, with trade-offs like monitoring and a possibly longer pushing stage." },
      { prompt: "Contractions are timed…", choices: ["From the end of one to the start of the next", "From the start of one to the start of the next", "Only when they hurt", "In minutes per hour"], answerIndex: 1, explanation: "Time from the beginning of one contraction to the beginning of the next." },
      { prompt: "For straightforward labour, care is usually led by…", choices: ["An obstetrician", "A midwife", "A paediatrician", "A GP"], answerIndex: 1, explanation: "A midwife leads; an obstetrician steps in if extra help is needed." },
    ],
  },
  {
    slug: "newborn-basics",
    title: "First weeks after birth",
    category: "Newborn care",
    stage: "POSTPARTUM",
    questions: [
      { prompt: "Safer sleep means placing a baby to sleep…", choices: ["On their front", "On their side", "On their back on a firm flat surface", "Propped on a pillow"], answerIndex: 2, explanation: "Back sleeping on a firm, flat, clear surface is the core safer-sleep message." },
      { prompt: "Newborns in the early weeks typically feed…", choices: ["3 times a day", "Once a day", "8–12 times in 24 hours", "Only at night"], answerIndex: 2, explanation: "Frequent feeds — roughly 8–12 in 24 hours — are normal early on." },
      { prompt: "A good way to burp a newborn is to…", choices: ["Shake gently", "Hold upright against your chest and pat/rub the back", "Lay them flat and press the tummy", "Bounce vigorously"], answerIndex: 1, explanation: "Upright against the shoulder or sitting supported, with gentle patting or rubbing." },
      { prompt: "Newborn crying tends to peak at around…", choices: ["1 week", "6–8 weeks", "6 months", "It never peaks"], answerIndex: 1, explanation: "It commonly peaks around 6–8 weeks and then eases." },
      { prompt: "If you feel overwhelmed by crying, you should…", choices: ["Keep holding no matter what", "Put the baby down safely, step away briefly, and call someone", "Shake the baby to stop it", "Leave the house"], answerIndex: 1, explanation: "Never shake a baby. Putting them down safely and taking a breather is the right response." },
      { prompt: "For at least the first 6 months, the baby should sleep…", choices: ["In their own room", "In the same room as you", "In your bed", "Wherever is quietest"], answerIndex: 1, explanation: "Room-sharing (not bed-sharing) for at least 6 months is advised." },
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
      { prompt: "Around ages 2–3, many children begin…", choices: ["Reading fluently", "Combining two or three words and enjoying pretend play", "Riding a bike", "Doing arithmetic"], answerIndex: 1, explanation: "Two-to-three-word phrases and rich pretend play are common in this band — with wide variation." },
      { prompt: "Development at this age should be seen as…", choices: ["A pass/fail test", "A race between children", "A range, with individual timing", "Fixed by age alone"], answerIndex: 2, explanation: "Children develop at different rates; genuine concerns are discussed with a pediatric professional." },
      { prompt: "By age 3, a stranger can usually understand…", choices: ["None of the child's speech", "About half to most of it", "All of it perfectly", "Only single words"], answerIndex: 1, explanation: "Speech becomes clearer through the third year; about half to most is understandable to others by age 3." },
      { prompt: "Screen-time guidance for ages 2–3 is…", choices: ["Unlimited", "None at all ever", "Limited, with clear boundaries and co-viewing", "Only educational shows, all day"], answerIndex: 2, explanation: "Keep it limited and shared, with clear, consistent limits." },
      { prompt: "A good time to start toilet learning is…", choices: ["Exactly at age 2", "When the child shows signs of readiness", "As early as possible", "Only after age 4"], answerIndex: 1, explanation: "Follow the child's readiness cues rather than a fixed birthday." },
    ],
  },
];
