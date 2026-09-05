import {
  callout,
  heading,
  list,
  para,
  PLACEHOLDER_SOURCE,
  TRUSTED_REFS,
  type ContentSeed,
} from "./_helpers";

/**
 * Child timeline (PRD §26): months 1–12 individually, then yearly bands to age 12.
 * Every stage covers the six development categories (§27), a For Parents area (§28), and
 * positive discipline / habit building (§29). Development is a range, never pass/fail (§26, §37).
 */

export interface ChildStageMeta {
  slug: string;
  title: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  band: "First year" | "Yearly stages";
}

function buildStages(): ChildStageMeta[] {
  const stages: ChildStageMeta[] = [];
  for (let m = 1; m <= 12; m++) {
    stages.push({
      slug: `month-${m}`,
      title: `Month ${m}`,
      ageMinMonths: m - 1,
      ageMaxMonths: m,
      band: "First year",
    });
  }
  for (let y = 1; y <= 11; y++) {
    stages.push({
      slug: `age-${y}-${y + 1}`,
      title: `Age ${y}–${y + 1}`,
      ageMinMonths: y * 12,
      ageMaxMonths: (y + 1) * 12,
      band: "Yearly stages",
    });
  }
  return stages;
}

export const CHILD_STAGES = buildStages();

const CATEGORIES = [
  "Physical development",
  "Cognitive development",
  "Language & communication",
  "Emotional development",
  "Social development",
  "Creativity",
] as const;

const NOTICE_BY_CATEGORY: Record<string, (s: ChildStageMeta) => string[]> = {
  "Physical development": (s) =>
    s.band === "First year"
      ? ["Head control, then rolling, sitting, and moving toward crawling as the months pass", "Reaching, grasping and bringing things to the mouth", "More purposeful hand movements over time"]
      : ["Walking, running, climbing and stairs, then jumping, balance and ball skills", "Fine motor: scribbling to drawing, using utensils, buttons, then writing", "Growing coordination and stamina in active play"],
  "Cognitive development": (s) =>
    s.band === "First year"
      ? ["Tracking faces and objects, then looking for hidden things (object permanence emerging)", "Exploring cause and effect by banging, dropping and shaking", "Recognising familiar people and routines"]
      : ["Longer attention for chosen activities; sorting, matching and simple problem solving", "Pretend play becomes richer and more planned", "Early counting, then reasoning, memory strategies and school-style thinking"],
  "Language & communication": (s) =>
    s.band === "First year"
      ? ["Cooing and babbling, turn-taking in 'conversation'", "Responding to their name and tone of voice", "First gestures like pointing and waving"]
      : ["First words to short phrases, then sentences and questions", "Following instructions of increasing length", "Vocabulary growth, storytelling, then reading and writing as age-appropriate"],
  "Emotional development": (s) =>
    s.band === "First year"
      ? ["Being soothed by a caregiver; growing range of expressions", "Stranger and separation awareness later in the year", "Sharing joy through smiles and laughter"]
      : ["Big feelings with limited control at first; tantrums are common in toddlerhood", "Naming feelings, then using words and strategies to cope", "Growing confidence and independence"],
  "Social development": (s) =>
    s.band === "First year"
      ? ["Social smiling, watching people closely", "Enjoying peekaboo and simple back-and-forth games", "Preference for familiar caregivers"]
      : ["Playing alongside, then with, other children", "Learning to take turns, share and cooperate", "Friendships, empathy and group play deepen with age"],
  Creativity: (s) =>
    s.band === "First year"
      ? ["Exploring textures, sounds and simple toys", "Enjoying music, movement and being sung to", "Discovering they can make things happen"]
      : ["Drawing, building, music-making and dress-up", "Inventing stories, games and rules", "Using materials in original ways"],
};

const ENCOURAGE_BY_CATEGORY: Record<string, string[]> = {
  "Physical development": ["Safe floor time and space to move", "Offer objects to reach for and, later, to stack and post", "Active outdoor play daily"],
  "Cognitive development": ["Play hide-and-find games", "Talk through what you're doing and why", "Offer open-ended materials (cups, blocks, boxes)"],
  "Language & communication": ["Narrate daily life; pause for their reply", "Read together every day", "Expand on what they say ('ball' → 'yes, a big red ball')"],
  "Emotional development": ["Name feelings calmly and stay close during big ones", "Keep routines predictable", "Let them do safe things themselves"],
  "Social development": ["Model turn-taking and sharing", "Arrange short playdates as they get older", "Coach, don't referee, minor squabbles"],
  Creativity: ["Provide simple art and building materials", "Join their pretend play following their lead", "Sing, dance and make up stories together"],
};

const AVOID_BY_CATEGORY: Record<string, string[]> = {
  "Physical development": ["Long periods in seats, bouncers or containers", "Pushing physical 'milestones' ahead of readiness"],
  "Cognitive development": ["Over-scheduling with little free play", "Screens as the main source of stimulation for young children"],
  "Language & communication": ["Correcting speech harshly — model the right form instead", "Background TV during play and meals"],
  "Emotional development": ["Punishing feelings themselves", "Expecting adult-level self-control"],
  "Social development": ["Forcing sharing on demand for very young children", "Labelling a child as 'shy' or 'difficult' within their hearing"],
  Creativity: ["Focusing on the finished product over the process", "Too many battery-powered toys that do the playing for them"],
};

const PARENT_LEARNING_TOPICS = [
  "What your child may be learning now",
  "Communication techniques",
  "Bonding",
  "Setting boundaries",
  "Building independence",
  "Encouraging curiosity",
  "Managing frustration",
  "Supporting confidence",
  "Safety",
  "Sleep",
  "Routines",
  "Healthy technology habits",
  "School readiness",
  "Friendship and social skills",
];

const HABITS_BY_BAND: Record<ChildStageMeta["band"], string[]> = {
  "First year": ["Predictable feed–play–sleep rhythms", "Gentle bedtime routine", "Hand hygiene modelled by caregivers", "Daily reading and singing"],
  "Yearly stages": ["Please and thank you", "Cleaning up toys together", "Handwashing and brushing teeth", "Bedtime and morning routines", "Sharing and turn-taking", "Helping with simple chores", "Managing screen time with clear limits", "Homework/study routines and physical activity for older children", "Saving and spending basics for older children"],
};

function stageDevelopmentSeed(s: ChildStageMeta): ContentSeed {
  const blocks = CATEGORIES.flatMap((cat) => [
    heading(cat),
    para("What parents may notice:"),
    list(NOTICE_BY_CATEGORY[cat](s)),
    para("Ways to encourage it:"),
    list(ENCOURAGE_BY_CATEGORY[cat]),
    para("Things to limit or avoid:"),
    list(AVOID_BY_CATEGORY[cat]),
  ]);

  return {
    slug: `dev-${s.slug}`,
    title: `${s.title} — development`,
    contentType: "DEVELOPMENT",
    stage: "CHILD",
    category: "Development overview",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `${s.title}: what parents may notice across the six areas of development, with ways to encourage each and when professional guidance can help.`,
    keyTakeaways: [
      "Children develop at different rates — ranges, not deadlines.",
      "Encourage through everyday play, talk and routine.",
      "Discuss genuine concerns with a pediatric professional (PRD §26).",
    ],
    blocks: [
      callout("info", "This is a general map. Missing something on a list at a given age is usually within normal variation. Persistent concerns are worth raising with your child's clinician."),
      ...blocks,
      heading("When professional guidance may help"),
      list([
        "Loss of skills a child previously had",
        "No response to sounds or to their name",
        "Very little eye contact, gestures or shared attention",
        "Not walking or not using words well outside the usual ranges",
        "Your instinct that something is different — always worth a conversation",
      ]),
      callout("caution", "Educational game performance in NestWise is not a developmental assessment. Only a qualified professional can assess development (PRD §37)."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

function stageParentLearningSeed(s: ChildStageMeta): ContentSeed {
  return {
    slug: `parent-${s.slug}`,
    title: `${s.title} — for parents`,
    contentType: "PARENT_LEARNING",
    stage: "CHILD",
    category: "Parent learning",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `For Parents at ${s.title}: communication, bonding, boundaries, independence, routines, sleep, safety, technology and (as relevant) school and friendships.`,
    keyTakeaways: [
      "Warm, consistent responses build security.",
      "Boundaries plus connection beats control.",
      "Adjust expectations to the child's stage, not the calendar.",
    ],
    blocks: [
      list(PARENT_LEARNING_TOPICS.map((t) => `${t} — practical guidance for ${s.title.toLowerCase()}.`)),
      callout("tip", "Pick one focus for the week rather than trying to work on everything at once."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

function stageDisciplineSeed(s: ChildStageMeta): ContentSeed {
  return {
    slug: `discipline-${s.slug}`,
    title: `${s.title} — positive discipline & habits`,
    contentType: "DISCIPLINE",
    stage: "CHILD",
    category: "Discipline & habits",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `Age-appropriate habit building and positive discipline for ${s.title}.`,
    keyTakeaways: [
      "Age-appropriate expectations and clear, consistent boundaries.",
      "Positive reinforcement and natural/logical consequences.",
      "No physical punishment or humiliating discipline (PRD §29).",
    ],
    blocks: [
      heading("Habits to build now"),
      list(HABITS_BY_BAND[s.band]),
      heading("Positive discipline principles"),
      list([
        "Set expectations that match the child's stage",
        "Keep boundaries clear and consistent between caregivers",
        "Notice and name the behaviour you want to see",
        "Use natural and logical consequences, calmly",
        "Coach emotions: name the feeling, then the limit ('you're angry; hitting isn't okay')",
        "Repair and reconnect after conflict",
      ]),
      callout("caution", "Avoid physical punishment and shaming. They increase fear and aggression and harm the relationship without teaching the skill you want."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

export function childDevelopmentSeeds(): ContentSeed[] {
  return CHILD_STAGES.flatMap((s) => [
    stageDevelopmentSeed(s),
    stageParentLearningSeed(s),
    stageDisciplineSeed(s),
  ]);
}
