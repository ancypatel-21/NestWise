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
 * Child timeline — pregnancy through the first three years.
 * Months 1–12 individually, then "Age 1–2" and "Age 2–3". Every stage covers the six areas of
 * development, a For Parents area, and positive-discipline / habit building. Development is a
 * range, never pass/fail; genuine concerns go to a pediatric professional.
 *
 * Milestone framing follows the widely published CDC "Learn the Signs. Act Early." / WHO
 * developmental-milestone approach. Copy here is educational scaffolding pending expert review.
 */

export interface ChildStageMeta {
  slug: string;
  title: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  band: "First year" | "Toddler";
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
  stages.push({ slug: "age-1-2", title: "Age 1–2", ageMinMonths: 12, ageMaxMonths: 24, band: "Toddler" });
  stages.push({ slug: "age-2-3", title: "Age 2–3", ageMinMonths: 24, ageMaxMonths: 36, band: "Toddler" });
  return stages;
}

export const CHILD_STAGES = buildStages();

const CATEGORIES = [
  "Physical development",
  "Cognitive development",
  "Language & communication",
  "Emotional development",
  "Social development",
  "Creativity & play",
] as const;

/** Age-band buckets for stage-specific milestone copy. */
type Bucket = "0-2" | "3-4" | "5-6" | "7-9" | "10-12" | "12-24" | "24-36";

function bucketFor(s: ChildStageMeta): Bucket {
  if (s.slug === "age-1-2") return "12-24";
  if (s.slug === "age-2-3") return "24-36";
  const m = s.ageMaxMonths;
  if (m <= 2) return "0-2";
  if (m <= 4) return "3-4";
  if (m <= 6) return "5-6";
  if (m <= 9) return "7-9";
  return "10-12";
}

const NOTICE: Record<string, Record<Bucket, string[]>> = {
  "Physical development": {
    "0-2": ["Lifts head briefly during tummy time and turns it side to side", "Movements smooth out from jerky newborn reflexes", "Brings hands toward the mouth; hands often fisted"],
    "3-4": ["Holds head steady without support when upright", "Pushes up on forearms during tummy time", "Opens hands, holds a toy briefly, may bring both hands together"],
    "5-6": ["Rolls from tummy to back, then back to tummy", "Sits with support, then briefly on their own", "Reaches for and grabs toys, passes them hand to hand"],
    "7-9": ["Sits without support and gets into a sitting position", "Rakes small objects toward themselves; starts a pincer grasp", "Rocks on hands and knees; may crawl or scoot"],
    "10-12": ["Pulls to stand and cruises along furniture", "Picks up small things with thumb and finger (pincer grasp)", "May stand alone briefly or take first steps"],
    "12-24": ["Walks independently, then runs, squats and climbs", "Walks up stairs with help; kicks and throws a ball", "Scribbles, stacks 2–4 blocks, uses a spoon and cup with spills"],
    "24-36": ["Runs well, jumps with both feet, kicks a ball forward", "Walks up and down stairs one foot per step with a rail", "Turns pages, builds a tower of 6+ blocks, starts using a fork"],
  },
  "Cognitive development": {
    "0-2": ["Watches faces closely and follows things with the eyes for short spells", "Starts to get bored or fussy when activity doesn't change", "Recognises a caregiver at a distance"],
    "3-4": ["Reaches for a toy they want and mouths objects to explore them", "Shows curiosity about things; tries to get things out of reach", "Watches faces intently and follows moving objects across the midline"],
    "5-6": ["Explores by banging, shaking and mouthing", "Looks for a partly hidden object", "Shows interest in mirrors; notices cause and effect (I shake it, it rattles)"],
    "7-9": ["Looks for a fully hidden object (object permanence emerging)", "Bangs two things together; puts things in and out of containers", "Watches the path of something as it falls"],
    "10-12": ["Explores objects in different ways — shaking, throwing, dropping", "Finds hidden objects easily; copies gestures", "Starts to use objects correctly (drinks from a cup, brushes hair)"],
    "12-24": ["Follows one-step instructions; points to get your attention or name a thing", "Sorts shapes and colours; completes simple inset puzzles", "Pretend play begins — feeding a doll, 'talking' on a phone"],
    "24-36": ["Follows two-step instructions ('pick up the cup and put it on the table')", "Sorts by colour and shape; understands 'two' and counts a few objects", "Rich pretend play with a storyline; solves simple problems by trying things"],
  },
  "Language & communication": {
    "0-2": ["Makes cooing and gurgling sounds", "Quiets or smiles at a familiar voice", "Cries differently for different needs"],
    "3-4": ["Coos back in a 'conversation', turn-taking with sounds", "Turns head toward sounds and your voice", "Laughs and makes squealing sounds"],
    "5-6": ["Babbles strings of sounds ('bababa', 'mamama')", "Responds to their name", "Uses sounds and gestures to show likes and dislikes"],
    "7-9": ["Understands 'no'; copies sounds and gestures", "Uses fingers to point; waves bye-bye", "Babbles with the rhythm and tone of speech"],
    "10-12": ["Says 'mama' / 'dada' with meaning and maybe 1–3 other words", "Follows simple requests with a gesture ('give it to me')", "Tries to copy words you say"],
    "12-24": ["Vocabulary grows from a few words to 50+; starts joining two words ('more milk')", "Points to named body parts and pictures in a book", "Follows simple instructions without a gesture"],
    "24-36": ["Speaks in 2–3 word sentences, then longer; strangers understand about half to most of it", "Names most familiar things; asks 'what' and 'why'", "Follows two-step instructions and understands simple prepositions (in, on, under)"],
  },
  "Emotional development": {
    "0-2": ["Begins to self-soothe briefly (bringing hands to mouth)", "Calms when picked up, spoken to or held", "Shows a social smile by around 6–8 weeks"],
    "3-4": ["Smiles spontaneously, especially at people", "Enjoys playing with people and may cry when play stops", "More expressive with face and body"],
    "5-6": ["Knows familiar faces and may be wary of strangers", "Responds to others' emotions; often seems happy", "Likes to look at themselves in a mirror"],
    "7-9": ["Shows clear stranger wariness and may cling to familiar adults", "Has favourite toys and people", "Separation upset is common and normal"],
    "10-12": ["Cries when a parent leaves (separation anxiety peaks)", "Shows fear in some situations; hands you a book to read", "Repeats sounds or actions to get attention"],
    "12-24": ["Big feelings with little control — tantrums are normal and peak in the second year", "Shows a wide range of emotions and looks to you to check how to feel", "Growing independence ('me do it') alongside needing you close"],
    "24-36": ["Notices and is bothered by big changes in routine", "Starts to name feelings; can be helped to calm with support", "Shows defiance, pride and affection; still needs help regulating"],
  },
  "Social development": {
    "0-2": ["Makes eye contact and holds a gaze", "Prefers to look at faces", "Settles with a familiar caregiver's touch and voice"],
    "3-4": ["Smiles at people and enjoys face-to-face play", "Copies some movements and facial expressions", "Enjoys being talked and sung to"],
    "5-6": ["Enjoys playing with parents and simple back-and-forth games", "Responds to other people's emotions", "Likes social attention and reacts to it"],
    "7-9": ["Plays peekaboo and pat-a-cake", "Watches other children with interest", "Points to share interest ('look at that!')"],
    "10-12": ["Plays interactive games and hands you toys to play", "Extends an arm or leg to help with dressing", "Copies simple actions and sounds during play"],
    "12-24": ["Plays alongside other children (parallel play); copies adults and peers", "Shows affection to familiar people; may have tantrums when frustrated", "Enjoys handing things to others as play"],
    "24-36": ["Starts to take turns and play simple games with others", "Shows concern when a friend is upset; understands 'mine' and 'yours'", "Copies adults and friends; separates more easily from caregivers"],
  },
  "Creativity & play": {
    "0-2": ["Enjoys high-contrast patterns and faces", "Calms to music and gentle movement", "Explores with eyes and mouth"],
    "3-4": ["Bats at hanging toys; enjoys textures and sounds", "Shows delight at repeated songs and games", "Watches their own hands with interest"],
    "5-6": ["Explores toys by mouthing, shaking and banging", "Enjoys simple cause-and-effect toys", "Bounces and moves to music"],
    "7-9": ["Empties and fills containers over and over", "Enjoys knocking down towers you build", "Bangs and drops things to see what happens"],
    "10-12": ["Stacks and nests; puts objects into containers on purpose", "Enjoys simple pretend (offering you a bite of pretend food)", "Loves repeating an action that gets a reaction"],
    "12-24": ["Scribbles with crayons; enjoys messy play with safe materials", "Pretend play with dolls, cars and toy food", "Dances, claps and joins in with songs and actions"],
    "24-36": ["Draws circles and lines; builds with blocks and shapes", "Invents stories and roles in pretend play", "Makes music with shakers and drums; enjoys dress-up"],
  },
};

const ENCOURAGE: Record<string, string[]> = {
  "Physical development": [
    "Daily supervised tummy time while awake, building up as they get stronger",
    "Safe floor space to roll, reach, crawl and cruise — limit time in seats and containers",
    "Offer objects to reach for, then to stack, post and scribble with as hands develop",
    "Active outdoor play every day once they're on the move",
  ],
  "Cognitive development": [
    "Play hide-and-find games — cover a toy with a cloth and 'find' it together",
    "Narrate what you're doing and why as you go about the day",
    "Offer open-ended things (cups, boxes, blocks) that can be used many ways",
    "Give simple choices and one- then two-step instructions as they grow",
  ],
  "Language & communication": [
    "Talk, sing and read together every day — pause and leave space for their reply",
    "Copy the sounds they make and add one ('ba' → 'ball!')",
    "Expand what they say ('milk' → 'you want more milk')",
    "Name things you see, and label feelings out loud",
  ],
  "Emotional development": [
    "Respond warmly and consistently — you can't 'spoil' a baby with comfort",
    "Name feelings calmly and stay close during big ones",
    "Keep routines predictable so the world feels safe",
    "Let them try safe things themselves and coach rather than take over",
  ],
  "Social development": [
    "Play face-to-face, back-and-forth games (peekaboo, rolling a ball)",
    "Model turn-taking, sharing and gentle hands",
    "Arrange short, low-key time near other children",
    "Coach small squabbles instead of refereeing them",
  ],
  "Creativity & play": [
    "Provide simple, safe materials and follow your child's lead",
    "Join their pretend play without taking it over",
    "Sing, dance and make up little stories together",
    "Value the process, not a finished product",
  ],
};

const AVOID: Record<string, string[]> = {
  "Physical development": ["Long stretches in bouncers, walkers or seats", "Pushing physical milestones ahead of readiness"],
  "Cognitive development": ["Over-scheduling with little free play", "Screens as the main source of stimulation under age 2 (AAP/WHO guidance)"],
  "Language & communication": ["Correcting speech harshly — model the right form instead", "Background TV during play and meals — it reduces talk"],
  "Emotional development": ["Punishing feelings themselves ('stop crying')", "Expecting adult-level self-control from a toddler"],
  "Social development": ["Forcing sharing on demand for very young children", "Labelling a child 'shy' or 'difficult' within their hearing"],
  "Creativity & play": ["Focusing on the finished product over exploring", "Too many toys that do the playing for them"],
};

const RED_FLAGS: Record<Bucket, string[]> = {
  "0-2": ["Doesn't respond to loud sounds", "Doesn't watch things as they move", "Doesn't smile at people by 2 months", "Doesn't bring hands to mouth"],
  "3-4": ["Doesn't hold head steady", "Doesn't coo or make sounds", "Doesn't push down with legs when feet are on a firm surface", "Doesn't watch things as they move"],
  "5-6": ["Doesn't try to get things in reach", "Shows no affection for caregivers", "Doesn't respond to sounds around them", "Doesn't laugh or make squealing sounds; seems very stiff or very floppy"],
  "7-9": ["Doesn't bear weight on legs with support", "Doesn't sit with help", "Doesn't babble", "Doesn't play any games involving back-and-forth; doesn't respond to their name"],
  "10-12": ["Doesn't crawl or search for hidden things", "Doesn't say single words like 'mama' or 'dada'", "Doesn't learn gestures like waving", "Loses skills they once had"],
  "12-24": ["Doesn't walk by 18 months", "Doesn't say at least a few single words by 18 months / two-word phrases by 24 months", "Doesn't know what familiar things are for", "Doesn't copy others; loses skills they once had"],
  "24-36": ["Speech is very hard to understand", "Doesn't follow simple instructions", "Doesn't play pretend or with other children", "Falls a lot or has trouble with stairs; loses skills they once had"],
};

const PARENT_TOPICS: Record<"First year" | "Toddler", string[]> = {
  "First year": [
    "What your baby is learning right now",
    "Reading cues — hunger, tiredness, overstimulation",
    "Serve-and-return: how back-and-forth moments build the brain",
    "Bonding and responsive caregiving",
    "Safe sleep and gradually settling into rhythms",
    "Feeding milestones and starting solids (around 6 months)",
    "Tummy time and safe spaces to move",
    "Talking, singing and reading from day one",
    "Screen-time guidance for under-2s",
    "Looking after yourself so you can be present",
  ],
  Toddler: [
    "What your toddler is learning right now",
    "Communication techniques that reduce meltdowns",
    "Setting a few clear, consistent boundaries",
    "Building independence with 'help me do it myself'",
    "Encouraging curiosity and safe exploration",
    "Coaching big feelings and managing tantrums",
    "Supporting confidence without pressure",
    "Toddler-proofing and everyday safety",
    "Sleep, naps and bedtime routines",
    "Predictable daily rhythms",
    "Healthy screen habits for ages 2–3",
    "Starting toilet learning when your child shows readiness",
  ],
};

const HABITS: Record<"First year" | "Toddler", string[]> = {
  "First year": [
    "Predictable feed–play–sleep rhythms",
    "A short, calming bedtime routine",
    "Hand-washing modelled by caregivers",
    "Daily reading, singing and talking",
    "Gentle, consistent responses to distress",
  ],
  Toddler: [
    "Saying please and thank you (modelled, not forced)",
    "Helping to tidy toys away together",
    "Hand-washing and starting to brush teeth",
    "A consistent bedtime and morning routine",
    "Taking turns and gentle hands",
    "Helping with tiny chores ('put your cup in the sink')",
    "Sitting together for family meals",
    "Clear, kind limits on screen time",
  ],
};

function devSeed(s: ChildStageMeta): ContentSeed {
  const b = bucketFor(s);
  const blocks = CATEGORIES.flatMap((cat) => [
    heading(cat),
    para("What many parents notice around this stage:"),
    list(NOTICE[cat][b]),
    para("Ways to encourage it:"),
    list(ENCOURAGE[cat]),
    para("Best to limit or avoid:"),
    list(AVOID[cat]),
  ]);

  return {
    slug: `dev-${s.slug}`,
    title: `${s.title} — development`,
    contentType: "DEVELOPMENT",
    stage: "CHILD",
    category: "Development overview",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `${s.title}: what parents may notice across the six areas of development, everyday ways to encourage each, and the signs worth raising with your child's clinician.`,
    keyTakeaways: [
      "Children develop at different rates — these are ranges, not deadlines.",
      "Everyday play, talk and routine do more than any toy or class.",
      "Trust your instinct: if something feels different, ask your child's doctor.",
    ],
    blocks: [
      callout(
        "info",
        "This is a general map. Not matching every point at a given age is usually normal variation. What matters more is steady forward progress over time.",
      ),
      ...blocks,
      heading("Talk to your child's doctor if you notice"),
      list(RED_FLAGS[b]),
      callout(
        "caution",
        "Educational games and quizzes in NestWise are for fun and practice — they are never a developmental assessment. Only a qualified professional can assess development.",
      ),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

function parentSeed(s: ChildStageMeta): ContentSeed {
  const topics = PARENT_TOPICS[s.band];
  return {
    slug: `parent-${s.slug}`,
    title: `${s.title} — for parents`,
    contentType: "PARENT_LEARNING",
    stage: "CHILD",
    category: "Parent learning",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `For Parents at ${s.title}: communication, bonding, boundaries, independence, routines, sleep, safety and healthy screen habits.`,
    keyTakeaways: [
      "Warm, consistent responses build a secure, confident child.",
      "Connection first, then the limit — it works better than control.",
      "Match your expectations to your child's stage, not the calendar.",
    ],
    blocks: [
      para(`Focus areas for ${s.title.toLowerCase()}:`),
      list(topics),
      callout("tip", "Pick one focus for the week rather than working on everything at once."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

function disciplineSeed(s: ChildStageMeta): ContentSeed {
  return {
    slug: `discipline-${s.slug}`,
    title: `${s.title} — positive discipline & habits`,
    contentType: "DISCIPLINE",
    stage: "CHILD",
    category: "Discipline & habits",
    ageMinMonths: s.ageMinMonths,
    ageMaxMonths: s.ageMaxMonths,
    summary: `Gentle, age-appropriate habit building and positive discipline for ${s.title}.`,
    keyTakeaways: [
      "Under age 1, 'discipline' is mostly redirection and a safe environment.",
      "For toddlers: a few clear limits, lots of connection, and calm follow-through.",
      "No physical punishment or shaming — it harms the relationship and doesn't teach the skill.",
    ],
    blocks: [
      heading("Habits to build now"),
      list(HABITS[s.band]),
      heading("Positive discipline principles"),
      list([
        "Set expectations that match your child's stage",
        "Keep a small number of limits, consistent between caregivers",
        "Childproof so 'no' is rare and means something",
        "Notice and name the behaviour you want to see",
        "Stay calm; use natural and logical consequences",
        "Coach emotions: name the feeling, then the limit ('you're angry — hitting isn't okay')",
        "Repair and reconnect after conflict",
      ]),
      callout(
        "caution",
        "Avoid physical punishment and humiliation. They increase fear and aggression and don't teach the skill you want your child to learn.",
      ),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };
}

export function childDevelopmentSeeds(): ContentSeed[] {
  return CHILD_STAGES.flatMap((s) => [devSeed(s), parentSeed(s), disciplineSeed(s)]);
}
