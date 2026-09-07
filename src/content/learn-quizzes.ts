import type { QuizQuestion } from "@/types";
import { LEARN_MODULES } from "./learn-modules";

/**
 * One quiz per Learn module — 6–7 multiple-choice questions each, with an instant explanation.
 * Slug is `learn-<moduleSlug>` and category is the exact module title so lesson pages can link
 * straight to the right quiz. Nothing here gamifies symptoms or emergencies.
 */
export interface LearnQuizSeed {
  slug: string;
  title: string;
  category: string;
  questions: QuizQuestion[];
}

const q = (
  prompt: string,
  choices: string[],
  answerIndex: number,
  explanation: string,
): QuizQuestion => ({ prompt, choices, answerIndex, explanation });

const BY_MODULE: Record<string, QuizQuestion[]> = {
  "Understanding Pregnancy": [
    q("Pregnancy weeks are counted from…", ["Conception", "The first day of your last period", "The first missed period", "Implantation"], 1, "Gestational age is dated from the last menstrual period (LMP), a shared reference everyone can measure from."),
    q("A full-term pregnancy is about…", ["36 weeks", "40 weeks", "44 weeks", "38 weeks exactly"], 1, "About 40 weeks (roughly 280 days) from LMP; 'term' spans 37–42 weeks."),
    q("Roughly how many months is 20 weeks?", ["3 months", "About 4.5 months", "6 months", "5.5 months"], 1, "Months are approximate (~4.3 weeks each); 20 weeks is about four and a half months."),
    q("The most accurate way to date a pregnancy is…", ["Counting from your last period only", "An early ultrasound", "The first positive test", "When you first feel movement"], 1, "An early dating scan (before ~14 weeks) is the most accurate method."),
    q("About how often do babies arrive on their exact due date?", ["Half the time", "About 1 in 5", "About 1 in 20", "Almost always"], 2, "Only around 1 in 20; most first babies arrive after the due date."),
    q("'Full term' covers which range?", ["39–40 weeks only", "37–42 weeks", "40–44 weeks", "36–40 weeks"], 1, "Babies are considered term anywhere from 37 to 42 weeks."),
    q("Which trimester is weeks 14–27?", ["First", "Second", "Third", "It varies"], 1, "Second trimester runs from week 14 to week 27."),
  ],
  "Baby Development": [
    q("The neural tube (future brain and spinal cord) forms…", ["In the third trimester", "In the first few weeks", "Around 20 weeks", "Just before birth"], 1, "It forms and closes in the first weeks — which is why folic acid matters early."),
    q("The baby's heartbeat typically begins around…", ["Weeks 5–6", "Weeks 12–14", "Weeks 20–22", "Weeks 28–30"], 0, "The heart starts to beat and pump blood in a simple loop around weeks 5–6."),
    q("Most people feel first movements between…", ["8–10 weeks", "16–22 weeks", "28–30 weeks", "34–36 weeks"], 1, "First movements ('quickening') are usually felt at 16–22 weeks, often later with a first baby."),
    q("The detailed anatomy scan is usually around…", ["8 weeks", "12 weeks", "20 weeks", "32 weeks"], 2, "The mid-pregnancy anatomy scan is typically 18–22 weeks."),
    q("In the third trimester the baby is mainly…", ["Forming organs", "Gaining weight and maturing lungs and brain", "Developing limb buds", "Closing the neural tube"], 1, "Most organ formation is earlier; the third trimester is growth and maturation."),
    q("A clear decrease in your baby's movements should be…", ["Watched for a few days", "Reported to your maternity unit the same day", "Ignored if you've eaten recently", "Only checked at your next appointment"], 1, "Reduced or changed movements always warrant a same-day call — never wait."),
    q("Most babies settle head-down by about…", ["24 weeks", "30 weeks", "36 weeks", "40 weeks"], 2, "Most are head-down by around 36 weeks; position is checked near term."),
  ],
  "Mother's Body": [
    q("Most early-pregnancy symptoms are driven by…", ["Diet", "Rising hormones", "Exercise", "Sleep position"], 1, "Progesterone and hCG drive nausea, tiredness and breast tenderness."),
    q("First-trimester nausea usually eases by around…", ["6 weeks", "12–16 weeks", "24 weeks", "It never eases"], 1, "It commonly settles by 12–16 weeks, though not for everyone."),
    q("Round-ligament pain feels like…", ["A constant dull ache all day", "Brief sharp pulls low down, often with movement", "Burning when you urinate", "Rhythmic tightening"], 1, "Short, sharp pulls in the lower abdomen or groin as the ligaments stretch."),
    q("From about 28 weeks it's advised to go to sleep…", ["On your back", "On your front", "On your side, either side", "Sitting upright"], 2, "Side-sleeping optimises blood flow to the baby in late pregnancy."),
    q("Which combination is an urgent, same-day concern?", ["Mild ankle swelling that settles overnight", "Occasional heartburn", "A bad headache with vision changes and sudden swelling", "Braxton Hicks tightenings"], 2, "That combination can signal pre-eclampsia and needs prompt review."),
    q("Shortness of breath in late pregnancy often eases when…", ["You lie flat", "The baby drops lower before birth", "You stop exercising", "You eat more"], 1, "It commonly improves once the baby engages lower in the pelvis."),
    q("Mild dizziness on standing quickly in mid-pregnancy is…", ["Always dangerous", "Common as blood pressure dips — stand up slowly", "A sign of anaemia only", "A reason to stop all activity"], 1, "Common in mid-pregnancy; rise slowly and sit down at the first warning."),
  ],
  "Prenatal Appointments": [
    q("Antenatal visits typically become…", ["Less frequent toward the end", "More frequent toward the end", "The same spacing throughout", "Only in the third trimester"], 1, "They start spaced out and get closer together as you approach term."),
    q("Most routine visits check all of these EXCEPT…", ["Blood pressure", "Urine for protein", "Bump measurement and heartbeat", "A full ultrasound every time"], 3, "Routine ultrasounds are usually just the dating and anatomy scans unless there's a reason for more."),
    q("Glucose screening for gestational diabetes is usually at…", ["8–12 weeks", "16–18 weeks", "24–28 weeks", "36–38 weeks"], 2, "The glucose test is typically done at 24–28 weeks."),
    q("A good habit for every appointment is to…", ["Arrive with no questions to save time", "Bring your notes and a written list of questions", "Only speak if asked", "Skip it if you feel well"], 1, "Preparation means you leave with answers instead of forgotten questions."),
    q("Something you should always clarify is…", ["The clinic's opening hours", "Who to contact, and how, if you're worried between visits", "The car park cost", "The receptionist's name"], 1, "Knowing the route to help between appointments is essential."),
    q("The booking (first) visit usually includes…", ["Only a quick chat", "History, bloods, blood pressure, urine and arranging the dating scan", "An epidural discussion", "A birth rehearsal"], 1, "It's a thorough first assessment plus arranging early screening."),
  ],
  "Prenatal Tests": [
    q("A screening test tells you…", ["A definite yes or no", "The chance that a condition is present", "Your baby's exact weight", "The date of birth"], 1, "Screening estimates probability; it is not a diagnosis."),
    q("A diagnostic test (like amniocentesis) differs because it…", ["Is always required", "Gives a definite answer but carries a small risk", "Is done by blood test only", "Can't detect chromosomal conditions"], 1, "Diagnostic tests confirm, but carry a small miscarriage risk (~0.1–0.3%)."),
    q("NIPT is best described as…", ["A diagnostic test", "A highly sensitive screening blood test", "An ultrasound", "A test only done after 20 weeks"], 1, "NIPT analyses fetal DNA from a blood sample from ~10 weeks — a screen, not a diagnosis."),
    q("Prenatal screening and diagnostic tests are…", ["Compulsory", "Optional — a personal choice", "Only for people over 35", "Done automatically without consent"], 1, "They are all optional; you can accept some and decline others."),
    q("A 'higher chance' screening result means…", ["Your baby definitely has the condition", "Further diagnostic testing is offered", "Nothing at all", "The pregnancy must end"], 1, "It means more testing is offered — it is not a diagnosis."),
    q("A useful question before any test is…", ["What does the waiting room look like?", "What would I do with the result?", "How long is the drive?", "Who else is being tested today?"], 1, "Deciding based on what you'd do with the information keeps the choice grounded."),
  ],
  Nutrition: [
    q("In pregnancy you need to 'eat for two'.", ["True — double your intake", "False — energy needs rise only modestly, mainly later", "True in the first trimester only", "Only if you're very active"], 1, "Extra energy is roughly a substantial snack a day in the 2nd/3rd trimesters."),
    q("Folic acid is most important…", ["In the third trimester", "Before conception and through week 12", "Only after 20 weeks", "During labour"], 1, "It supports neural tube development, which happens in the first weeks."),
    q("To absorb plant (non-haem) iron better, pair it with…", ["Tea", "A vitamin-C food", "Coffee", "Dairy"], 1, "Vitamin C boosts absorption; tea and coffee at meals reduce it."),
    q("Which is widely advised as a daily supplement in pregnancy?", ["Vitamin A", "Vitamin D", "Iron for everyone regardless of levels", "Vitamin E"], 1, "A daily vitamin D supplement is widely advised; iron only if you're low."),
    q("Which should be avoided because it's very high in vitamin A?", ["Carrots", "Liver", "Spinach", "Sweet potato"], 1, "Liver and high-dose vitamin A supplements are avoided in pregnancy."),
    q("While nausea is bad, the best approach is…", ["Force three balanced meals", "Eat whatever stays down, small and often", "Skip meals until it passes", "Only drink water"], 1, "'Anything that stays down' beats 'perfectly balanced' until nausea eases."),
    q("Oily fish in pregnancy is…", ["Completely banned", "Beneficial but limited (about 1–2 portions a week)", "Unlimited", "Only tinned tuna"], 1, "Oily fish provides omega-3; intake is limited due to pollutants, and some fish (shark, swordfish, marlin) are avoided."),
  ],
  Sleep: [
    q("In early pregnancy, the best sleep position is…", ["Strictly on your left", "Whatever is comfortable", "On your back only", "Sitting up"], 1, "Position only matters from the third trimester; before that, sleep as you like."),
    q("From about 28 weeks, settle to sleep…", ["On your back", "On your side, either side", "On your front", "Half-sitting"], 1, "Side-sleeping avoids the uterus pressing on a major vein."),
    q("If you wake up on your back in late pregnancy…", ["It's an emergency", "Just roll back onto your side", "Stay put until morning", "Call your midwife"], 1, "Brief periods on your back aren't a problem — just turn back over."),
    q("A pillow between the knees helps by…", ["Cooling you down", "Taking strain off the hips and lower back", "Preventing snoring", "Raising blood pressure"], 1, "It keeps the pelvis aligned and eases hip and back strain."),
    q("For heartburn and breathlessness at night, it helps to…", ["Lie completely flat", "Prop the upper body up a little", "Sleep on your front", "Eat a large meal first"], 1, "A slight incline reduces reflux and eases breathing."),
    q("Restless legs at night are worth mentioning to your provider because…", ["They mean labour is near", "Low iron can be a factor", "They're always harmless", "They indicate high blood pressure"], 1, "Iron levels can contribute, so it's worth checking."),
  ],
  "Mental & Emotional Wellbeing": [
    q("Depression or anxiety during pregnancy affects roughly…", ["1 in 1000", "1 in 10", "1 in 2", "Almost no one"], 1, "About 1 in 10 people — it's common and treatable, not a weakness."),
    q("The signal to reach out for help is low or anxious mood…", ["For one bad day", "Most days for about two weeks", "Only if you can't get out of bed", "Only after the birth"], 1, "Two weeks of most-days low mood or anxiety is the threshold to ask for help."),
    q("Which is an effective help for antenatal depression/anxiety?", ["Just waiting it out", "Talking therapies, support, and sometimes pregnancy-compatible medication", "Cutting out all carbohydrates", "Avoiding all appointments"], 1, "Effective, evidence-based options exist and work."),
    q("A simple daily practice that lowers stress is…", ["Late-night worst-case research", "Slow breathing with a longer out-breath", "Skipping meals", "More screen time before bed"], 1, "Longer out-breaths calm the nervous system within minutes."),
    q("Intrusive frightening thoughts or panic attacks are…", ["Always normal, ignore them", "Worth raising with a professional", "A sign you'll be a bad parent", "Only a problem after birth"], 1, "They're worth professional support — early help is easier and effective."),
    q("Any thought of harming yourself means…", ["Wait and see", "Seek help immediately — provider or emergency services", "Only tell a friend", "It will pass on its own"], 1, "This is an emergency; reach out for help right away."),
  ],
  "Exercise & Movement": [
    q("For a low-risk pregnancy, activity guidelines suggest about…", ["30 minutes a week", "150 minutes of moderate activity a week", "No exercise at all", "Only walking, nothing else"], 1, "Around 150 minutes of moderate activity a week, spread out."),
    q("'Moderate' intensity means you can…", ["Sing comfortably", "Talk but not sing", "Not talk at all", "Only whisper"], 1, "The talk test: able to talk but not sing."),
    q("From the second trimester it's best to avoid…", ["All walking", "Long periods lying flat on your back", "Drinking water", "Stretching"], 1, "Lying flat lets the uterus compress a major vein; limit time on your back."),
    q("Which should be avoided throughout pregnancy?", ["Swimming", "Prenatal yoga", "Contact sports and activities with a fall risk", "Stationary cycling"], 2, "Contact sports, fall-risk activities (skiing, horse riding) and scuba diving are avoided."),
    q("You should stop exercising and get checked for…", ["Feeling a bit warm", "Vaginal bleeding, fluid leaking, chest pain or dizziness", "Mild muscle tiredness", "Needing a water break"], 1, "Those are stop-and-seek-advice signs."),
    q("Daily pelvic-floor exercises help with…", ["Heartburn", "Bladder control and postpartum recovery", "Nausea", "Leg cramps"], 1, "They support continence during pregnancy and recovery afterwards."),
    q("Three 10-minute walks in a day…", ["Don't count", "Count the same as one 30-minute walk", "Are too much", "Only count if brisk"], 1, "Activity can be accumulated in short bouts."),
  ],
  "Preparing the Home": [
    q("The single most important nursery task is…", ["Choosing paint colours", "A safe place for the baby to sleep", "Buying lots of toys", "A cot mobile"], 1, "A firm flat mattress and clear sleep space is the priority; the rest can wait."),
    q("A safe cot contains…", ["A firm flat mattress and a fitted sheet, nothing else", "A pillow and a duvet", "Cot bumpers and soft toys", "A sleep pod"], 0, "No pillows, duvets, bumpers, pods or toys in the sleep space."),
    q("For at least the first 6 months the baby should sleep…", ["In their own room", "In the same room as you", "In your bed", "Wherever is quietest"], 1, "Room-sharing (not bed-sharing) for at least 6 months is advised."),
    q("A comfortable room temperature for baby sleep is about…", ["10–14°C", "16–20°C", "24–28°C", "As warm as possible"], 1, "Around 16–20°C (61–68°F); avoid overheating."),
    q("Full baby-proofing (stair gates, cupboard locks)…", ["Must be done before birth", "Can wait until the baby is on the move", "Is never needed", "Should be done in the first week"], 1, "Newborns don't move; mobility-proofing can wait months."),
    q("A practical early set-up is…", ["A nappy-change station on each floor you use", "A fully decorated nursery", "A toy library", "A baby gym in every room"], 0, "Nappy and feeding stations get used constantly and save energy."),
  ],
  "Baby Essentials": [
    q("Newborns genuinely need…", ["A large wardrobe and many toys", "A safe sleep space, feeding kit, clothes, nappies and a car seat", "A high chair", "Baby shoes"], 1, "That short list covers the essentials; everything else is optional or later."),
    q("Which is best bought new rather than second-hand?", ["Clothes", "The cot mattress and car seat", "A pram", "Books"], 1, "Buy the mattress and car seat new; second-hand is fine for most other items."),
    q("A high chair and weaning gear are needed from about…", ["Birth", "6 weeks", "6 months", "12 months"], 2, "Solids usually start around 6 months."),
    q("With newborn-size clothes it's wise to…", ["Buy lots — they last for months", "Buy small quantities — babies grow fast and some skip the size", "Only buy 0–3 months", "Buy a year's worth"], 1, "Newborn size is short-lived; don't over-buy."),
    q("Before bulk-buying one nappy brand or bottle type…", ["Buy the biggest box available", "Test what suits your baby first", "Ask the shop to choose", "Buy every brand"], 1, "Fit and suitability vary by baby — test before stocking up."),
    q("Baby shoes are needed…", ["From birth", "Once the baby is walking", "At 3 months", "For newborn photos"], 1, "Not needed until walking."),
  ],
  "Financial Preparation": [
    q("For most families the biggest financial factor of a new baby is…", ["The cost of a pram", "Reduced income during parental leave", "Nappies", "Baby clothes"], 1, "One-off gear costs are modest if borrowed; the income drop during leave is the main pressure."),
    q("A good money move before the birth is to…", ["Spend the emergency fund on the nursery", "Build or top up an emergency buffer and model a leave-period budget", "Take on new debt for extras", "Cancel all insurance"], 1, "A buffer and a realistic budget reduce money stress later."),
    q("Parental leave entitlements…", ["Are identical everywhere", "Vary by country and employer — check yours early", "Don't need any paperwork", "Can always be arranged after the birth"], 1, "Rules differ widely and some have notice periods before the birth."),
    q("Some leave benefits have…", ["No rules at all", "Notice periods and paperwork deadlines before the due date", "Automatic enrolment with no action", "A one-year application window"], 1, "Front-load the paperwork; deadlines can fall well before the birth."),
    q("Registering the birth and adding the baby to health cover are best…", ["Left for several months", "Understood and prepared before the birth", "Skipped entirely", "Done only if there's a problem"], 1, "Newborn weeks are not the time for admin — prepare in advance."),
    q("A sensible pre-birth legal task is to…", ["Rewrite your CV", "Review or make a will and think about guardianship", "Change your name", "Sell your car"], 1, "A will and guardianship plan are worth sorting before the baby arrives."),
  ],
  "Birth Planning": [
    q("A birth plan is best thought of as…", ["A binding contract", "A one-page list of preferences in priority order", "A medical order", "A minute-by-minute schedule"], 1, "Preferences, prioritised, with flexibility built in."),
    q("Every birth-preferences document should include…", ["A playlist only", "An 'if plans change' section", "The hospital's address", "Your favourite colour"], 1, "Preferences for an assisted or caesarean birth, in case things change."),
    q("The most effective pain relief in labour is…", ["Gas and air", "An opioid injection", "An epidural", "A TENS machine"], 2, "An epidural is the most effective, with trade-offs like monitoring and a possibly longer pushing stage."),
    q("Gas and air (nitrous oxide) is…", ["Long-lasting and strong", "Quick on and off, self-administered, mild", "Only available at home", "Given by injection"], 1, "You breathe it yourself; it's mild and wears off quickly."),
    q("For straightforward labour and birth, care is usually led by…", ["An obstetrician", "A midwife", "A paediatrician", "A GP"], 1, "A midwife leads; an obstetrician steps in if extra help is needed."),
    q("You can change your mind about pain relief…", ["Only before labour starts", "During labour", "Only with written notice", "Never"], 1, "It's fine to plan to 'see how it goes' and decide in the moment."),
  ],
  "Feeding Basics": [
    q("Newborns typically feed…", ["3 times a day", "8–12 times in 24 hours, including nights", "Once a day", "Only on a strict schedule"], 1, "Frequent, round-the-clock feeding on no fixed schedule is normal."),
    q("Early hunger cues include…", ["Only crying", "Stirring, mouthing and hands to mouth", "Sleeping deeply", "Kicking the legs"], 1, "Respond to early cues rather than waiting for crying."),
    q("'Cluster feeding' in the evening is…", ["A sign of low supply", "Normal, especially in the early weeks and growth spurts", "A medical problem", "Only seen with formula"], 1, "Lots of short feeds close together is common and normal."),
    q("Most early breastfeeding pain is caused by…", ["The baby being hungry", "A shallow latch or positioning — usually fixable", "Too much milk", "Feeding too often"], 1, "Adjusting the latch or getting support resolves most early pain."),
    q("A good latch looks like…", ["Just the nipple in the mouth", "A wide mouth taking a big mouthful of breast, chin leading", "Pursed lips", "Cheeks sucked in"], 1, "Deep latch: wide gape, chin to breast, lots of breast tissue in the mouth."),
    q("When making up formula, you should…", ["Guess the amounts", "Follow the tin's instructions exactly and sterilise equipment", "Reuse leftover milk", "Use cold tap water only, never checking guidance"], 1, "Exact ratio, sterilised kit, fresh feeds; check local guidance on water temperature."),
    q("A reason to seek feeding help is…", ["The baby feeds every 2 hours", "The baby is very sleepy and hard to wake, or has fewer wet nappies than expected", "The baby cluster feeds in the evening", "You feel tired"], 1, "Those can signal the baby isn't getting enough — get support early."),
  ],
  "Newborn Basics": [
    q("Babies should always be put to sleep…", ["On their front", "On their side", "On their back", "However they settle"], 2, "Back to sleep, for every sleep, for naps and at night."),
    q("The newborn sleep surface should be…", ["Soft with a pillow", "Firm and flat with a fitted sheet and nothing else", "A beanbag", "An inclined pod"], 1, "Firm, flat, clear — no pillows, duvets, bumpers or pods."),
    q("Meconium (the first stools) is…", ["Bright yellow", "Dark, sticky and greenish-black, changing to yellow/tan within days", "White", "Red"], 1, "It transitions to softer yellow (breastfed) or tan (formula) stools within a few days."),
    q("To burp a newborn you…", ["Lay them flat and press the tummy", "Hold them upright and gently pat or rub the back", "Bounce them hard", "Shake gently"], 1, "Upright against your chest or sitting supported, with gentle pats."),
    q("Newborn crying often peaks at around…", ["1 week", "6–8 weeks", "6 months", "It never peaks"], 1, "It commonly peaks around 6–8 weeks and then eases."),
    q("If you feel overwhelmed by crying, the right thing to do is…", ["Keep holding no matter what", "Put the baby down somewhere safe, step away for a few minutes, and call someone", "Shake the baby to stop it", "Leave the house"], 1, "Never shake a baby. Putting them down safely and taking a breather is the correct response."),
    q("Room temperature for the sleep space should be…", ["As warm as possible", "Comfortable — around 16–20°C — and not overheated", "Cold", "Doesn't matter"], 1, "Avoid overheating; keep the head uncovered."),
  ],
  "Partner Preparation": [
    q("The most useful kind of support is…", ["Asking 'what can I do?' repeatedly", "Owning one or two recurring tasks completely", "Waiting to be told", "Doing everything once, then stopping"], 1, "Taking ownership lifts the mental load off the pregnant person."),
    q("A birth partner's core role in labour is…", ["Directing the medical team", "Calm presence, practical comfort and advocacy", "Filming everything", "Making the decisions alone"], 1, "Steady support, comfort measures, and helping communicate preferences."),
    q("Before labour, the birth partner should know…", ["Nothing — just show up", "The route, the bag contents and the birth preferences", "Only the due date", "The hospital menu"], 1, "Knowing the plan lets you support rather than scramble."),
    q("In the first two weeks at home, the partner should…", ["Act as a visitor", "Take on household tasks and logistics by default and share the nights", "Focus only on work", "Wait to be asked for help"], 1, "Protect the recovering parent's sleep, food and time; you're a parent, not a helper."),
    q("Partners should learn the signs of…", ["Only physical recovery", "Postpartum depression and anxiety, and how to get help", "Nothing medical", "Just feeding schedules"], 1, "Knowing the warning signs means you can act early."),
    q("A weekly habit that helps during pregnancy is…", ["Assuming everything's fine", "A check-in: 'What would help most this week?'", "Planning a big night out", "Avoiding appointments"], 1, "A regular, specific check-in keeps support useful and current."),
  ],
};

export const LEARN_QUIZZES: LearnQuizSeed[] = LEARN_MODULES.map((m) => ({
  slug: `learn-${m.slug}`,
  title: `${m.title} quiz`,
  category: m.title,
  questions: BY_MODULE[m.title] ?? [],
}));
