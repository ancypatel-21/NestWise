import { slugify } from "@/lib/utils";

/** Family games for babies and toddlers (up to age ~3): bonding, little or no materials.
 * Filter by age, players, indoor/outdoor, time and materials. */
export interface FamilyGameSeed {
  slug: string;
  title: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  indoor: boolean;
  outdoor: boolean;
  timeMin: number;
  needsMaterials: boolean;
  ageMinMonths: number;
  ageMaxMonths: number;
  instructions: string[];
  skillsPracticed: string[];
}

function g(
  title: string,
  description: string,
  minPlayers: number,
  maxPlayers: number,
  indoor: boolean,
  outdoor: boolean,
  timeMin: number,
  needsMaterials: boolean,
  ageMinMonths: number,
  instructions: string[],
  skillsPracticed: string[],
): FamilyGameSeed {
  return {
    slug: slugify(title),
    title,
    description,
    minPlayers,
    maxPlayers,
    indoor,
    outdoor,
    timeMin,
    needsMaterials,
    ageMinMonths,
    ageMaxMonths: 36,
    instructions,
    skillsPracticed,
  };
}

export const FAMILY_GAME_SEEDS: FamilyGameSeed[] = [
  g("Peekaboo", "The classic hide-and-reappear game — pure connection and delight.", 2, 4, true, true, 5, false, 3, [
    "Hide your face behind your hands or a light cloth.",
    "Pop back with a warm 'peekaboo!'.",
    "Let your baby pull the cloth away themselves.",
    "Vary the timing to build anticipation.",
  ], ["Object permanence", "Anticipation", "Social smiling"]),
  g("This little piggy", "A toe-and-finger rhyme that ends in a happy tickle.", 2, 3, true, true, 3, false, 2, [
    "Wiggle each toe or finger in turn as you say the rhyme.",
    "Slow down near the end to build the tickle anticipation.",
    "Pause and wait for your baby to ask for 'again'.",
  ], ["Body awareness", "Rhythm and rhyme", "Turn-taking"]),
  g("Roll the ball", "Sit facing each other and roll a soft ball back and forth.", 2, 4, true, true, 10, true, 6, [
    "Sit on the floor a short distance apart, legs in a V.",
    "Roll a soft ball to your child and cheer when they send it back.",
    "Name what you're doing: 'my turn… your turn'.",
    "Widen the gap as they get steadier.",
  ], ["Turn-taking", "Hand-eye coordination", "Gross motor"]),
  g("Copy me", "Take turns making a sound, face or simple action for others to copy.", 2, 5, true, true, 8, false, 12, [
    "Clap twice — wait for your child to clap back.",
    "Try a silly face, a stomp, a wave.",
    "Let your toddler be the leader too.",
  ], ["Imitation", "Attention", "Turn-taking"]),
  g("Where is it? (hide the toy)", "Hide a favourite toy under one of two cups and find it together.", 2, 3, true, false, 10, true, 9, [
    "Show the toy, then hide it under one cup while your child watches.",
    "Ask 'where did it go?' and let them lift the cup.",
    "Celebrate the find, then swap the cups slowly to make it trickier.",
  ], ["Memory", "Object permanence", "Problem solving"]),
  g("Animal parade", "March around the room being different animals.", 2, 6, true, true, 10, false, 18, [
    "Call an animal — everyone moves and sounds like it.",
    "Stomp like an elephant, hop like a bunny, waddle like a duck.",
    "Let your toddler choose the next animal.",
  ], ["Gross motor", "Imagination", "Animal words"]),
  g("Bubble chase", "Blow bubbles and pop, catch or chase them together.", 2, 6, false, true, 15, true, 12, [
    "Blow a stream of bubbles low and slow.",
    "Encourage pointing, reaching, popping and chasing.",
    "Name colours and sizes: 'a big one!'.",
  ], ["Visual tracking", "Gross motor", "Cause and effect"]),
  g("Sock basket sort", "Turn folding laundry into a matching game.", 2, 4, true, false, 15, true, 24, [
    "Tip clean socks into a pile.",
    "Find the matching pairs together, talking about colour and size.",
    "Let your toddler 'post' matched pairs into a basket.",
  ], ["Matching", "Categorising", "Helping at home"]),
  g("Freeze dance", "Dance to music, then freeze when it stops.", 2, 8, true, true, 10, true, 18, [
    "Play a song and dance together.",
    "Pause the music and everyone freezes.",
    "Start again — add moves like jump, spin, tiptoe.",
  ], ["Listening", "Self-control", "Gross motor"]),
  g("Story in a circle", "Build a tiny story together, one line each.", 2, 5, true, true, 10, false, 30, [
    "Start with 'Once upon a time there was a little…'.",
    "Each person adds one short line.",
    "Keep it silly and happy; draw a scene from it after if you like.",
  ], ["Early storytelling", "Listening", "Imagination"]),
  g("Nature basket walk", "Collect safe natural treasures on a short walk.", 2, 5, false, true, 25, true, 18, [
    "Take a small basket or bag.",
    "Look for a leaf, a smooth stone, a feather, something yellow.",
    "Sort and name the finds at home; wash hands after.",
  ], ["Observation", "Vocabulary", "Outdoor time"]),
  g("Tunnel and cushions", "Crawl through a soft homemade obstacle path.", 1, 3, true, false, 15, true, 8, [
    "Set up cushions to climb over and a blanket over two chairs to crawl under.",
    "Crawl alongside and call your baby through.",
    "Keep everything low, soft and collapsible.",
  ], ["Gross motor", "Spatial awareness", "Persistence"]),
];
