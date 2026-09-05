import type { GameFormat } from "@prisma/client";
import type { GameConfig } from "@/lib/games/engine";
import { slugify } from "@/lib/utils";

/**
 * Child learning games (PRD §31–§33). Data-driven: each game supplies an item pool and a format
 * that src/lib/games/engine.ts turns into rounds. Difficulty scales with the player's level, not
 * age alone (PRD §33). Every game names the skills it supports for the parent-facing panel
 * (PRD §32) and carries no claim about medically improving intelligence (PRD §32).
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
  game("Tap the colour", "Colors", "CHOOSE", 2, ["Visual recognition", "Colour vocabulary", "Fine motor interaction"], [
    item("red", "🟥"), item("blue", "🟦"), item("green", "🟩"), item("yellow", "🟨"),
    item("orange", "🟧"), item("purple", "🟪"), item("pink", "🌸"), item("brown", "🟫"),
  ]),
  game("Find the shape", "Shapes", "CHOOSE", 2, ["Shape recognition", "Vocabulary", "Attention"], [
    item("circle", "⚪"), item("square", "🟦"), item("triangle", "🔺"), item("star", "⭐"),
    item("heart", "❤️"), item("diamond", "🔷"),
  ]),
  game("Animal sounds match", "Animals", "MATCH", 2, ["Listening", "Memory", "Vocabulary"], [
    item("dog", "🐶", "woof"), item("cat", "🐱", "meow"), item("cow", "🐮", "moo"),
    item("duck", "🦆", "quack"), item("sheep", "🐑", "baa"), item("lion", "🦁", "roar"),
    item("horse", "🐴", "neigh"), item("pig", "🐷", "oink"),
  ]),
  game("Which bird is it?", "Birds", "MCQ", 4, ["General knowledge", "Vocabulary", "Reasoning"], [
    item("robin", "🐦", "Small bird with a red breast, common in gardens"),
    item("owl", "🦉", "Night bird with big eyes that hoots"),
    item("penguin", "🐧", "Black-and-white bird that swims and cannot fly"),
    item("parrot", "🦜", "Colourful bird that can copy sounds and words"),
    item("eagle", "🦅", "Large bird of prey with sharp eyes and talons"),
    item("flamingo", "🦩", "Tall pink bird that stands on one leg"),
  ]),
  game("Fruit basket", "Fruits", "CHOOSE", 2, ["Vocabulary", "Categorisation", "Visual recognition"], [
    item("apple", "🍎"), item("banana", "🍌"), item("grapes", "🍇"), item("orange", "🍊"),
    item("strawberry", "🍓"), item("watermelon", "🍉"), item("pear", "🍐"), item("cherry", "🍒"),
  ]),
  game("Veggie patch", "Vegetables", "CHOOSE", 3, ["Vocabulary", "Healthy-food awareness", "Recognition"], [
    item("carrot", "🥕"), item("broccoli", "🥦"), item("corn", "🌽"), item("tomato", "🍅"),
    item("potato", "🥔"), item("pepper", "🫑"), item("cucumber", "🥒"), item("onion", "🧅"),
  ]),
  game("Food groups sort", "Food", "ODD_ONE_OUT", 4, ["Categorisation", "Reasoning", "Healthy-eating awareness"], [
    item("apple", "🍎", "fruit"), item("banana", "🍌", "fruit"), item("grapes", "🍇", "fruit"),
    item("carrot", "🥕", "vegetable"), item("broccoli", "🥦", "vegetable"), item("corn", "🌽", "vegetable"),
    item("bread", "🍞", "grain"), item("rice", "🍚", "grain"), item("pasta", "🍝", "grain"),
    item("cheese", "🧀", "dairy"), item("milk", "🥛", "dairy"), item("yoghurt", "🥣", "dairy"),
  ]),
  game("Count the objects", "Counting", "COUNT", 3, ["Numeracy", "One-to-one correspondence", "Attention"], [
    item("apples", "🍎", undefined, 3), item("stars", "⭐", undefined, 5), item("balls", "⚽", undefined, 4),
    item("cats", "🐱", undefined, 2), item("flowers", "🌼", undefined, 6), item("cars", "🚗", undefined, 7),
  ]),
  game("Number order", "Numbers", "PATTERN", 4, ["Numeracy", "Pattern awareness", "Sequencing"], [
    item("1", "1️⃣"), item("2", "2️⃣"), item("3", "3️⃣"), item("4", "4️⃣"),
    item("5", "5️⃣"), item("6", "6️⃣"), item("7", "7️⃣"), item("8", "8️⃣"),
  ]),
  game("Letter hunt", "ABC / letters", "CHOOSE", 3, ["Letter recognition", "Pre-reading", "Attention"], [
    item("A", "🅰️"), item("B", "🅱️"), item("C", "🇨"), item("D", "🇩"),
    item("E", "🇪"), item("F", "🇫"), item("G", "🇬"), item("H", "🇭"),
  ]),
  game("Beginning sounds", "Phonics", "MCQ", 5, ["Phonological awareness", "Reading comprehension", "Vocabulary"], [
    item("sun", "☀️", "Which word starts with the /s/ sound?"),
    item("moon", "🌙", "Which word starts with the /m/ sound?"),
    item("ball", "⚽", "Which word starts with the /b/ sound?"),
    item("cat", "🐱", "Which word starts with the /k/ sound?"),
    item("dog", "🐶", "Which word starts with the /d/ sound?"),
    item("fish", "🐟", "Which word starts with the /f/ sound?"),
  ]),
  game("Picture to word", "Vocabulary", "MATCH", 4, ["Reading", "Vocabulary", "Visual matching"], [
    item("house", "🏠", "house"), item("tree", "🌳", "tree"), item("car", "🚗", "car"),
    item("book", "📖", "book"), item("shoe", "👟", "shoe"), item("clock", "🕐", "clock"),
  ]),
  game("Days of the week", "Days", "PATTERN", 5, ["Sequencing", "Memory", "Time concepts"], [
    item("Mon", "🌙"), item("Tue", "2️⃣"), item("Wed", "3️⃣"), item("Thu", "4️⃣"),
    item("Fri", "🎉"), item("Sat", "😴"), item("Sun", "☀️"),
  ]),
  game("Months in order", "Months", "PATTERN", 6, ["Sequencing", "Memory", "Calendar awareness"], [
    item("Jan", "❄️"), item("Feb", "💗"), item("Mar", "🌱"), item("Apr", "🌧️"),
    item("May", "🌷"), item("Jun", "☀️"), item("Jul", "🏖️"), item("Aug", "🌻"),
    item("Sep", "🍂"), item("Oct", "🎃"), item("Nov", "🌰"), item("Dec", "🎄"),
  ]),
  game("Season match", "Seasons", "MATCH", 4, ["Categorisation", "Observation", "Vocabulary"], [
    item("snowman", "⛄", "winter"), item("blossom", "🌸", "spring"),
    item("beach", "🏖️", "summer"), item("falling leaves", "🍂", "autumn"),
    item("mittens", "🧤", "winter"), item("sun hat", "👒", "summer"),
  ]),
  game("What's the weather?", "Weather", "MCQ", 4, ["Observation", "Vocabulary", "Reasoning"], [
    item("sunny", "☀️", "Bright sky, warm, no clouds"),
    item("rainy", "🌧️", "Water falling from grey clouds"),
    item("snowy", "❄️", "White flakes falling, very cold"),
    item("windy", "💨", "Trees swaying, hats blowing off"),
    item("cloudy", "☁️", "Grey sky, sun hidden, no rain"),
    item("stormy", "⛈️", "Thunder, lightning and heavy rain"),
  ]),
  game("Point to the body part", "Body parts", "CHOOSE", 2, ["Body awareness", "Vocabulary", "Listening"], [
    item("hand", "✋"), item("foot", "🦶"), item("eye", "👁️"), item("ear", "👂"),
    item("nose", "👃"), item("mouth", "👄"),
  ]),
  game("Name the feeling", "Emotions", "MCQ", 4, ["Emotional literacy", "Empathy", "Vocabulary"], [
    item("happy", "😊", "The face when something good happens"),
    item("sad", "😢", "The face when you lose something you love"),
    item("angry", "😠", "The face when something feels unfair"),
    item("scared", "😨", "The face when something is frightening"),
    item("surprised", "😲", "The face at a sudden unexpected thing"),
    item("tired", "😴", "The face when you need to rest"),
  ]),
  game("Memory pairs", "Memory", "MEMORY", 3, ["Working memory", "Concentration", "Visual recognition"], [
    item("🐶", "🐶", "dog"), item("🍎", "🍎", "apple"), item("⭐", "⭐", "star"),
    item("🌸", "🌸", "flower"), item("🚗", "🚗", "car"), item("🐟", "🐟", "fish"),
  ]),
  game("Complete the pattern", "Patterns", "PATTERN", 4, ["Pattern recognition", "Logical reasoning", "Prediction"], [
    item("circle", "🔵"), item("square", "🟠"), item("triangle", "🔺"), item("star", "⭐"),
  ]),
  game("Odd one out: logic", "Logic", "ODD_ONE_OUT", 6, ["Logical reasoning", "Categorisation", "Attention"], [
    item("car", "🚗", "vehicle"), item("bus", "🚌", "vehicle"), item("train", "🚆", "vehicle"), item("bike", "🚲", "vehicle"),
    item("apple", "🍎", "food"), item("bread", "🍞", "food"), item("cheese", "🧀", "food"), item("cake", "🍰", "food"),
    item("dog", "🐶", "animal"), item("cat", "🐱", "animal"), item("cow", "🐮", "animal"), item("duck", "🦆", "animal"),
  ]),
  game("General knowledge quiz", "General knowledge", "MCQ", 7, ["General knowledge", "Reading comprehension", "Reasoning"], [
    item("Sun", "☀️", "What do we call the star at the centre of our solar system?"),
    item("Water", "💧", "What is made of hydrogen and oxygen and covers most of Earth?"),
    item("Heart", "❤️", "Which organ pumps blood around the body?"),
    item("Triangle", "🔺", "Which shape has exactly three sides?"),
    item("Seven", "7️⃣", "How many days are there in a week?"),
    item("Butterfly", "🦋", "What does a caterpillar turn into?"),
  ]),
  game("Add it up", "Math", "MCQ", 6, ["Numeracy", "Mental arithmetic", "Problem solving"], [
    item("4", "➕", "2 + 2 = ?"), item("6", "➕", "3 + 3 = ?"), item("10", "➕", "5 + 5 = ?"),
    item("8", "➕", "4 + 4 = ?"), item("9", "➕", "6 + 3 = ?"), item("12", "➕", "7 + 5 = ?"),
  ]),
  game("Science trivia", "Science", "MCQ", 7, ["Science knowledge", "Reasoning", "Reading comprehension"], [
    item("Gas", "💨", "What state of matter is air?"),
    item("Roots", "🌱", "Which part of a plant takes in water from the soil?"),
    item("Gravity", "🍎", "What force pulls objects toward the Earth?"),
    item("Ice", "🧊", "What does water become when it freezes?"),
    item("Lungs", "🫁", "Which body part do you use to breathe?"),
    item("Moon", "🌕", "What do we call Earth's natural satellite?"),
  ]),
  game("Where in the world?", "Geography", "MCQ", 8, ["Geography knowledge", "Map awareness", "Reasoning"], [
    item("Continent", "🌍", "What do we call one of the seven big land masses like Africa or Asia?"),
    item("Ocean", "🌊", "What do we call a very large body of salt water?"),
    item("Island", "🏝️", "What do we call land with water all around it?"),
    item("Mountain", "⛰️", "What do we call very high, rocky land that rises above the rest?"),
    item("Desert", "🏜️", "What do we call a very dry place with little rain and lots of sand?"),
    item("River", "🏞️", "What do we call flowing fresh water that runs to the sea?"),
  ]),
  game("Space explorer", "Space", "MCQ", 7, ["Science knowledge", "Curiosity", "Reasoning"], [
    item("Earth", "🌍", "Which planet do we live on?"),
    item("Mars", "🔴", "Which planet is known as the Red Planet?"),
    item("Sun", "☀️", "Which star gives Earth light and heat?"),
    item("Moon", "🌕", "What orbits the Earth and changes shape through the month?"),
    item("Rocket", "🚀", "What do people ride to travel into space?"),
    item("Star", "⭐", "What do we call the tiny points of light in the night sky?"),
  ]),
  game("Nature match", "Nature", "MATCH", 4, ["Observation", "Vocabulary", "Categorisation"], [
    item("acorn", "🌰", "oak tree"), item("web", "🕸️", "spider"), item("honey", "🍯", "bee"),
    item("nest", "🪺", "bird"), item("shell", "🐚", "sea"), item("leaf", "🍃", "tree"),
  ]),
  game("Sports match", "Sports", "MATCH", 5, ["General knowledge", "Vocabulary", "Categorisation"], [
    item("football", "⚽", "goal"), item("basketball", "🏀", "hoop"), item("tennis", "🎾", "racket"),
    item("swimming", "🏊", "pool"), item("cycling", "🚴", "helmet"), item("cricket", "🏏", "bat"),
  ]),
  game("Instrument sounds", "Music", "MATCH", 4, ["Listening", "Vocabulary", "Memory"], [
    item("drum", "🥁", "boom"), item("guitar", "🎸", "strum"), item("piano", "🎹", "keys"),
    item("trumpet", "🎺", "parp"), item("violin", "🎻", "bow"), item("flute", "🪈", "toot"),
  ]),
  game("Colour mixing", "Art", "MCQ", 5, ["Art knowledge", "Reasoning", "Colour theory"], [
    item("green", "🟢", "Blue + yellow makes…"),
    item("orange", "🟠", "Red + yellow makes…"),
    item("purple", "🟣", "Red + blue makes…"),
    item("brown", "🟤", "Mixing many colours together often makes…"),
    item("pink", "🩷", "Red + white makes…"),
    item("grey", "⚫", "Black + white makes…"),
  ]),
  game("Read and answer", "Reading", "MCQ", 7, ["Reading comprehension", "Inference", "Vocabulary"], [
    item("A dog", "🐶", "\"Rex wagged his tail and barked at the door.\" What kind of animal is Rex?"),
    item("Morning", "🌅", "\"The sun rose and the birds began to sing.\" What time of day is it?"),
    item("Happy", "😊", "\"Mia grinned and jumped up and down.\" How does Mia feel?"),
    item("Rain", "🌧️", "\"They opened umbrellas and splashed in puddles.\" What is the weather?"),
    item("A garden", "🌷", "\"She planted seeds and watered the soil.\" Where is she?"),
    item("Tired", "😴", "\"He yawned and rubbed his eyes.\" How does he feel?"),
  ]),
  game("Solve the puzzle", "Problem solving", "MCQ", 8, ["Logical reasoning", "Critical thinking", "Numeracy"], [
    item("5", "🧩", "I add 2 to a number and get 7. What was the number?"),
    item("Triangle", "🧩", "I have 3 corners and 3 sides. What am I?"),
    item("Wednesday", "🧩", "Two days after Monday is…"),
    item("10", "🧩", "Half of 20 is…"),
    item("A", "🧩", "In the pattern A B A B A ?, what comes next?"),
    item("Circle", "🧩", "I have no corners and roll well. What shape am I?"),
  ]),
];
