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
 * Pregnancy nutrition (PRD §13). Educational meal ideas by trimester plus a food-safety section.
 * Entries are FOOD content so the allergen filter (content-filter.ts) can hide anything that
 * names a declared allergy. No claims that foods "heal" conditions (PRD §23).
 */

interface MealInput {
  title: string;
  trimester: "All" | "1" | "2" | "3";
  meal: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Hydration";
  diet: string; // "Omnivore" | "Vegetarian" | "Vegan"
  focus: string;
  idea: string;
  swaps: string[];
}

const MEALS: MealInput[] = [
  { title: "Oats with fruit and nut butter", trimester: "All", meal: "Breakfast", diet: "Vegan", focus: "Fibre, iron, slow energy", idea: "Rolled oats cooked with fortified plant milk, topped with berries, banana and a spoon of nut or seed butter.", swaps: ["Use seed butter (sunflower/tahini) if nut-free", "Swap oats for quinoa flakes if gluten-free"] },
  { title: "Eggs on wholegrain toast with spinach", trimester: "All", meal: "Breakfast", diet: "Vegetarian", focus: "Protein, choline, folate", idea: "Two well-cooked eggs, wholegrain toast, sautéed spinach and tomato.", swaps: ["Use firm tofu scramble for vegan", "Gluten-free bread as needed"] },
  { title: "Lentil and vegetable soup", trimester: "All", meal: "Lunch", diet: "Vegan", focus: "Iron, fibre, protein", idea: "Red lentils simmered with carrot, celery, tomato and spinach; serve with wholegrain bread.", swaps: ["Any beans in place of lentils", "Add a squeeze of citrus to help iron absorption"] },
  { title: "Chicken and quinoa bowl", trimester: "All", meal: "Lunch", diet: "Omnivore", focus: "Protein, iron, zinc", idea: "Thoroughly cooked chicken, quinoa, roasted vegetables, chickpeas and a yoghurt-lemon dressing.", swaps: ["Chickpeas + extra seeds instead of chicken for vegetarian", "Rice instead of quinoa"] },
  { title: "Salmon, potatoes and greens", trimester: "2", meal: "Dinner", diet: "Omnivore", focus: "Omega-3, protein, iodine", idea: "Baked salmon (well cooked), new potatoes and steamed green beans.", swaps: ["Use trout or sardines", "Tofu with a little seaweed for a plant version"] },
  { title: "Tofu and vegetable stir-fry with rice", trimester: "All", meal: "Dinner", diet: "Vegan", focus: "Protein, iron, calcium", idea: "Firm tofu, mixed vegetables and ginger stir-fried, served over brown rice.", swaps: ["Tempeh or edamame instead of tofu", "Coconut aminos if soy-free"] },
  { title: "Bean chilli with wholegrain", trimester: "3", meal: "Dinner", diet: "Vegan", focus: "Iron, fibre, protein", idea: "Kidney and black beans, tomato, peppers and spices; serve with rice or a baked potato.", swaps: ["Lower-spice version if heartburn is an issue", "Add cheese/yoghurt if vegetarian"] },
  { title: "Yoghurt with fruit and seeds", trimester: "All", meal: "Snack", diet: "Vegetarian", focus: "Calcium, protein", idea: "Plain pasteurised yoghurt, chopped fruit and a spoon of mixed seeds.", swaps: ["Fortified soy yoghurt for vegan", "Nut-free: stick to seeds"] },
  { title: "Hummus with vegetable sticks and pitta", trimester: "All", meal: "Snack", diet: "Vegan", focus: "Fibre, iron, steady energy", idea: "Hummus with carrot, cucumber and pepper sticks and wholegrain pitta.", swaps: ["Bean dip instead of chickpea", "Rice cakes if gluten-free"] },
  { title: "Cheese, apple and oatcakes", trimester: "1", meal: "Snack", diet: "Vegetarian", focus: "Calcium, protein, easy on nausea", idea: "Hard or pasteurised cheese, sliced apple and plain oatcakes — bland and portable for queasy days.", swaps: ["Firm smoked tofu for vegan", "Seed crackers if gluten-free"] },
  { title: "Water, milk and simple drinks", trimester: "All", meal: "Hydration", diet: "Vegan", focus: "Hydration", idea: "Aim for regular water through the day; milk or fortified plant milk adds calcium. Limit caffeine (see food safety).", swaps: ["Add fruit slices for flavour", "Warm water with lemon"] },
  { title: "Iron-focused day builder", trimester: "All", meal: "Lunch", diet: "Omnivore", focus: "Iron", idea: "Pair iron-rich foods (beans, lentils, leafy greens, fortified cereal, lean red meat) with a vitamin-C food (peppers, citrus, tomato) at the same meal; keep tea/coffee away from meals.", swaps: ["All-plant iron day: lentils + spinach + fortified cereal + citrus"] },
];

interface SafetyTopic {
  title: string;
  points: string[];
}
const SAFETY_TOPICS: SafetyTopic[] = [
  { title: "Foods commonly advised against", points: ["Unpasteurised milk and soft mould-ripened or blue cheeses", "Raw or undercooked meat, poultry, fish and eggs (unless eggs carry a recognised safety mark)", "Pâté (including vegetable pâté in some guidance) and raw/cured meats depending on local advice", "Liver and high-dose vitamin-A supplements", "Some game meats and swordfish/shark/marlin"] },
  { title: "Foods needing careful preparation", points: ["Cook meat, poultry, fish and eggs thoroughly", "Wash fruit, vegetables and salads well", "Reheat leftovers and ready meals until piping hot", "Keep raw and ready-to-eat foods separate"] },
  { title: "Food hygiene", points: ["Wash hands before preparing and eating", "Clean surfaces and boards, especially after raw meat", "Check use-by dates", "Defrost in the fridge, not on the counter"] },
  { title: "Safe storage", points: ["Keep the fridge below 5°C / 41°F", "Eat cooked-then-chilled food within a day or two", "Cool leftovers quickly and refrigerate within about an hour or two", "Don't refreeze food that has thawed"] },
  { title: "Caffeine", points: ["Many guidelines suggest keeping caffeine to a moderate daily limit (often quoted as around 200 mg)", "Caffeine is in coffee, tea, cola, energy drinks and chocolate", "Check the guidance that applies where you live"] },
  { title: "Fish and mercury", points: ["Oily fish is beneficial but often limited to a couple of portions a week", "Limit tuna per local guidance", "Avoid shark, swordfish and marlin", "Follow local advice on shellfish — cook thoroughly"] },
  { title: "Pasteurisation", points: ["Pasteurisation heats milk to kill harmful bacteria", "Choose pasteurised milk, cheese and juice", "Hard cheeses are generally considered lower risk even when made from unpasteurised milk — check local advice"] },
];

export function nutritionSeeds(): ContentSeed[] {
  const meals: ContentSeed[] = MEALS.map((m) => ({
    slug: slugify(m.title),
    title: m.title,
    contentType: "FOOD" as const,
    stage: "PREGNANCY" as const,
    category: `${m.meal} · ${m.diet}`,
    summary: `${m.meal} idea (${m.diet}) focused on ${m.focus.toLowerCase()}.`,
    keyTakeaways: [`Focus: ${m.focus}`, `Suits: ${m.diet} eating`, `Best around trimester ${m.trimester}`],
    blocks: [
      heading("The idea"),
      para(m.idea),
      heading("Why it helps"),
      para(`This meal is built around ${m.focus.toLowerCase()}. It's an example, not a prescription — vary it to your taste and appetite.`),
      heading("Swaps and alternatives"),
      list(m.swaps),
      callout("info", "Foods that name an allergy you added in your profile are hidden from your nutrition lists automatically."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));

  const safety: ContentSeed = {
    slug: "food-safety",
    title: "Food safety in pregnancy",
    contentType: "LESSON",
    stage: "PREGNANCY",
    category: "Nutrition",
    summary: "An easy-to-scan guide to foods to be cautious with, safe preparation, hygiene, storage, caffeine, fish and pasteurisation.",
    keyTakeaways: [
      "Cook animal foods thoroughly and choose pasteurised dairy.",
      "Keep caffeine moderate and follow local fish guidance.",
      "Local guidance varies — check the advice for your country.",
    ],
    blocks: [
      para("General food-safety points below. Specific advice differs between countries; follow the guidance from your own health service and care provider."),
      ...SAFETY_TOPICS.flatMap((t) => [heading(t.title), list(t.points)]),
      callout("caution", "If you think you've eaten something risky and then feel unwell — fever, diarrhoea, vomiting, or reduced baby movements — contact your care provider."),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  };

  return [...meals, safety];
}
