import { slugify } from "@/lib/utils";

/** Family games (PRD §35): bonding, little or no materials. Filter by age, players, indoor/
 * outdoor, time and materials. */
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
  ageMinYears: number,
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
    ageMinMonths: ageMinYears * 12,
    ageMaxMonths: 144,
    instructions,
    skillsPracticed,
  };
}

export const FAMILY_GAME_SEEDS: FamilyGameSeed[] = [
  g("Family trivia", "Take turns asking questions from categories everyone helped write.", 2, 8, true, true, 20, false, 5, ["Each player writes 3 questions on slips or says them aloud.", "Take turns drawing and answering.", "One point per correct answer; team up younger players with an adult."], ["General knowledge", "Memory", "Turn-taking"]),
  g("Guess the animal", "One person thinks of an animal; others ask yes/no questions.", 2, 8, true, true, 10, false, 3, ["Pick an animal secretly.", "Others ask up to 20 yes/no questions.", "Guess before the questions run out.", "Swap who chooses."], ["Deductive reasoning", "Question forming", "Vocabulary"]),
  g("Charades", "Act out a word or phrase without speaking while others guess.", 3, 10, true, false, 20, false, 4, ["Write simple prompts on slips (animals, actions, films).", "Draw one and act it out silently.", "The guesser who gets it acts next."], ["Non-verbal communication", "Creativity", "Reading body language"]),
  g("Story-building game", "Build one story together, a sentence at a time.", 2, 8, true, true, 15, false, 3, ["One person starts with a sentence.", "Each player adds one sentence in turn.", "Keep going to a satisfying ending."], ["Narrative skills", "Listening", "Imagination"]),
  g("Memory challenge (tray game)", "Look at a tray of objects, then recall what's missing.", 2, 6, true, false, 15, true, 4, ["Place 8–12 objects on a tray and study for 30 seconds.", "Cover the tray and remove one object.", "Uncover and see who spots what's gone.", "Add more objects to level up."], ["Working memory", "Attention to detail"]),
  g("Scavenger hunt", "Race or stroll to find items on a shared list.", 2, 10, true, true, 30, true, 3, ["Write a list of findable items suited to your space.", "Search individually or in pairs.", "Meet back to share finds and stories."], ["Observation", "Categorisation", "Physical activity"]),
  g("Draw and guess", "Draw a prompt while your team guesses against the clock.", 3, 10, true, false, 20, true, 5, ["Write prompts on slips.", "Draw for your team — no letters or numbers.", "Rotate the drawer each round."], ["Visual communication", "Teamwork", "Quick thinking"]),
  g("Would-you-rather for kids", "Offer two fun options and discuss why.", 2, 8, true, true, 10, false, 4, ["Take turns posing 'would you rather…' questions.", "Everyone answers and gives a reason.", "Keep options silly and kind."], ["Reasoning", "Expressing opinions", "Listening"]),
  g("Indoor treasure hunt", "Follow a trail of clues to a small surprise.", 1, 6, true, false, 25, true, 4, ["Write 4–6 clues, each pointing to the next spot.", "Hide clues around the home ending at a treat or activity.", "Send the hunters off with the first clue."], ["Reading", "Problem solving", "Persistence"]),
  g("Nature bingo", "Mark off natural things you spot on a walk.", 2, 8, true, true, 30, true, 3, ["Make bingo cards with pictures/words: bird, round stone, yellow flower, feather.", "Walk and mark items as you see them.", "First to a line — or just fill the card together."], ["Observation", "Vocabulary", "Outdoor time"]),
  g("The quiet game with a twist", "See who can stay calm and quiet longest — loser tells a joke.", 2, 8, true, true, 5, false, 4, ["Everyone goes quiet at once.", "Last to make a sound wins.", "Whoever breaks first tells a joke or does a silly dance."], ["Self-regulation", "Humour", "Patience"]),
];
