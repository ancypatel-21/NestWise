/**
 * Shared safety copy and classifiers. PRD §11.2, §35 (do not gamify emergencies), §50–§51.
 *
 * IMPORTANT (PRD §51): the exact escalation logic and wording below is placeholder and must be
 * developed with qualified medical review and localised per country before any real launch.
 */

export const EMERGENCY_DISCLAIMER =
  "NestWise is not an emergency service. If you believe you or your baby may be in immediate danger, contact local emergency services or your healthcare provider.";

export const MEDICAL_SCOPE_NOTE =
  "NestWise provides educational information and decision support — not medical diagnosis or emergency care. For anything about your specific situation, talk with a qualified healthcare professional.";

export const AI_UNAVAILABLE_FALLBACK =
  "I can't reach the answer service right now. You can still browse the Learn, Nutrition, and Symptom sections, which don't need it.";

export const NO_CONTENT_FALLBACK =
  "I don't have reviewed NestWise content on that yet, so I'd rather not guess. A midwife, doctor, or your child's clinician is the right person to ask.";

/** Level 3 — potential emergency (PRD §51). Any hit routes to immediate-help wording. */
export const EMERGENCY_PATTERNS: RegExp[] = [
  /\b(heavy|severe|lots of|soaking|gushing) (bleed|bleeding|blood)\b/i,
  /\bcan('?t| ?not) breathe\b/i,
  /\b(trouble|difficulty) breathing\b/i,
  /\b(passed out|fainted|unconscious|unresponsive|loss of consciousness)\b/i,
  /\bseizure|convulsion|fitting\b/i,
  /\bchest pain\b/i,
  /\b(no|not|stopped|decreased|reduced|less|fewer|haven'?t felt|not felt|can'?t feel) .{0,20}(fetal |baby('?s)? )?(move|moving|movement|movements|kick|kicks|kicking)\b/i,
  /\bbaby (is )?(not|isn'?t|stopped) (moving|kicking)\b/i,
  /\bwaters? broke\b.*\b(green|brown|blood)\b/i,
  /\b(suicidal|suicide|kill myself|harm(ing)? (myself|the baby)|hurt(ing)? (myself|the baby)|end my life)\b/i,
  /\bblurred vision\b.*\b(headache|swelling)\b/i,
  /\bbaby (is )?(blue|not breathing|floppy|won'?t wake)\b/i,
  /\b(high fever|fever) (and|with) (stiff neck|rash|confusion)\b/i,
];

/** Level 2 — personal symptom / "should I worry" phrasing (PRD §51). */
export const PERSONAL_CONCERN_PATTERNS: RegExp[] = [
  /\bi('?m| am| have| feel| felt| keep|'ve been)\b/i,
  /\bmy (baby|belly|back|head|body|breast|discharge|bleeding|symptom)/i,
  /\bshould i (be )?(worried|worry|concerned|call|go to)\b/i,
  /\bis (this|it|that)\b.{0,40}\b(normal|okay|ok|dangerous|bad|serious|concerning|a problem)\b/i,
  /\bhow much .* is too much\b/i,
  /\b(pain|cramp|spotting|swelling|nausea|vomit|dizzy|headache) (all|since|for) \b/i,
];

export type CategoryKey =
  | "PREGNANCY"
  | "BIRTH"
  | "POSTPARTUM"
  | "BABY"
  | "PARENTING"
  | "GENERAL";

// Note: stems like "pregnan" / "dilat" / "contraction" use \w* so plural/inflected forms match
// (a trailing \b after a stem would fail on "pregnant").
export const CATEGORY_KEYWORDS: Record<Exclude<CategoryKey, "GENERAL">, RegExp> = {
  BIRTH: /\b(labor|labour|contraction\w*|birth|delivery|hospital bag|c-?section|cesarean|caesarean|epidural|dilat\w*|midwife|pushing stage|water(s)? broke)\b/i,
  POSTPARTUM: /\b(postpartum|post-partum|after (birth|delivery)|lochia|perineal|stitches|baby blues|milk (coming|came) in|fourth trimester)\b/i,
  BABY: /\b(newborn|infant|my baby|burp\w*|swaddl\w*|tummy time|diaper\w*|nappy|nappies|latch\w*|breastfeed\w*|feeding|sleep (schedule|regression)|milestone\w*|crawl\w*|teething)\b/i,
  PARENTING: /\b(toddler|preschool\w*|discipline|tantrum\w*|screen time|potty|homework|sibling\w*|routine\w*|boundar(y|ies)|chores)\b/i,
  PREGNANCY: /\b(pregnan\w*|trimester|week\s*\d+|\d+\s*weeks|fetus|fetal|foetus|foetal|prenatal|antenatal|morning sickness|kick\w*|ultrasound|due date|folic)\b/i,
};
