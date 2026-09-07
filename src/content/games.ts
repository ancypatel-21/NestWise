import type { GameFormat } from "@prisma/client";
import type { GameConfig } from "@/lib/games/engine";
import { slugify } from "@/lib/utils";

/**
 * Child learning games for ages ~1–3. Data-driven: each game supplies an item pool and a format
 * that src/lib/games/engine.ts turns into rounds. Difficulty scales with the player's level, not
 * age alone. Every game names the skills it supports for the parent-facing panel. Play is for fun
 * and practice — no claim that a game improves intelligence or guarantees developmental outcomes.
 */
export interface GameSeed {
  slug: string;
  title: string;
  category: string;
  format: GameFormat;
  minAgeMonths: number;
  skillsSupported: string[];
  config: GameConfig;
}

const item = (label: string, emoji?: string, group?: string, value?: number) => ({
  label,
  emoji,
  group,
  value,
});

function game(
  title: string,
  category: string,
  format: GameFormat,
  minAgeYears: number,
  skillsSupported: string[],
  items: GameConfig["items"],
  instructions?: string,
): GameSeed {
  return {
    slug: slugify(title),
    title,
    category,
    format,
    minAgeMonths: Math.round(minAgeYears * 12),
    skillsSupported,
    config: { items, instructions },
  };
}

export const GAME_SEEDS: GameSeed[] = [
  game("Tap the colour", "Colours", "CHOOSE", 1.5, ["Visual recognition", "Colour words", "Fine motor tapping"], [
    item("red", "🟥"), item("blue", "🟦"), item("green", "🟩"), item("yellow", "🟨"),
    item("orange", "🟧"), item("purple", "🟪"), item("pink", "🌸"), item("brown", "🟫"),
  ]),
  game("Find the shape", "Shapes", "CHOOSE", 1.5, ["Shape recognition", "Vocabulary", "Attention"], [
    item("circle", "⚪"), item("square", "🟦"), item("triangle", "🔺"), item("star", "⭐"),
    item("heart", "❤️"), item("diamond", "🔷"),
  ]),
  game("Animal sounds", "Animals", "MATCH", 1.5, ["Listening", "Memory", "Animal words"], [
    item("dog", "🐶", "woof"), item("cat", "🐱", "meow"), item("cow", "🐮", "moo"),
    item("duck", "🦆", "quack"), item("sheep", "🐑", "baa"), item("lion", "🦁", "roar"),
    item("horse", "🐴", "neigh"), item("pig", "🐷", "oink"),
  ]),
  game("Farm, sky or sea?", "Animals", "ODD_ONE_OUT", 2.5, ["Categorising", "Reasoning", "Vocabulary"], [
    item("cow", "🐮", "farm"), item("pig", "🐷", "farm"), item("sheep", "🐑", "farm"), item("hen", "🐔", "farm"),
    item("bird", "🐦", "sky"), item("bee", "🐝", "sky"), item("butterfly", "🦋", "sky"), item("owl", "🦉", "sky"),
    item("fish", "🐟", "sea"), item("crab", "🦀", "sea"), item("whale", "🐳", "sea"), item("octopus", "🐙", "sea"),
  ]),
  game("Fruit basket", "Fruits", "CHOOSE", 1.5, ["Vocabulary", "Recognition", "Healthy-food words"], [
    item("apple", "🍎"), item("banana", "🍌"), item("grapes", "🍇"), item("orange", "🍊"),
    item("strawberry", "🍓"), item("watermelon", "🍉"), item("pear", "🍐"), item("cherry", "🍒"),
  ]),
  game("Veggie patch", "Vegetables", "CHOOSE", 2, ["Vocabulary", "Recognition", "Healthy-food words"], [
    item("carrot", "🥕"), item("broccoli", "🥦"), item("corn", "🌽"), item("tomato", "🍅"),
    item("potato", "🥔"), item("pepper", "🫑"), item("cucumber", "🥒"), item("pea", "🫛"),
  ]),
  game("Fruit or vegetable?", "Food", "ODD_ONE_OUT", 2.5, ["Sorting", "Reasoning", "Food words"], [
    item("apple", "🍎", "fruit"), item("banana", "🍌", "fruit"), item("grapes", "🍇", "fruit"), item("pear", "🍐", "fruit"),
    item("carrot", "🥕", "vegetable"), item("broccoli", "🥦", "vegetable"), item("corn", "🌽", "vegetable"), item("potato", "🥔", "vegetable"),
  ]),
  game("Count the objects", "Counting", "COUNT", 2, ["Early numbers", "One-to-one counting", "Attention"], [
    item("apples", "🍎", undefined, 2), item("stars", "⭐", undefined, 3), item("balls", "⚽", undefined, 4),
    item("cats", "🐱", undefined, 1), item("flowers", "🌼", undefined, 5), item("ducks", "🦆", undefined, 3),
  ]),
  game("Which number?", "Numbers", "CHOOSE", 2.5, ["Number recognition", "Counting", "Attention"], [
    item("1", "1️⃣"), item("2", "2️⃣"), item("3", "3️⃣"), item("4", "4️⃣"), item("5", "5️⃣"),
  ]),
  game("Letter hunt", "Letters", "CHOOSE", 2.5, ["Letter recognition", "Pre-reading", "Attention"], [
    item("A", "🅰️"), item("B", "🅱️"), item("C", "🇨"), item("D", "🇩"),
    item("E", "🇪"), item("O", "🅾️"), item("S", "🇸"), item("M", "Ⓜ️"),
  ]),
  game("Picture and word", "Vocabulary", "MATCH", 2, ["First reading", "Vocabulary", "Visual matching"], [
    item("house", "🏠", "house"), item("tree", "🌳", "tree"), item("car", "🚗", "car"),
    item("ball", "⚽", "ball"), item("cup", "🥤", "cup"), item("shoe", "👟", "shoe"),
  ]),
  game("Point to the body part", "Body parts", "CHOOSE", 1.5, ["Body awareness", "Vocabulary", "Listening"], [
    item("hand", "✋"), item("foot", "🦶"), item("eye", "👁️"), item("ear", "👂"),
    item("nose", "👃"), item("mouth", "👄"),
  ]),
  game("Name the feeling", "Emotions", "MCQ", 2.5, ["Naming feelings", "Empathy", "Vocabulary"], [
    item("happy", "😊", "The face when something lovely happens"),
    item("sad", "😢", "The face when we lose something we love"),
    item("angry", "😠", "The face when something feels unfair"),
    item("scared", "😨", "The face when something is a bit frightening"),
    item("surprised", "😲", "The face at a sudden, unexpected thing"),
    item("tired", "😴", "The face when we need a rest"),
  ]),
  game("Memory pairs", "Memory", "MEMORY", 2, ["Working memory", "Concentration", "Visual recognition"], [
    item("🐶", "🐶", "dog"), item("🍎", "🍎", "apple"), item("⭐", "⭐", "star"),
    item("🌸", "🌸", "flower"), item("🚗", "🚗", "car"), item("🐟", "🐟", "fish"),
  ]),
  game("What comes next?", "Patterns", "PATTERN", 2.5, ["Pattern spotting", "Predicting", "Reasoning"], [
    item("red", "🔴"), item("blue", "🔵"), item("green", "🟢"),
    item("yellow", "🟡"), item("purple", "🟣"), item("orange", "🟠"),
  ]),
  game("Big or small?", "Sorting", "ODD_ONE_OUT", 2, ["Comparing", "Size words", "Reasoning"], [
    item("elephant", "🐘", "big"), item("whale", "🐳", "big"), item("bus", "🚌", "big"), item("house", "🏠", "big"),
    item("ant", "🐜", "small"), item("mouse", "🐭", "small"), item("bee", "🐝", "small"), item("key", "🔑", "small"),
  ]),
  game("What's the weather?", "Weather", "MCQ", 2.5, ["Observing", "Weather words", "Reasoning"], [
    item("sunny", "☀️", "Bright sky, warm, no clouds"),
    item("rainy", "🌧️", "Water falling from grey clouds — umbrellas out!"),
    item("snowy", "❄️", "White flakes falling, very cold"),
    item("windy", "💨", "Trees swaying, hats blowing off"),
    item("cloudy", "☁️", "Grey sky, the sun is hiding"),
  ]),
  game("Where do they live?", "Nature", "MATCH", 2.5, ["First science", "Vocabulary", "Categorising"], [
    item("bird", "🐦", "nest"), item("bee", "🐝", "hive"), item("dog", "🐶", "kennel"),
    item("fish", "🐟", "pond"), item("bear", "🐻", "cave"), item("rabbit", "🐰", "burrow"),
  ]),
];
