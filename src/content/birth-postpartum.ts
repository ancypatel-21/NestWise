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
 * Part 2 content: Understanding Childbirth (§19), Preparing for Postpartum Body Changes (§21),
 * Partner Postpartum Support (§22), Postpartum Nutrition (§23), First Days After Birth (§24),
 * Parent Wellbeing (§25). Calm, neutral language; no implication that every birth follows one
 * sequence.
 */

function simpleTopic(
  slug: string,
  title: string,
  contentType: ContentSeed["contentType"],
  stage: ContentSeed["stage"],
  category: string,
  summary: string,
  what: string[],
  care: string[],
  professional: string[],
  urgent?: string,
): ContentSeed {
  return {
    slug,
    title,
    contentType,
    stage,
    category,
    summary,
    keyTakeaways: [summary, "General education — your provider guides your specific care.", urgent ? `Urgent: ${urgent}` : "Warning signs are listed on the page."],
    blocks: [
      heading("What may happen"),
      list(what),
      heading("General comfort and support"),
      list(care),
      heading("When to seek professional care"),
      list(professional),
      ...(urgent ? [callout("emergency", urgent)] : []),
      callout("info", "Recovery timelines vary a lot between people. This is context, not a schedule to match."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

// ---- §19 Understanding Childbirth ----
const LABOR_TOPICS: Array<{ title: string; points: string[] }> = [
  { title: "Signs labour may be beginning", points: ["Regular tightenings that build in length, strength and closeness", "A 'show' (mucus plug)", "Waters breaking — a gush or a slow trickle", "Low backache or a settled, crampy feeling"] },
  { title: "Contractions", points: ["Tightening then relaxing of the uterus", "Timed from the start of one to the start of the next", "Early labour contractions are often short and spaced out", "They usually get longer, stronger and closer over time"] },
  { title: "Stages of labour", points: ["First stage: the cervix opens (early and active phases)", "Second stage: pushing and birth of the baby", "Third stage: delivery of the placenta", "Every labour is different in length and pattern"] },
  { title: "Going to the hospital or birth centre", points: ["Your team will advise when to come in based on contractions and your situation", "Bring your notes/ID and bags", "Call ahead if waters have broken, there's bleeding, or reduced movements"] },
  { title: "Vaginal birth overview", points: ["The baby moves down and rotates through the pelvis", "Pushing works with contractions in the second stage", "Positions can be changed to help progress and comfort"] },
  { title: "Caesarean birth overview", points: ["Birth through a surgical incision in the abdomen and uterus", "May be planned or decided during labour", "Usually with regional anaesthesia so you're awake", "Recovery is an abdominal-surgery recovery"] },
  { title: "Pain-management overview", points: ["Non-medical: movement, water, breathing, massage, TENS", "Medical: gas and air, opioid injections, epidural", "Options and availability vary by place and situation", "You can change your mind during labour"] },
  { title: "Monitoring during labour", points: ["The baby's heart rate and your observations are checked regularly", "Intermittent or continuous monitoring depending on the situation", "Ask what a recommendation means and what the alternatives are"] },
  { title: "Placenta delivery", points: ["Happens after the baby is born", "Can be actively managed with an injection or left physiological", "Your team checks the placenta appears complete"] },
  { title: "Immediate newborn checks", points: ["A quick assessment of breathing, colour, tone and heart rate (Apgar)", "Warmth and drying", "Weighing and a fuller check usually follow a little later"] },
  { title: "Skin-to-skin", points: ["Baby placed on your bare chest, covered with a warm towel", "Helps temperature, breathing, heart rate and bonding", "Supports the first feed", "The partner can do skin-to-skin too"] },
  { title: "First feeding", points: ["Many babies show feeding cues within the first hour or two", "Early feeds are small — that's expected", "Support is available for latch and positioning"] },
  { title: "The partner's role in labour", points: ["Calm presence and encouragement", "Practical comfort: drinks, cool cloths, position changes", "Helping communicate the birth preferences", "Being the steady point of contact for updates"] },
];

// ---- §21 Postpartum body changes ----
const POSTPARTUM_BODY: Array<Parameters<typeof simpleTopic>> = [
  ["pp-bleeding", "Bleeding and discharge (lochia)", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "Vaginal bleeding that gradually reduces and changes colour over weeks.", ["Heavier and red at first, then pink/brown, then yellow/white", "Can increase briefly with activity or feeding", "Gradually lessens over several weeks"], ["Use maternity pads, not tampons", "Rest when bleeding increases", "Keep the area clean and dry"], ["Soaking a pad an hour, large clots, or a foul smell", "Bleeding that increases again after slowing"], "Very heavy bleeding (soaking a pad in an hour or less), passing large clots, feeling faint — seek urgent care."],
  ["pp-uterus", "Uterine changes (afterpains)", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "The uterus contracts back down, sometimes with cramping, especially during feeds.", ["Cramp-like 'afterpains', often stronger after a second+ baby", "Usually ease over the first week"], ["Warmth on the lower tummy", "Ask your provider what pain relief suits you"], ["Severe or worsening pain", "A tender abdomen with fever"], undefined],
  ["pp-breast", "Breast changes", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "Milk 'coming in' around days 2–5 can make breasts full, firm and tender, whether or not you breastfeed.", ["Fullness, warmth and tenderness", "Leaking is common", "Settles as supply regulates or, if not feeding, as milk reduces"], ["Frequent feeding or comfortable expression if breastfeeding", "Cool packs between feeds", "Supportive (not tight) bra"], ["A red, painful area with fever or feeling unwell (possible mastitis)", "A hard lump that doesn't move with feeding"], undefined],
  ["pp-abdomen", "Abdominal changes", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "The belly stays soft and rounded for a while; abdominal muscles may have separated (diastasis recti).", ["A soft post-baby belly for weeks to months", "A possible midline gap in the abdominal muscles", "Skin changes and linea nigra fade slowly"], ["Gentle core and pelvic-floor work when cleared", "Log-roll to get up from lying", "Be patient with the timeline"], ["A large or worsening muscle gap", "Doming/coning of the belly with effort"], undefined],
  ["pp-perineal", "Perineal recovery", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "Soreness, and healing of any tear or episiotomy, in the days and weeks after a vaginal birth.", ["Soreness, swelling and stinging when passing urine at first", "Stitches, if present, usually dissolve"], ["Cool packs early on, then warm baths", "Pour warm water while passing urine", "Cushion for sitting; keep the area clean and dry"], ["Increasing pain, spreading redness, or a bad smell", "Wound edges opening"], undefined],
  ["pp-csection", "C-section recovery", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "Recovery from abdominal surgery alongside newborn care.", ["Wound soreness, numbness around the scar", "Trapped wind and constipation are common", "Tiredness with movement for a few weeks"], ["Support the wound when coughing or moving", "Short frequent walks once encouraged", "Avoid heavy lifting beyond the baby for a few weeks"], ["Red, hot, leaking or opening wound", "Fever, or calf pain and swelling", "Heavy vaginal bleeding"], "Severe abdominal pain, a hot leaking wound with fever, or chest pain / breathlessness — seek urgent care."],
  ["pp-swelling", "Swelling and fluid shifts", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "Extra fluid from pregnancy leaves the body over the first weeks, sometimes with more swelling or sweating first.", ["Puffy hands, feet and ankles for some days", "Night sweats as fluid clears"], ["Move regularly, elevate feet", "Stay hydrated", "Loose, cool clothing for night sweats"], ["Sudden or one-sided leg swelling with pain or redness", "Swelling with headache or vision changes in the first weeks"], "A painful, swollen, red calf, or swelling with a severe headache or vision changes — seek urgent care."],
  ["pp-hormones", "Hormonal changes", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "A rapid hormone shift after birth affects mood, sleep, skin and hair.", ["Tearfulness in the first week ('baby blues') that lifts within about two weeks", "Hair shedding a few months later", "Skin and libido changes"], ["Rest, food, daylight and support", "Talk about how you're feeling", "Give the timeline room"], ["Low or anxious mood most days beyond two weeks", "Feeling unable to cope or care for yourself or the baby"], "Thoughts of harming yourself or the baby, or feeling out of touch with reality — contact your provider or emergency services now."],
  ["pp-pelvic-floor", "Pelvic-floor recovery", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "The pelvic floor is stretched by pregnancy and birth and rebuilds over time with gentle training.", ["Some leaking with cough/sneeze early on", "A feeling of heaviness for a while"], ["Start gentle pelvic-floor exercises when comfortable", "Avoid heavy lifting early", "Ask for a referral to a pelvic-health physio if symptoms persist"], ["Leaking that isn't improving by 6–8 weeks", "A bulge or dragging sensation in the vagina"], undefined],
  ["pp-emotional", "Emotional changes", "POSTPARTUM_TOPIC", "POSTPARTUM", "Recovery", "A wide mix of feelings — joy, overwhelm, worry — is normal as you adjust.", ["Mood swings, especially with broken sleep", "Feeling protective and easily moved", "Moments of doubt"], ["Lower expectations on yourself", "Accept practical help", "Connect with other new parents"], ["Persistent low mood, anxiety, intrusive thoughts, or loss of interest", "Panic that interferes with daily life"], undefined],
];

// ---- §22 Partner postpartum support ----
const PARTNER_PP: string[] = [
  "Emotional support: check in daily, listen first, reassure without minimising.",
  "Sharing night responsibilities: agree a plan so recovery sleep is protected.",
  "Protecting recovery time: shield the first weeks from unnecessary demands.",
  "Food and hydration: keep easy meals, snacks and water within reach, especially during feeds.",
  "Household responsibilities: take these on by default, not on request.",
  "Supporting feeding choices: back the plan you've made together; help arrange feeding support.",
  "Recognising when professional support is needed: know the signs of postpartum depression and anxiety and how to get help.",
  "Managing visitors: agree timing and length together; it's fine to say not yet.",
  "Bonding with the baby: do skin-to-skin, nappies, baths, carries and settling.",
  "Protecting the couple's communication: short daily check-ins; assume good intent when tired.",
  "Understanding postpartum mood changes: 'baby blues' vs conditions that need care.",
];

// ---- §24 First days after birth ----
const FIRST_DAYS: Array<{ title: string; points: string[] }> = [
  { title: "Feeding basics", points: ["Watch for early cues (rooting, hands to mouth) rather than waiting for crying", "Expect frequent, small feeds", "Ask for feeding support early if anything hurts or feels stuck"] },
  { title: "Diapering", points: ["Change frequently; clean front to back", "Track wet and dirty nappies in the first days", "Expect dark, sticky meconium to change to softer, lighter stools"] },
  { title: "Burping", points: ["Hold upright against your chest or sit them supported", "Gently pat or rub the back", "Not every feed brings up wind — that's fine"] },
  { title: "Safe sleep", points: ["Back to sleep, on a firm flat surface, in the same room as you for the early months", "Clear cot — no pillows, bumpers or loose bedding", "Avoid overheating; keep the head uncovered"] },
  { title: "Holding and supporting a newborn", points: ["Support the head and neck", "Bring baby to you rather than leaning over", "Wash or sanitise hands before holds, especially visitors"] },
  { title: "Umbilical-cord care", points: ["Keep the stump clean and dry", "Fold the nappy below it", "It usually drops off within one to three weeks"] },
  { title: "Bathing", points: ["Top-and-tail washing is enough at first", "Full baths a few times a week once you're ready", "Never leave the baby alone in or near water"] },
  { title: "Newborn crying", points: ["Work through feed, nappy, warmth, comfort and closeness", "Crying often peaks around 6–8 weeks", "It's okay to put the baby down safely and take a breather if you feel overwhelmed"] },
  { title: "Skin-to-skin at home", points: ["Calms baby and supports feeding and bonding", "Both parents can do it", "A good default for a fractious evening"] },
  { title: "Parent sleep strategies", points: ["Sleep when you can, not only at night", "Share night duties where possible", "Lower non-essential tasks in the early weeks"] },
  { title: "Visitors", points: ["Agree timing and length in advance", "It's reasonable to ask people to wash hands and skip visits if unwell", "Short visits, and it's fine to say not yet"] },
  { title: "Hygiene", points: ["Hand-washing before handling the baby", "Keep feeding equipment clean and sterilised as advised", "Everyday cleanliness rather than a sterile home"] },
  { title: "Pediatric appointments", points: ["Attend the early newborn checks and weigh-ins", "Bring your questions written down", "Ask what's normal and what to watch for"] },
  { title: "Newborn screening overview", points: ["A heel-prick blood test screens for certain rare conditions", "Hearing and physical checks are usually done in the first days", "Ask your team to explain results and next steps"] },
  { title: "Car-seat basics", points: ["Rear-facing, correctly installed, harness snug", "Nothing bulky under the harness", "Practise the fit before the trip home"] },
  { title: "When to contact the baby's clinician", points: ["Poor feeding, very few wet nappies, or hard to wake", "Fever or low temperature, fast or laboured breathing", "Yellowing skin/eyes that is spreading or early", "You're worried — trust that and call"] },
];

export function birthPostpartumSeeds(): ContentSeed[] {
  const labor: ContentSeed[] = LABOR_TOPICS.map((t) => ({
    slug: `labor-${slugify(t.title)}`,
    title: t.title,
    contentType: "BIRTH_TOPIC" as const,
    stage: "BIRTH" as const,
    category: "Understanding childbirth",
    summary: `${t.title}: a calm, neutral overview.`,
    keyTakeaways: [`${t.title} — general education.`, "Births vary; this is not a fixed sequence.", "Ask your team what any recommendation means for you."],
    blocks: [para(`${t.title} — an overview. Labour and birth vary between people and situations; this describes common patterns, not a required path.`), list(t.points), callout("info", "Use calm curiosity here. You can ask questions and change your mind during labour.")],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  const body: ContentSeed[] = POSTPARTUM_BODY.map((args) => simpleTopic(...args));

  const partner: ContentSeed = {
    slug: "partner-postpartum-support",
    title: "Partner postpartum support",
    contentType: "POSTPARTUM_TOPIC",
    stage: "POSTPARTUM",
    category: "Partner",
    summary: "How the partner protects recovery, shares the load, bonds with the baby, and spots when professional support is needed.",
    keyTakeaways: ["Take on household and logistics by default.", "Protect the recovering parent's sleep and time.", "Know the signs that mean it's time to get professional help."],
    blocks: [heading("Ways to support in the fourth trimester"), list(PARTNER_PP), callout("caution", "If the other parent has low or anxious mood most days beyond two weeks, can't sleep even when the baby sleeps, or has frightening thoughts — help them contact their provider. Seek urgent help for any thoughts of self-harm or harm to the baby.")],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };

  const ppNutrition: ContentSeed = {
    slug: "postpartum-nutrition",
    title: "Postpartum nutrition",
    contentType: "POSTPARTUM_TOPIC",
    stage: "POSTPARTUM",
    category: "Nutrition",
    summary: "Practical eating for the recovery period: balanced meals, hydration, fibre, protein and iron-rich foods, with convenient options.",
    keyTakeaways: ["Aim for regular balanced meals and easy snacks.", "Hydration matters, especially if breastfeeding.", "No food 'heals' a condition — this is general nourishment."],
    blocks: [
      heading("Focus areas"),
      list(["Balanced meals with protein, whole carbs and vegetables", "Fluids within reach, particularly during feeds", "Fibre (fruit, vegetables, whole grains) to ease constipation", "Iron-rich foods if you lost blood at birth — pair with vitamin C", "Convenient, one-handed snacks for feeding times"]),
      heading("Convenient options"),
      list(["Overnight oats, yoghurt pots, fruit", "Wraps and sandwiches with protein and salad", "Batch-cooked soups, chillis and traybakes to freeze", "Nuts/seeds, cheese, boiled eggs, hummus and veg"]),
      callout("info", "Personalise to your food preferences, allergies and culture. Ask your provider about continuing any pregnancy supplements."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };

  const firstDays: ContentSeed[] = FIRST_DAYS.map((t) => ({
    slug: `first-days-${slugify(t.title)}`,
    title: t.title,
    contentType: "FIRST_DAYS" as const,
    stage: "POSTPARTUM" as const,
    category: "First days home",
    summary: `${t.title}: what to do and what's normal in the first days home.`,
    keyTakeaways: [`${t.title} — practical newborn-care basics.`, "When in doubt about the baby's health, contact their clinician.", "Look after the parents too."],
    blocks: [list(t.points), callout("info", "Practise the hands-on skills before you need them at 3am — Ask NestWise or a lesson can walk you through each one.")],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  const wellbeing: ContentSeed[] = [
    ["parent-sleep-deprivation", "Sleep deprivation", "Understanding how broken sleep affects mood, patience and thinking, and how to blunt the worst of it."],
    ["parent-emotional-adjustment", "Emotional adjustment", "The identity shift of new parenthood and giving it room."],
    ["parent-asking-for-help", "Asking for help", "Why asking early is a strength, and concrete things to ask for."],
    ["parent-partner-communication", "Partner communication", "Short check-ins, assuming good intent, and repairing after friction."],
    ["parent-visitors-boundaries", "Managing visitors and boundaries", "Deciding together and holding limits kindly."],
    ["parent-returning-to-routine", "Returning to routine gradually", "Rebuilding rhythm without rushing."],
    ["parent-mental-health", "Mental-health education", "Postpartum depression and anxiety awareness for both parents, and where to get help."],
  ].map(([slug, title, summary]) => ({
    slug,
    title,
    contentType: "POSTPARTUM_TOPIC" as const,
    stage: "POSTPARTUM" as const,
    category: "Parent wellbeing",
    summary,
    keyTakeaways: [summary, "Supportive information — not a diagnosis.", "Professional help is available and effective."],
    blocks: [
      para(summary),
      heading("What can help"),
      list(["Protect sleep and basic needs first", "Name what you're feeling to someone you trust", "Lower expectations on non-essentials", "Use professional support early rather than waiting"]),
      callout("caution", "If low or anxious mood lasts most days beyond two weeks, or you can't function day to day, contact your provider."),
      callout("emergency", "Thoughts of harming yourself or your baby, or feeling detached from reality — contact your provider or emergency services now."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  return [...labor, ...body, partner, ppNutrition, ...firstDays, ...wellbeing];
}
