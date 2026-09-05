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
 * Symptom Explorer (PRD §8.2, §12). Every entry follows the same 7-part structure and is
 * explicitly NOT a diagnosis engine. Urgent warning signs are always shown.
 */
interface SymptomInput {
  title: string;
  why: string;
  selfCare: string[];
  monitor: string[];
  seeProfessional: string[];
  urgent: string[];
  relatedLessons: string[];
}

const SYMPTOMS: SymptomInput[] = [
  {
    title: "Nausea and vomiting",
    why: "Rising pregnancy hormones and a more sensitive stomach are thought to play a part, especially in the first trimester.",
    selfCare: ["Eat small amounts often", "Try plain, dry foods on waking", "Sip fluids between meals", "Get fresh air and rest when you can"],
    monitor: ["How much you can keep down", "Signs of dehydration such as dark urine or dizziness", "Weight loss"],
    seeProfessional: ["You cannot keep fluids down for a day", "You are losing weight", "Nausea is severe or not improving"],
    urgent: ["Little or no urine for 8+ hours with dizziness or a racing heart", "Vomiting blood"],
    relatedLessons: ["Managing nausea and aversions", "Building a balanced plate"],
  },
  {
    title: "Fatigue",
    why: "Early pregnancy raises progesterone and the body is doing a lot of work; later, disturbed sleep and extra weight add to tiredness.",
    selfCare: ["Rest earlier where possible", "Short daytime rests", "Gentle movement and daylight", "Balanced meals and fluids"],
    monitor: ["Whether rest helps at all", "Breathlessness or a racing heart with mild effort", "Very low mood alongside the tiredness"],
    seeProfessional: ["Exhaustion that does not lift with rest", "Feeling faint", "Low mood most days for two weeks"],
    urgent: ["Chest pain or severe breathlessness", "Fainting"],
    relatedLessons: ["Sleep positions", "Mood changes in pregnancy"],
  },
  {
    title: "Headaches",
    why: "Hormone shifts, changes in blood flow, tiredness, dehydration and less caffeine can all contribute.",
    selfCare: ["Fluids and regular meals", "Rest in a dark, quiet room", "Gentle neck and shoulder stretches", "Consistent sleep times"],
    monitor: ["How often headaches happen", "Whether pain relief your provider approved helps", "Any vision changes or swelling"],
    seeProfessional: ["Frequent or worsening headaches", "Headache not eased by usual measures"],
    urgent: ["A severe headache with blurred vision, spots, upper-tummy pain or sudden swelling — possible signs of pre-eclampsia; seek care now"],
    relatedLessons: ["Late-pregnancy comfort", "Stress and worry"],
  },
  {
    title: "Heartburn",
    why: "Pregnancy hormones relax the valve at the top of the stomach, and later the growing uterus presses upward.",
    selfCare: ["Smaller, more frequent meals", "Avoid lying down straight after eating", "Prop up the head of the bed", "Notice and limit trigger foods"],
    monitor: ["Whether it disturbs sleep", "Any difficulty swallowing", "Symptoms not helped by simple measures"],
    seeProfessional: ["Heartburn that stops you eating or sleeping", "Before using any antacid, to confirm it suits pregnancy"],
    urgent: ["Chest pain with sweating, breathlessness or pain into the arm or jaw — treat as a possible heart problem"],
    relatedLessons: ["Building a balanced plate", "Winding down"],
  },
  {
    title: "Constipation",
    why: "Hormones slow the gut, and iron supplements can make stools harder.",
    selfCare: ["More fibre from fruit, vegetables and whole grains", "More fluids", "Gentle daily movement", "Do not delay going when you feel the urge"],
    monitor: ["How many days between bowel movements", "Pain or bleeding when going", "Bloating with vomiting"],
    seeProfessional: ["No bowel movement for several days with discomfort", "Bleeding from the back passage", "Before starting any laxative"],
    urgent: ["Severe abdominal pain with vomiting and no gas or stool passing"],
    relatedLessons: ["Key nutrients in pregnancy", "Why movement helps"],
  },
  {
    title: "Back discomfort",
    why: "A shifting centre of gravity, softer ligaments and abdominal muscles under stretch change how the back carries load.",
    selfCare: ["Support the lower back when sitting", "Sleep on your side with a pillow between the knees", "Gentle strengthening and stretching", "Flat, supportive shoes"],
    monitor: ["Pain that spreads down a leg", "Any numbness or weakness", "Rhythmic tightening that could be contractions"],
    seeProfessional: ["Back pain that limits daily activity", "Pain with numbness, tingling or leg weakness"],
    urgent: ["Sudden severe back pain with fever, or with regular tightening before 37 weeks", "Loss of bladder or bowel control"],
    relatedLessons: ["Choosing activities by trimester", "Late-pregnancy comfort"],
  },
  {
    title: "Sleep difficulty",
    why: "Discomfort, needing the toilet, vivid dreams and a busy mind all interrupt sleep, especially later on.",
    selfCare: ["Consistent bed and wake times", "Side-lying with pillows for support", "Limit screens and heavy meals late", "A short wind-down routine"],
    monitor: ["Daytime function", "Loud snoring with pauses in breathing", "Low mood with the poor sleep"],
    seeProfessional: ["Ongoing insomnia affecting daily life", "Snoring with witnessed breathing pauses", "Restless, crawling leg sensations at night"],
    urgent: ["Sudden breathlessness when lying flat that forces you upright"],
    relatedLessons: ["Sleep positions", "Winding down"],
  },
  {
    title: "Swelling",
    why: "The body holds more fluid in pregnancy and the growing uterus slows return of blood from the legs. Mild swelling in the feet and ankles is common.",
    selfCare: ["Put feet up regularly", "Move around rather than standing still for long", "Comfortable shoes", "Stay hydrated"],
    monitor: ["Whether swelling settles overnight", "Sudden increase", "Swelling in the face or hands"],
    seeProfessional: ["Swelling that is new, sudden or one-sided", "Swelling with headache or vision changes"],
    urgent: ["A painful, red, swollen calf — possible clot", "Sudden facial or hand swelling with a bad headache or vision changes"],
    relatedLessons: ["Late-pregnancy comfort", "Why movement helps"],
  },
  {
    title: "Mood changes",
    why: "Large hormone shifts, tiredness and the size of the life change all affect mood. Ups and downs are common.",
    selfCare: ["Talk to someone you trust", "Protect sleep and routine", "Gentle activity and daylight", "Lower the bar on non-essential tasks"],
    monitor: ["How many days you feel low or anxious", "Loss of interest in things you enjoy", "Any thoughts of harming yourself"],
    seeProfessional: ["Low or anxious mood most days for two weeks", "Trouble functioning day to day"],
    urgent: ["Thoughts of harming yourself or the baby — contact your provider or emergency services now"],
    relatedLessons: ["Mood changes in pregnancy", "When to reach out for support"],
  },
  {
    title: "Dizziness",
    why: "Blood-pressure changes, blood pooling in the legs, low blood sugar and lying flat later in pregnancy can all cause light-headedness.",
    selfCare: ["Stand up slowly", "Eat and drink regularly", "Lie on your side rather than flat", "Sit or lie down at the first warning"],
    monitor: ["How often it happens", "Any fainting", "Palpitations or breathlessness with it"],
    seeProfessional: ["Frequent dizziness", "Dizziness with a racing or irregular heartbeat"],
    urgent: ["Fainting with a fall or injury", "Dizziness with chest pain, severe breathlessness or vaginal bleeding"],
    relatedLessons: ["Key nutrients in pregnancy", "Sleep positions"],
  },
  {
    title: "Braxton Hicks (practice tightenings)",
    why: "The uterus tightens and relaxes on and off from mid-pregnancy as a kind of practice. They are usually irregular and not painful.",
    selfCare: ["Change position or activity", "Drink water and rest", "Empty your bladder", "Breathe slowly through each one"],
    monitor: ["Whether they become regular", "Whether they get longer, stronger or closer together", "Any fluid leak or bleeding"],
    seeProfessional: ["Regular tightening before 37 weeks", "More than a few an hour that keep coming with rest and water"],
    urgent: ["Regular painful contractions before 37 weeks", "Waters breaking, bleeding, or reduced baby movements with the tightening"],
    relatedLessons: ["The final weeks", "Preferences, not guarantees"],
  },
  {
    title: "Round ligament pain",
    why: "Ligaments that support the uterus stretch as it grows, giving brief sharp pulls low down or in the groin, often with movement.",
    selfCare: ["Move position slowly", "Bend towards the pain to ease the stretch", "Support the bump when getting up", "Warm (not hot) compress"],
    monitor: ["Whether pain is brief and movement-related or constant", "Any fever, bleeding or regular tightening"],
    seeProfessional: ["Pain that is constant, severe or worsening", "Pain with fever or urinary symptoms"],
    urgent: ["Severe constant abdominal pain, especially with bleeding, fever or a hard, tender uterus"],
    relatedLessons: ["Mid-pregnancy changes", "Choosing activities by trimester"],
  },
];

export function symptomSeeds(): ContentSeed[] {
  return SYMPTOMS.map((s) => ({
    slug: slugify(s.title),
    title: s.title,
    contentType: "SYMPTOM" as const,
    stage: "PREGNANCY" as const,
    category: "Symptom",
    summary: `${s.title}: a common explanation, why it can happen, general self-care, what to monitor, and clear signs to get help.`,
    keyTakeaways: [
      `${s.title} is a commonly reported pregnancy experience.`,
      s.why,
      "This is general information, not a diagnosis.",
      `Urgent: ${s.urgent[0]}`,
    ],
    blocks: [
      heading("1. Common explanation"),
      para(`${s.title} is often reported during pregnancy. It affects people differently and is frequently, though not always, part of normal change.`),
      heading("2. Why it can happen"),
      para(s.why),
      heading("3. General comfort and self-care"),
      list(s.selfCare),
      heading("4. Things worth monitoring"),
      list(s.monitor),
      heading("5. When to contact a healthcare professional"),
      list(s.seeProfessional),
      callout("emergency", s.urgent.join(" ")),
      heading("7. Related NestWise lessons"),
      list(s.relatedLessons),
      callout(
        "info",
        "The Symptom Explorer is for learning and preparation. It does not assess your situation — a clinician does that.",
      ),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));
}
