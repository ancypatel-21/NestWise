import { slugify } from "@/lib/utils";

/**
 * Parent-led activities for ages 0–3 (PRD §30) and Weekend Activities (PRD §34).
 * Each shows recommended age, materials, instructions, parent participation, skill supported and
 * safety considerations. Seeded into the Activity table.
 */
export interface ActivitySeed {
  slug: string;
  title: string;
  category: string;
  ageMinMonths: number;
  ageMaxMonths: number;
  materials: string[];
  instructions: string[];
  skillsSupported: string[];
  safetyNotes: string[];
  parentParticipation: string;
  supervisionLevel: string;
  timeMin: number;
  weekend: boolean;
}

function a(
  title: string,
  category: string,
  ageMinMonths: number,
  ageMaxMonths: number,
  materials: string[],
  instructions: string[],
  skillsSupported: string[],
  safetyNotes: string[],
  parentParticipation: string,
  supervisionLevel: string,
  timeMin: number,
  weekend = false,
): ActivitySeed {
  return {
    slug: (weekend ? "weekend-" : "") + slugify(title),
    title,
    category,
    ageMinMonths,
    ageMaxMonths,
    materials,
    instructions,
    skillsSupported,
    safetyNotes,
    parentParticipation,
    supervisionLevel,
    timeMin,
    weekend,
  };
}

const PARENT_LED: ActivitySeed[] = [
  a("Tummy time play", "0–6 months", 0, 6, ["A firm blanket", "A small mirror or high-contrast toy"], ["Lay baby on their front on a firm surface while they're awake and alert.", "Get down to their level and talk or sing.", "Place a toy or mirror just in front to encourage lifting the head.", "Start with a minute or two and build up across the day."], ["Neck and upper-body strength", "Visual tracking", "Bonding"], ["Always awake and supervised", "Stop if baby is upset or very tired", "Never for sleep"], "Face-to-face the whole time", "Constant supervision", 5),
  a("Talking and narrating", "0–6 months", 0, 6, [], ["Describe what you're doing as you do it ('now we're filling the bath').", "Pause after speaking to leave room for a coo or gurgle.", "Copy the sounds baby makes back to them.", "Use a warm, sing-song voice."], ["Early language", "Turn-taking", "Attachment"], ["None — everyday activity"], "Fully interactive", "Normal care", 10),
  a("Singing and rhymes", "0–6 months", 0, 12, [], ["Choose two or three simple songs and repeat them daily.", "Add gentle actions or bounces on your knee.", "Watch for baby's cues and slow down or stop if overstimulated."], ["Rhythm and listening", "Language", "Emotional connection"], ["Support head during bounces", "Gentle movements only"], "Fully interactive", "Normal care", 10),
  a("Tracking objects", "0–6 months", 1, 6, ["A soft toy or scarf"], ["Hold an object about 30 cm from baby's face.", "Move it slowly side to side, then up and down.", "Let baby rest when they look away."], ["Visual tracking", "Attention"], ["Soft, lightweight objects only"], "Hands-on throughout", "Constant supervision", 5),
  a("Texture exploration basket", "0–6 months", 3, 12, ["Safe fabric scraps (silk, fleece, cotton)", "A shallow basket"], ["Offer one texture at a time for baby to touch and hold.", "Name the texture ('this one is soft and smooth').", "Remove anything small or fraying."], ["Sensory processing", "Fine motor", "Vocabulary"], ["No small parts or loose threads", "Supervise all mouthing"], "Sit with baby and guide", "Constant supervision", 10),
  a("Peekaboo", "6–12 months", 6, 12, ["A light cloth (optional)"], ["Hide your face behind your hands or a cloth.", "Reappear with a warm 'peekaboo!'.", "Let baby pull the cloth away themselves.", "Vary the timing to build anticipation."], ["Object permanence", "Social interaction", "Anticipation"], ["Keep cloth light and away from the face when hiding baby's view"], "Fully interactive", "Constant supervision", 5),
  a("Stacking and knocking down", "6–12 months", 8, 18, ["3–5 soft or lightweight blocks"], ["Stack two or three blocks and invite baby to knock them down.", "Cheer the crash, then rebuild.", "Later, hand baby blocks to stack themselves."], ["Cause and effect", "Fine motor", "Hand-eye coordination"], ["Large, light blocks with no small parts"], "Build together, take turns", "Active supervision", 10),
  a("Object permanence cup game", "6–12 months", 7, 15, ["2–3 cups", "A small safe toy"], ["Hide the toy under one cup while baby watches.", "Ask 'where did it go?' and let them find it.", "Progress to swapping the cups slowly."], ["Memory", "Problem solving", "Object permanence"], ["Toy must be too big to swallow"], "Guide and encourage", "Active supervision", 10),
  a("Crawling obstacle path", "6–12 months", 7, 14, ["Cushions", "Cardboard boxes", "A tunnel or blanket over chairs"], ["Set up a short, soft path of cushions and a tunnel.", "Crawl alongside and call baby through.", "Keep it low and collapsible."], ["Gross motor", "Spatial awareness", "Persistence"], ["Soft materials only", "Clear hard edges", "Stay within arm's reach"], "Crawl with them", "Constant supervision", 15),
  a("Sound imitation games", "6–12 months", 6, 18, [], ["Make an animal sound and wait.", "Reward any attempt to copy with delight.", "Take turns 'leading' the sound."], ["Speech sounds", "Listening", "Turn-taking"], ["None"], "Fully interactive", "Normal care", 10),
  a("Sorting by colour or size", "1–2 years", 12, 30, ["Two bowls", "Safe objects in two colours or sizes"], ["Show how one object goes in each bowl.", "Invite your toddler to continue.", "Name colours/sizes as you go; don't worry about mistakes."], ["Categorisation", "Fine motor", "Vocabulary"], ["Objects too large to swallow", "Supervise closely"], "Sit alongside and model", "Active supervision", 15),
  a("Block building", "1–2 years", 12, 36, ["6–10 blocks"], ["Build a small tower together.", "Count the blocks as you stack.", "Let them design their own structures."], ["Fine motor", "Early counting", "Planning"], ["No small parts for under-3s"], "Build together", "Active supervision", 15),
  a("Simple inset puzzles", "1–2 years", 14, 36, ["A wooden inset puzzle with knobs"], ["Start with two or three pieces out.", "Name each shape or picture as it goes in.", "Offer help only when they ask."], ["Problem solving", "Fine motor", "Shape recognition"], ["Check pieces are large and intact"], "Encourage, minimal help", "Active supervision", 15),
  a("Naming objects hunt", "1–2 years", 12, 36, ["Everyday household items"], ["Ask 'can you find the spoon?' and search together.", "Celebrate finds and name each item.", "Add a describing word ('the cold spoon')."], ["Vocabulary", "Listening", "Gross motor"], ["Remove hazards from the search area first"], "Search together", "Active supervision", 15),
  a("Movement and freeze game", "1–2 years", 14, 48, ["Music (optional)"], ["Dance or march together, then call 'freeze!'.", "Hold still, then start again.", "Add actions: jump, stomp, tiptoe."], ["Gross motor", "Listening", "Self-control"], ["Clear space of trip hazards and hard corners"], "Play alongside", "Active supervision", 10),
  a("Colour treasure walk", "2–3 years", 24, 48, ["A basket"], ["Choose a colour of the day.", "Walk around the home or garden collecting that colour.", "Sort and talk about the finds afterward."], ["Colour recognition", "Categorisation", "Language"], ["Supervise outdoors", "Check items are safe to handle"], "Walk and talk together", "Active supervision", 20),
  a("Shape stamping with sponges", "2–3 years", 24, 48, ["Sponges cut into shapes", "Washable paint", "Paper"], ["Dip a shape sponge in paint and press onto paper.", "Name the shape and count the sides.", "Make patterns: circle, square, circle, square."], ["Shape recognition", "Fine motor", "Pattern awareness"], ["Non-toxic washable paint", "Supervise to prevent mouthing"], "Stamp alongside them", "Active supervision", 20),
  a("Pretend kitchen play", "2–3 years", 24, 60, ["Toy or real safe kitchen items", "Empty containers"], ["Take on roles: cook and customer.", "Follow your child's story and add gentle ideas.", "Use lots of describing words."], ["Imaginative play", "Language", "Social skills"], ["No sharp or breakable items"], "Play a role, follow their lead", "Active supervision", 20),
  a("Counting steps and objects", "2–3 years", 24, 60, [], ["Count stairs as you climb them.", "Count spoons as you set the table.", "Let them 'help' count, even out of order at first."], ["Early numeracy", "One-to-one correspondence", "Routine participation"], ["Hold hands on stairs"], "Count together", "Active supervision", 10),
  a("Simple collage craft", "2–3 years", 24, 60, ["Paper", "Glue stick", "Torn coloured paper, leaves, fabric"], ["Spread glue on the base paper.", "Stick on pieces however they like.", "Talk about colours and textures; focus on the process."], ["Fine motor", "Creativity", "Vocabulary"], ["Glue stick, not liquid glue with small parts", "Supervise natural materials"], "Create your own alongside", "Active supervision", 20),
  a("Matching pairs with socks", "2–3 years", 24, 60, ["A basket of clean socks"], ["Lay out socks and find the matching pairs together.", "Talk about colour, size and pattern.", "Make it a race against the laundry pile."], ["Visual matching", "Categorisation", "Helping at home"], ["None"], "Match alongside them", "Normal care", 15),
];

const WEEKEND: ActivitySeed[] = [
  a("Homemade play dough", "Art & craft", 30, 144, ["Flour", "Salt", "Water", "Oil", "Food colouring"], ["Mix two parts flour, one part salt, one part water and a spoon of oil.", "Knead until smooth; add colour.", "Make shapes, letters or pretend food together.", "Store in an airtight container."], ["Fine motor", "Creativity", "Following steps"], ["Not for children who still mouth objects", "Supervise; wash hands after"], "Make and play together", "Active supervision", 40, true),
  a("Baking soda and vinegar volcano", "Science experiment", 48, 144, ["Baking soda", "Vinegar", "Dish soap", "Food colouring", "A small bottle or cup"], ["Put a few spoons of baking soda in the bottle.", "Add a squirt of soap and some colouring.", "Pour in vinegar and watch the fizzing 'eruption'.", "Talk about the gas that's produced."], ["Observation", "Cause and effect", "Vocabulary of science"], ["Do it on a tray outdoors or over a sink", "Keep vinegar away from eyes"], "Set up and narrate", "Active supervision", 25, true),
  a("Neighbourhood nature scavenger hunt", "Nature exploration", 36, 144, ["A printed or drawn list", "A bag or egg carton"], ["Make a list: something smooth, something yellow, a seed, a feather.", "Walk and collect or photograph each item.", "Sort and talk about the finds at home."], ["Observation", "Categorisation", "Physical activity"], ["Road safety", "Wash hands after", "Don't pick protected plants or touch wildlife"], "Walk together, discuss finds", "Active supervision", 45, true),
  a("Family cook-along: simple pizza", "Cooking with parents", 48, 144, ["Wraps or dough bases", "Tomato sauce", "Cheese", "Toppings"], ["Everyone builds their own base.", "Children spread sauce and add toppings.", "An adult handles the oven.", "Eat together and rate each creation."], ["Sequencing", "Fine motor", "Trying new foods"], ["Adult does all oven and knife work", "Check for allergens"], "Cook as a team", "Active supervision", 40, true),
  a("Cardboard box building challenge", "Building challenge", 36, 144, ["Cardboard boxes", "Tape", "Child-safe scissors", "Markers"], ["Pick something to build: a car, a house, a robot.", "Plan it, then build and decorate.", "Play with the finished creation."], ["Planning", "Spatial reasoning", "Creativity"], ["Adult handles any sharp cutting", "Clear floor space"], "Design and build together", "Active supervision", 60, true),
  a("Backyard or park obstacle course", "Outdoor activity", 36, 144, ["Cushions, ropes, cones, chairs"], ["Set up stations: crawl under, jump over, balance along, run around.", "Time each other for fun, not competition.", "Rebuild it a new way."], ["Gross motor", "Balance", "Turn-taking"], ["Check the ground and equipment", "Match difficulty to the youngest child"], "Run it with them", "Active supervision", 45, true),
  a("Family storytelling circle", "Family storytelling", 36, 144, [], ["One person starts a story with a sentence.", "Each person adds a sentence in turn.", "Keep going until it reaches a silly or happy ending.", "Optionally draw a scene from it."], ["Narrative skills", "Listening", "Imagination"], ["None"], "Everyone takes part", "Normal care", 20, true),
  a("Kitchen-band music session", "Music", 24, 144, ["Pots, wooden spoons, rice in a jar, elastic bands on a box"], ["Make shakers and drums from safe kitchen items.", "Keep a beat together, then take solos.", "Play fast, slow, loud and soft."], ["Rhythm", "Listening", "Creativity"], ["Supervise use of kitchen items", "Hearing-friendly volume"], "Play in the band", "Active supervision", 20, true),
  a("Simple reading challenge", "Reading challenge", 48, 144, ["A stack of books", "A sticker chart (optional)"], ["Set a weekend goal (e.g. read three books together).", "Take turns reading pages or describing pictures.", "Talk about the story afterwards."], ["Reading comprehension", "Vocabulary", "Focus"], ["None"], "Read together", "Normal care", 30, true),
  a("Balcony or windowsill gardening", "Gardening", 36, 144, ["Pots", "Soil", "Fast-growing seeds (cress, beans)", "Watering can"], ["Fill pots, plant seeds at the right depth, water gently.", "Put them somewhere sunny.", "Check and water daily; record growth with drawings."], ["Responsibility", "Observation", "Patience"], ["Wash hands after handling soil", "Keep non-food seeds away from mouths"], "Plant and tend together", "Active supervision", 30, true),
  a("Photo story walk", "Photography", 60, 144, ["A phone or child camera"], ["Pick a theme: 'small things', 'doors', 'shadows'.", "Walk and let the child take the photos.", "Choose favourites and put them in order to tell a story."], ["Composition", "Observation", "Sequencing"], ["Road safety", "Agree what's okay to photograph"], "Walk together, discuss shots", "Active supervision", 40, true),
  a("Indoor mini sports tournament", "Sports", 48, 144, ["Soft ball", "Tape or cushions for goals/targets"], ["Set up two or three soft games: target throw, balloon keep-up, sock-ball goal.", "Everyone rotates through the stations.", "Keep score lightly or not at all."], ["Coordination", "Teamwork", "Good sporting behaviour"], ["Soft equipment only", "Clear breakables"], "Play and referee together", "Active supervision", 40, true),
];

export const ACTIVITY_SEEDS: ActivitySeed[] = [...PARENT_LED, ...WEEKEND];
