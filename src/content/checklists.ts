import type { ChecklistKind } from "@prisma/client";

/**
 * Default checklist items (PRD §18 hospital bags, §44.2 birth preferences, §44.4 baby prep,
 * §44.1 appointment questions). Users check/uncheck and add custom items; a note always
 * encourages checking the hospital's own list.
 */
export interface ChecklistTemplate {
  kind: ChecklistKind;
  title: string;
  note: string;
  items: Array<{ label: string; category: string }>;
}

export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    kind: "MOTHER_BAG",
    title: "Mother's hospital bag",
    note: "Every hospital and birth centre is different — check their own list too.",
    items: [
      { label: "Photo ID and any hospital paperwork", category: "Documents" },
      { label: "Maternity notes / pregnancy records", category: "Documents" },
      { label: "Insurance or health-cover details (if relevant)", category: "Documents" },
      { label: "Birth preferences printout", category: "Documents" },
      { label: "Loose, comfortable clothes to labour in", category: "Clothing" },
      { label: "Dressing gown and non-slip socks or slippers", category: "Clothing" },
      { label: "Going-home outfit (loose, soft)", category: "Clothing" },
      { label: "Nursing or comfortable bras", category: "Clothing" },
      { label: "Maternity pads", category: "Toiletries" },
      { label: "Toothbrush, toothpaste, hairbrush, lip balm", category: "Toiletries" },
      { label: "Travel-size shampoo and shower gel", category: "Toiletries" },
      { label: "Hair ties", category: "Toiletries" },
      { label: "Phone and a long charging cable", category: "Phone/charger" },
      { label: "Snacks and a drink with a straw", category: "Comfort" },
      { label: "Pillow from home (bright pillowcase so it comes back)", category: "Comfort" },
      { label: "Eye mask and ear plugs", category: "Comfort" },
    ],
  },
  {
    kind: "BABY_BAG",
    title: "Baby's hospital bag",
    note: "Confirm what the hospital provides (nappies, blankets) so you only pack what you need.",
    items: [
      { label: "Bodysuits / vests (a few sizes)", category: "Clothing" },
      { label: "Sleepsuits / babygros", category: "Clothing" },
      { label: "A hat and scratch mitts", category: "Clothing" },
      { label: "Cardigan or jacket depending on season", category: "Clothing" },
      { label: "Newborn nappies (if not provided)", category: "Diapers" },
      { label: "Cotton wool or fragrance-free wipes", category: "Diapers" },
      { label: "Muslin squares", category: "Diapers" },
      { label: "Baby blanket", category: "Blanket" },
      { label: "Going-home outfit", category: "Going home" },
      { label: "Car seat fitted and practised (stays in the car)", category: "Transport" },
      { label: "Any feeding items your plan needs", category: "Feeding" },
    ],
  },
  {
    kind: "BABY_PREP",
    title: "Baby preparation checklist",
    note: "This is a readiness list, not a shopping contest — borrowed and second-hand is fine for most of it.",
    items: [
      { label: "Safe sleep space (crib/cot/Moses basket) with a firm flat mattress", category: "Sleeping area" },
      { label: "Fitted sheets for the mattress", category: "Sleeping area" },
      { label: "Room thermometer / plan to keep the room comfortable", category: "Sleeping area" },
      { label: "Newborn and 0–3m clothing basics", category: "Clothing" },
      { label: "Feeding plan and any equipment it needs", category: "Feeding" },
      { label: "Bottles and steriliser (if bottle or combination feeding)", category: "Feeding" },
      { label: "Nappies, wipes and a changing mat", category: "Diapering" },
      { label: "Nappy cream / barrier cream", category: "Diapering" },
      { label: "Correctly fitted car seat", category: "Transportation" },
      { label: "Pram or carrier suitable for a newborn", category: "Transportation" },
      { label: "Baby first-aid basics and thermometer", category: "Health/safety" },
      { label: "Emergency and healthcare numbers saved", category: "Health/safety" },
      { label: "Smoke alarms checked", category: "Home preparation" },
      { label: "Somewhere to bath baby and soft towels", category: "Home preparation" },
    ],
  },
  {
    kind: "BIRTH_PREFERENCES",
    title: "Birth preferences",
    note: "These are preferences and questions to discuss — not a guaranteed plan. Labour can take its own course.",
    items: [
      { label: "Who I want as my support person(s)", category: "Support person" },
      { label: "Environment: lighting, music, movement, quiet", category: "Environment" },
      { label: "Positions I'd like to try for labour and birth", category: "Environment" },
      { label: "Pain-management options I want to discuss", category: "Pain management" },
      { label: "My feelings about monitoring options", category: "Monitoring" },
      { label: "Preferences for the pushing stage", category: "Birth" },
      { label: "Delayed cord clamping — questions to ask", category: "After birth" },
      { label: "Skin-to-skin as soon as possible", category: "After birth" },
      { label: "Feeding intentions", category: "Feeding" },
      { label: "Vitamin K and newborn checks — my questions", category: "After birth" },
      { label: "If a caesarean becomes needed, what matters to me", category: "If plans change" },
      { label: "Photos / who is told / first hours preferences", category: "Preferences" },
    ],
  },
  {
    kind: "APPT_QUESTIONS",
    title: "Questions for my next appointment",
    note: "Bring these to your prenatal or pediatric appointment. NestWise helps you prepare the conversation — it doesn't replace your clinician.",
    items: [
      { label: "Anything new since last time I want to mention", category: "General" },
      { label: "A symptom I'd like to understand better", category: "General" },
      { label: "Results I'm waiting for or want explained", category: "Tests" },
      { label: "What to expect before the next visit", category: "General" },
      { label: "Who to contact, and how, if I'm worried between visits", category: "Safety" },
    ],
  },
];
