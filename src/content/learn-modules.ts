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
 * Pregnancy & early-parenting Learning Hub. Each lesson has a real, longer plain-language
 * explanation, a short related video (opens a curated search on YouTube), a linked quiz, and
 * links to related NestWise lessons. Educational scaffolding — evidence-informed, pending
 * clinical review — with no invented medical advice.
 */

export interface LessonSpec {
  title: string;
  minutes: number;
  /** YouTube search query for the "watch a short video" card. */
  video: string;
  intro: string;
  why: string;
  points: string[];
  tips?: string[];
  avoid?: string[];
  seek?: string;
  takeaways: string[];
  /** Titles of related lessons (resolved to links by the lesson page). */
  related: string[];
}

export interface ModuleMeta {
  slug: string;
  title: string;
  blurb: string;
  emoji: string;
  lessons: LessonSpec[];
}

const L = (s: LessonSpec) => s;

const RAW: Array<Omit<ModuleMeta, "slug">> = [
  {
    title: "Understanding Pregnancy",
    emoji: "🌱",
    blurb: "How pregnancy is measured, the trimesters, and what your due date really means.",
    lessons: [
      L({
        title: "Weeks, not months",
        minutes: 4,
        video: "how pregnancy is measured weeks vs months explained",
        intro:
          "Pregnancy is counted in weeks from the first day of your last menstrual period (LMP), not from conception. That means you're considered about two weeks 'pregnant' before conception even happens — it's just a shared starting line everyone can measure from.",
        why:
          "Care, scans and milestones are all scheduled by gestational week. Months are only a rough translation (about 4.3 weeks each), so 'how many months' rarely has one clean answer.",
        points: [
          "A full-term pregnancy is around 40 weeks from LMP — roughly 280 days.",
          "Trimester 1 is weeks 1–13, trimester 2 is weeks 14–27, trimester 3 is week 28 onward.",
          "Your estimated due date (EDD) is 40 weeks from LMP, or calculated from an early dating scan.",
          "8 weeks ≈ 2 months; 20 weeks ≈ 4.5 months; 30 weeks ≈ 7 months — always approximate.",
          "An early ultrasound (before ~14 weeks) is the most accurate way to date a pregnancy.",
        ],
        tips: [
          "When someone asks 'how far along are you?', give the week — it's the number your care team uses.",
          "Track the week, not the day; a pregnancy 'week' is a 7-day window.",
        ],
        avoid: [
          "Treating the due date as a deadline — only about 1 in 20 babies arrives on it.",
          "Comparing your bump or symptoms week-for-week with someone else's.",
        ],
        takeaways: [
          "Pregnancy is measured in weeks from your last period, not conception.",
          "Months are an approximation; weeks are exact.",
          "The due date is an estimate — a window, not a fixed day.",
        ],
        related: ["The three trimesters", "What your due date really means"],
      }),
      L({
        title: "The three trimesters",
        minutes: 5,
        video: "three trimesters of pregnancy what to expect overview",
        intro:
          "Each trimester has its own theme. The first is rapid, invisible building work. The second is often the most comfortable stretch. The third is growth, preparation and getting ready to meet your baby.",
        why:
          "Knowing the shape of each trimester helps you plan — appointments, tests, telling people, buying essentials, and pacing rest and activity.",
        points: [
          "First trimester (1–13): major organs form; nausea, tiredness and tender breasts are common; miscarriage risk is highest and then drops sharply.",
          "Second trimester (14–27): energy often returns, the bump shows, and most people feel first movements between 16 and 22 weeks. The anatomy scan is usually around 18–22 weeks.",
          "Third trimester (28–40): the baby gains weight and the lungs and brain mature; sleep gets harder; you'll have more frequent check-ups.",
          "Glucose screening for gestational diabetes is typically 24–28 weeks.",
          "Braxton Hicks (practice tightenings) can appear from mid-pregnancy onward.",
        ],
        tips: [
          "Use the calmer second trimester for bigger tasks: tour a hospital, take a class, sort the car seat.",
          "From the third trimester, learn your baby's usual movement pattern and report any clear decrease the same day.",
        ],
        takeaways: [
          "First trimester: building. Second: often the easiest. Third: growth and prep.",
          "First movements usually come at 16–22 weeks.",
          "Key checks: dating scan (early), anatomy scan (~20 weeks), glucose (24–28 weeks).",
        ],
        related: ["Weeks, not months", "Early body changes"],
      }),
      L({
        title: "What your due date really means",
        minutes: 3,
        video: "pregnancy due date accuracy explained",
        intro:
          "Your estimated due date marks 40 weeks of pregnancy. It's a useful planning point and a reference for your care team — but babies are considered full term anywhere from 37 to 42 weeks.",
        why:
          "Thinking of the due date as a single day sets you up for a frustrating final fortnight. A range is more realistic and less anxious.",
        points: [
          "About 1 in 20 babies is born on the exact due date.",
          "Most first babies arrive after the due date; the average is a few days past.",
          "'Term' is 37–42 weeks; 'early term' is 37–38, 'full term' 39–40, 'late term' 41.",
          "If you go past 41–42 weeks, your team will discuss monitoring and induction options.",
        ],
        tips: [
          "Tell people a due 'month' or 'the second half of March' rather than a date.",
          "Have the hospital bag ready by around 36 weeks.",
        ],
        takeaways: [
          "The due date is 40 weeks — a reference point, not a deadline.",
          "Full term is a 5-week window (37–42 weeks).",
          "Going a little past your date is common, especially with a first baby.",
        ],
        related: ["The three trimesters", "Signs labour may be beginning"],
      }),
    ],
  },
  {
    title: "Baby Development",
    emoji: "👶",
    blurb: "How the baby grows, system by system, from a cluster of cells to a newborn.",
    lessons: [
      L({
        title: "First trimester: building the foundations",
        minutes: 5,
        video: "fetal development first trimester week by week",
        intro:
          "In the first 13 weeks, a single fertilised cell becomes a recognisable baby with a beating heart, a brain and spinal cord, limbs, and the beginnings of every organ.",
        why:
          "This is the most sensitive window for development, which is why folic acid, avoiding alcohol and smoking, and food safety matter most now.",
        points: [
          "Weeks 3–4: the neural tube (future brain and spinal cord) forms and closes — folic acid supports this.",
          "Weeks 5–6: the heart starts to beat and pump blood in a simple loop.",
          "Weeks 7–10: limb buds become arms and legs; fingers and toes separate; facial features take shape.",
          "Weeks 11–13: the baby can move (you can't feel it yet), swallows fluid, and all major organs are present in early form.",
          "By the end of the trimester the baby is roughly the length of a lime — a rough comparison, not a measurement.",
        ],
        tips: [
          "Take a daily prenatal with folic acid, ideally started before conception and continued through week 12.",
          "Book your first appointment early so dating and screening can be arranged.",
        ],
        avoid: [
          "Alcohol, smoking and vaping — there's no known safe level in pregnancy.",
          "High-dose vitamin A supplements and liver, which is very high in vitamin A.",
        ],
        takeaways: [
          "The neural tube forms in the first weeks — folic acid matters early.",
          "The heartbeat begins around weeks 5–6.",
          "All major organs are present in early form by the end of the first trimester.",
        ],
        related: ["Second trimester: movement and the senses", "Key nutrients in pregnancy"],
      }),
      L({
        title: "Second trimester: movement and the senses",
        minutes: 4,
        video: "fetal development second trimester senses movement",
        intro:
          "Between weeks 14 and 27 the baby grows quickly and becomes active. Hearing develops, sleep-wake cycles appear, and you'll likely feel the first flutters.",
        why:
          "Feeling movement is reassuring and, later in pregnancy, an important sign of wellbeing. Knowing what's developing helps you connect with your baby.",
        points: [
          "Weeks 16–22: most people feel first movements ('quickening') — often later with a first baby or an anterior placenta.",
          "Around weeks 18–22: the detailed anatomy scan checks growth and the organs.",
          "Hearing matures from about week 24; babies respond to familiar voices and music.",
          "The baby practises breathing movements, swallows, and has fingerprints and eyebrows.",
          "Skin is covered in a protective waxy layer (vernix) and fine hair (lanugo).",
        ],
        tips: [
          "Talk, read or play music — your baby is starting to hear you.",
          "Once movements are regular, get to know the daily pattern.",
        ],
        takeaways: [
          "First movements usually arrive between 16 and 22 weeks.",
          "The anatomy scan is around 20 weeks.",
          "Hearing develops from about week 24 — your voice matters.",
        ],
        related: ["First trimester: building the foundations", "The final weeks"],
      }),
      L({
        title: "The final weeks",
        minutes: 4,
        video: "third trimester baby development lungs brain",
        intro:
          "From week 28, development is mostly about growth and maturing — laying down fat, strengthening the lungs, and rapid brain development — getting ready for life outside the womb.",
        why:
          "Every extra week in the third trimester meaningfully improves a baby's readiness, especially for breathing and feeding.",
        points: [
          "The baby gains roughly 200g a week in the last weeks and stores fat for temperature control.",
          "Lungs produce surfactant, the substance that lets them stay open after birth — this matures late.",
          "The brain grows fast and folds develop; the baby has sleep and wake cycles.",
          "Most babies settle head-down by around 36 weeks; your team checks position near term.",
          "Movements may feel different — more rolling and pressing than kicking — but should not decrease.",
        ],
        tips: [
          "Keep monitoring movements daily; contact your team the same day about any clear reduction.",
          "Pack your hospital bag by about 36 weeks.",
        ],
        seek:
          "Contact your maternity unit straight away if your baby's movements slow down or change from their normal pattern — don't wait until the next day.",
        takeaways: [
          "The third trimester is growth plus lung and brain maturation.",
          "Reduced or changed movements always warrant a same-day call.",
          "Most babies are head-down by around 36 weeks.",
        ],
        related: ["Second trimester: movement and the senses", "Signs labour may be beginning"],
      }),
    ],
  },
  {
    title: "Mother's Body",
    emoji: "🫀",
    blurb: "Common physical changes trimester by trimester — and why they happen.",
    lessons: [
      L({
        title: "Early body changes",
        minutes: 4,
        video: "early pregnancy symptoms first trimester what is normal",
        intro:
          "The first trimester can feel intense even with nothing to show for it. Rising hormones (especially progesterone and hCG) drive most of the early symptoms.",
        why:
          "Knowing what's typical reduces worry and helps you tell the difference between normal discomfort and something to check.",
        points: [
          "Nausea, with or without vomiting, is very common and often eases by 12–16 weeks.",
          "Deep tiredness is normal — your body is building a placenta and blood volume is rising.",
          "Breasts are often tender, fuller and more veiny.",
          "Frequent urination, a heightened sense of smell, food aversions and mood swings are all common.",
          "Light spotting can happen; heavy bleeding or one-sided pain needs prompt review.",
        ],
        tips: [
          "Eat small amounts often; keep plain snacks by the bed for morning nausea.",
          "Rest earlier where you can — first-trimester tiredness is real and temporary.",
        ],
        seek:
          "Call your provider for heavy bleeding, severe or one-sided abdominal pain, fainting, or vomiting so persistent you can't keep fluids down.",
        takeaways: [
          "Hormones drive most early symptoms; nausea and tiredness are expected.",
          "Small, frequent meals help nausea and energy.",
          "Heavy bleeding or severe one-sided pain needs a prompt call.",
        ],
        related: ["Mid-pregnancy changes", "Managing nausea and aversions"],
      }),
      L({
        title: "Mid-pregnancy changes",
        minutes: 4,
        video: "second trimester body changes pregnancy",
        intro:
          "Many people feel their best in the second trimester: nausea fades, energy returns, and the bump becomes visible. New sensations appear as the uterus grows and blood flow increases.",
        why:
          "Mid-pregnancy aches are usually mechanical (a growing bump, softer ligaments) rather than a sign of a problem.",
        points: [
          "Round-ligament pain: brief, sharp pulls low down or in the groin, often with movement.",
          "Nasal congestion and occasional nosebleeds ('pregnancy rhinitis') from increased blood flow.",
          "Mild dizziness when standing quickly, as blood pressure dips in mid-pregnancy.",
          "Skin changes: a darker line down the belly (linea nigra), darker nipples, sometimes patches on the face.",
          "Some swelling in the feet by the end of the day is common.",
        ],
        tips: [
          "Move position slowly; sit or lie down at the first hint of dizziness.",
          "Support the bump when getting up, and bend toward a round-ligament twinge to ease it.",
        ],
        seek:
          "A bad headache with vision changes or sudden swelling of the face and hands can signal pre-eclampsia — seek review the same day.",
        takeaways: [
          "Second-trimester aches are usually mechanical and normal.",
          "Stand up slowly to avoid dizziness.",
          "Headache + vision changes + sudden swelling = urgent review.",
        ],
        related: ["Early body changes", "Late-pregnancy comfort"],
      }),
      L({
        title: "Late-pregnancy comfort",
        minutes: 4,
        video: "third trimester pregnancy discomfort relief tips",
        intro:
          "In the third trimester the bump is large, sleep is broken, and the baby presses on your ribs, bladder and pelvis. Most of this is uncomfortable rather than dangerous.",
        why:
          "Simple positioning and pacing changes make a real difference, and knowing the warning signs lets you relax about the rest.",
        points: [
          "Heartburn is common as the uterus presses up and hormones relax the stomach valve.",
          "Back and pelvic girdle pain come from the shifting centre of gravity and softer joints.",
          "Shortness of breath eases when the baby drops lower before birth.",
          "Braxton Hicks tightenings come and go and are usually painless and irregular.",
          "Swelling in the feet and ankles that settles overnight is usually normal.",
        ],
        tips: [
          "Sleep on your side (either side) with a pillow between your knees; prop up for heartburn.",
          "Smaller, more frequent meals; a supportive band can help pelvic pain.",
        ],
        seek:
          "Seek urgent care for a severe headache with vision changes, sudden or one-sided swelling, a painful hot calf, reduced baby movements, or regular painful contractions before 37 weeks.",
        takeaways: [
          "Late-pregnancy discomfort is mostly mechanical and normal.",
          "Side-sleeping with pillow support helps back, hip and heartburn.",
          "Know the third-trimester red flags and act on them the same day.",
        ],
        related: ["Mid-pregnancy changes", "Sleep positions"],
      }),
    ],
  },
  {
    title: "Prenatal Appointments",
    emoji: "🗓️",
    blurb: "What happens at check-ups, the usual schedule, and how to prepare.",
    lessons: [
      L({
        title: "The schedule of visits",
        minutes: 4,
        video: "prenatal appointment schedule what to expect",
        intro:
          "Antenatal care follows a fairly standard rhythm: more spaced out early on, then closer together toward the end. The exact schedule varies by country and by whether the pregnancy is low or higher risk.",
        why:
          "Knowing roughly when visits fall — and what each is for — helps you plan work, questions and support.",
        points: [
          "A typical low-risk schedule: booking visit (8–12 weeks), then around 16, 20 (anatomy scan), 25, 28, 31, 34, 36, then weekly-ish to birth.",
          "Booking visit: history, bloods, blood pressure, urine, dating scan arranged, screening discussed.",
          "Most visits check blood pressure, urine (for protein), bump measurement and the baby's heartbeat.",
          "24–28 weeks: glucose screening for gestational diabetes; anti-D if you're Rh negative.",
          "From ~36 weeks: the baby's position is checked and birth preferences discussed.",
        ],
        tips: [
          "Bring your notes and a written list of questions to every visit.",
          "Ask what's normal before the next appointment and who to call with concerns between visits.",
        ],
        takeaways: [
          "Visits start spaced out and get more frequent toward term.",
          "Most checks are blood pressure, urine, bump and heartbeat.",
          "Glucose screening is usually 24–28 weeks.",
        ],
        related: ["Questions worth asking", "Screening vs diagnostic tests"],
      }),
      L({
        title: "Questions worth asking",
        minutes: 3,
        video: "questions to ask at prenatal appointments",
        intro:
          "Appointments are short. A little preparation means you leave with answers instead of a list of things you forgot to raise.",
        why:
          "NestWise can help you prepare the conversation — it doesn't replace your clinician. Writing questions down also helps if nerves make your mind go blank.",
        points: [
          "Anything new since last time — symptoms, worries, changes in movement.",
          "Results you're waiting for, and what they mean.",
          "What to expect before the next visit, and any decisions coming up.",
          "Who to contact, and how, if you're worried between appointments.",
          "For later pregnancy: birth preferences, pain relief options, and what happens if you go past your date.",
        ],
        tips: [
          "Keep a running note on your phone and add to it as questions occur to you.",
          "Ask your partner to hold the list and make sure everything gets covered.",
        ],
        takeaways: [
          "Prepare 3–5 questions before each visit.",
          "Always clarify who to call with concerns between visits.",
          "Use the Appointment question builder in NestWise to save questions as you think of them.",
        ],
        related: ["The schedule of visits", "Bringing your partner"],
      }),
    ],
  },
  {
    title: "Prenatal Tests",
    emoji: "🔬",
    blurb: "Screening and diagnostic tests, explained in plain language.",
    lessons: [
      L({
        title: "Screening vs diagnostic tests",
        minutes: 5,
        video: "prenatal screening vs diagnostic tests explained",
        intro:
          "Screening tests estimate the chance that a condition is present. Diagnostic tests give a yes/no answer but carry a small risk. Understanding the difference helps you make choices that fit your values.",
        why:
          "All of these tests are optional. Knowing what a result does and doesn't tell you prevents unnecessary alarm.",
        points: [
          "Combined first-trimester screening (blood test + nuchal translucency scan, ~11–14 weeks) estimates the chance of Down syndrome and some other conditions.",
          "NIPT (non-invasive prenatal testing) is a blood test from ~10 weeks that analyses fetal DNA; it's a screen, not a diagnosis.",
          "Diagnostic tests — CVS (~11–14 weeks) and amniocentesis (~15+ weeks) — confirm chromosomal conditions but carry a small miscarriage risk (roughly 0.1–0.3%).",
          "The mid-pregnancy anatomy scan (~20 weeks) checks the baby's structure and growth.",
          "A 'higher chance' screening result means further testing is offered — it is not a diagnosis.",
        ],
        tips: [
          "Ask what each test can and can't detect, and what you'd do with the result, before deciding.",
          "It's fine to accept some tests and decline others.",
        ],
        takeaways: [
          "Screening = a probability; diagnostic = a definite answer with a small risk.",
          "NIPT and combined screening are screens, not diagnoses.",
          "Every test is optional — decide based on what you'd do with the information.",
        ],
        related: ["Common blood tests and scans", "Making informed choices"],
      }),
      L({
        title: "Common blood tests and scans",
        minutes: 4,
        video: "routine pregnancy blood tests and ultrasound scans",
        intro:
          "Alongside optional screening, some routine tests are offered to almost everyone to look after your health and the baby's.",
        why:
          "These check for things that are common, treatable, and important to catch early — like anaemia, infections and gestational diabetes.",
        points: [
          "Booking bloods: blood group and Rh status, full blood count (anaemia), and screening for HIV, hepatitis B, and syphilis.",
          "Iron levels are re-checked later in pregnancy; supplements are offered if you're low.",
          "Glucose tolerance test at 24–28 weeks screens for gestational diabetes.",
          "Blood pressure and a urine dip at every visit screen for pre-eclampsia and infection.",
          "Dating scan (early) and anatomy scan (~20 weeks) are the two routine ultrasounds in many places; extra scans if there's a reason.",
        ],
        tips: [
          "For the glucose test you'll usually need to fast beforehand — check the instructions.",
          "Ask for your blood results in your notes so you can see trends.",
        ],
        takeaways: [
          "Routine bloods check blood group, anaemia and key infections.",
          "Glucose screening for gestational diabetes is 24–28 weeks.",
          "Blood pressure + urine at every visit screen for pre-eclampsia.",
        ],
        related: ["Screening vs diagnostic tests", "Key nutrients in pregnancy"],
      }),
      L({
        title: "Making informed choices",
        minutes: 3,
        video: "informed consent prenatal testing decision making",
        intro:
          "There are no wrong answers with optional testing — only the choice that's right for you. A simple framework helps you decide calmly.",
        why:
          "Feeling rushed or pressured leads to regret either way. You're allowed to take time and ask questions.",
        points: [
          "Ask: what does this test look for? How accurate is it? What are the risks?",
          "Ask yourself: what would I do with a 'higher chance' or a positive result?",
          "Consider whether the information would change your care, your birth plan, or your preparation.",
          "You can decline a test now and change your mind later (within its time window).",
          "Partners and support people can help you talk it through, but the decision is yours.",
        ],
        tips: [
          "Write your questions down and take them to the appointment.",
          "If you feel pressured, it's okay to say 'I'd like a day to think about it.'",
        ],
        takeaways: [
          "Optional tests are a personal choice — no option is 'wrong'.",
          "Decide based on what you'd do with the result.",
          "You can take time; you can decline; you can change your mind.",
        ],
        related: ["Screening vs diagnostic tests", "Questions worth asking"],
      }),
    ],
  },
  {
    title: "Nutrition",
    emoji: "🥗",
    blurb: "Eating well without strict rules — nutrients, nausea and food safety.",
    lessons: [
      L({
        title: "Building a balanced plate",
        minutes: 4,
        video: "healthy eating in pregnancy balanced plate",
        intro:
          "You don't need a special diet in pregnancy — just a reasonably balanced one, most of the time. 'Eating for two' isn't a thing: energy needs rise only modestly, mainly in the second and third trimesters.",
        why:
          "A varied plate covers most nutrient needs, keeps energy steady, and helps with common issues like constipation and nausea.",
        points: [
          "Fill half the plate with vegetables and fruit, a quarter with wholegrain carbs, a quarter with protein.",
          "Include a source of calcium (dairy or fortified alternatives) most days.",
          "Extra energy needs are roughly 340 kcal/day in the second trimester and 450 in the third — about a substantial snack.",
          "Fibre and fluids together prevent constipation, which iron supplements can worsen.",
          "Continue a prenatal supplement with folic acid and vitamin D as advised locally.",
        ],
        tips: [
          "Batch-cook and freeze portions for tired days.",
          "Keep easy protein snacks around: yoghurt, eggs, hummus, nuts (if not allergic).",
        ],
        takeaways: [
          "No special diet — a varied, balanced plate most days.",
          "Energy needs rise only modestly, later in pregnancy.",
          "Keep taking a prenatal supplement as advised.",
        ],
        related: ["Key nutrients in pregnancy", "Managing nausea and aversions"],
      }),
      L({
        title: "Key nutrients in pregnancy",
        minutes: 5,
        video: "important nutrients during pregnancy folic acid iron calcium",
        intro:
          "A few nutrients matter more in pregnancy because the baby draws on your stores or because needs rise sharply.",
        why:
          "Getting these right supports the baby's development and protects you from problems like anaemia.",
        points: [
          "Folic acid: supports the baby's neural tube; take 400 micrograms daily before conception and through week 12 (higher doses for some people — ask your provider).",
          "Iron: needs roughly double; low iron causes tiredness and anaemia. Pair plant iron (beans, lentils, leafy greens, fortified cereal) with a vitamin-C food, and keep tea/coffee away from meals.",
          "Calcium and vitamin D: for the baby's bones and your own; many places advise a daily vitamin D supplement.",
          "Iodine: important for brain development; found in dairy, eggs and (well-cooked) fish.",
          "Omega-3 (DHA): supports brain and eye development; oily fish 1–2 times a week, within mercury limits.",
        ],
        tips: [
          "One prenatal supplement usually covers folic acid and vitamin D; check the label.",
          "If you're vegetarian or vegan, ask about B12, iron and omega-3 in particular.",
        ],
        avoid: [
          "Doubling up on supplements 'to be safe' — too much vitamin A or iron is harmful.",
          "Liver and high-dose vitamin A supplements.",
        ],
        takeaways: [
          "Folic acid before conception and to week 12.",
          "Iron needs roughly double — pair plant sources with vitamin C.",
          "Vitamin D supplement is widely advised; avoid mega-doses of anything.",
        ],
        related: ["Building a balanced plate", "Food safety in pregnancy"],
      }),
      L({
        title: "Managing nausea and aversions",
        minutes: 4,
        video: "morning sickness relief tips pregnancy nausea",
        intro:
          "Nausea affects most people in early pregnancy and usually settles by 12–16 weeks. In the meantime, eating anything that stays down is better than eating 'perfectly'.",
        why:
          "Trying to force a balanced diet through strong nausea often makes it worse. Once it eases, you can broaden things out again.",
        points: [
          "Eat small amounts often; an empty stomach makes nausea worse.",
          "Plain, dry, cool or bland foods are usually easier — crackers, toast, plain rice, potato.",
          "Sip fluids between meals rather than with them; ginger and vitamin B6 help some people.",
          "Prenatal vitamins can worsen nausea — try taking them with food or at night, or switch to a folic-acid-only supplement temporarily (ask your provider).",
          "Strong smells are common triggers; cold food smells less.",
        ],
        seek:
          "If you can't keep fluids down for a day, are losing weight, or feel dizzy and are passing little urine, contact your provider — severe pregnancy sickness (hyperemesis) needs treatment.",
        takeaways: [
          "'Anything that stays down' beats 'perfectly balanced' while nausea is bad.",
          "Small frequent bland meals; fluids between meals.",
          "Persistent vomiting with weight loss or dehydration needs medical help.",
        ],
        related: ["Building a balanced plate", "Nausea and vomiting"],
      }),
    ],
  },
  {
    title: "Sleep",
    emoji: "😴",
    blurb: "Rest strategies for each stage — positions, night waking and winding down.",
    lessons: [
      L({
        title: "Sleep positions",
        minutes: 3,
        video: "best sleep position during pregnancy side sleeping",
        intro:
          "In early pregnancy, sleep however is comfortable. From the third trimester, going to sleep on your side is advised because it optimises blood flow to the baby.",
        why:
          "In late pregnancy, lying flat on your back lets the uterus press on a major vein, which can reduce blood flow. Side-sleeping avoids this.",
        points: [
          "From about 28 weeks, settle to sleep on your side — either side is fine.",
          "If you wake on your back, just roll back onto your side; brief periods aren't a problem.",
          "A pillow between the knees and one under the bump takes strain off the hips and back.",
          "Propping the upper body up a little helps with heartburn and breathlessness.",
          "A full-length or wedge pillow can make side-sleeping much more comfortable.",
        ],
        tips: [
          "Place a pillow behind your back so rolling fully onto it is harder.",
          "Set up your pillows before you're exhausted — rearranging at 3am is miserable.",
        ],
        takeaways: [
          "Early pregnancy: any comfortable position.",
          "From ~28 weeks: go to sleep on your side, either side.",
          "Waking briefly on your back is fine — just roll back over.",
        ],
        related: ["Night waking and comfort", "Late-pregnancy comfort"],
      }),
      L({
        title: "Night waking and comfort",
        minutes: 4,
        video: "pregnancy insomnia tips better sleep",
        intro:
          "Broken sleep is one of the most common pregnancy complaints — from needing the toilet, to heartburn, to a busy mind, to simply not being able to get comfortable.",
        why:
          "You can't fix all of it, but small changes to routine and environment add up, and daytime rest is legitimate.",
        points: [
          "Cut fluids in the hour or two before bed (but stay well hydrated across the day).",
          "Keep the room cool and dark; pregnancy raises body temperature.",
          "A consistent wind-down and bedtime helps signal sleep.",
          "Leg cramps and restless legs are common; gentle stretching and staying hydrated can help — mention restless legs to your provider as iron can be a factor.",
          "If worry keeps you awake, write tomorrow's list down before bed so your mind can let it go.",
        ],
        tips: [
          "Nap in the day if you can — 20–30 minutes, earlier rather than later.",
          "If you're awake more than ~20 minutes, get up and do something calm in low light, then try again.",
        ],
        takeaways: [
          "Broken sleep is normal; aim for 'better', not 'fixed'.",
          "Cool dark room, earlier fluids, consistent wind-down.",
          "Daytime rest counts — take it when you can.",
        ],
        related: ["Sleep positions", "Winding down"],
      }),
      L({
        title: "Winding down",
        minutes: 3,
        video: "bedtime routine relaxation techniques pregnancy",
        intro:
          "A short, repeatable wind-down routine tells your body it's nearly time to sleep. It also doubles as practice for the calm-breathing you can use in labour.",
        why:
          "Screens, bright light and last-minute tasks keep the brain alert. A 20–30 minute buffer makes a real difference.",
        points: [
          "Dim the lights and put screens away 30 minutes before bed.",
          "Try slow breathing: in for 4, gentle hold, out for 6 — longer out-breaths are calming.",
          "A warm (not hot) shower an hour before bed can help you drop off.",
          "Gentle stretches for the hips and lower back ease end-of-day stiffness.",
          "Keep the same routine each night so it becomes an automatic cue.",
        ],
        tips: [
          "Pair the routine with something pleasant — a chapter of a book, a calming playlist.",
          "Practise the breathing now so it's familiar when you want it in labour.",
        ],
        takeaways: [
          "A 20–30 minute screen-free wind-down helps you fall asleep.",
          "Long, slow out-breaths calm the nervous system.",
          "The same routine each night becomes a sleep cue — and labour prep.",
        ],
        related: ["Night waking and comfort", "Stress and worry"],
      }),
    ],
  },
  {
    title: "Mental & Emotional Wellbeing",
    emoji: "💛",
    blurb: "Looking after your mind through a big life change.",
    lessons: [
      L({
        title: "Mood changes in pregnancy",
        minutes: 4,
        video: "emotional changes during pregnancy mental health",
        intro:
          "Pregnancy stirs up a lot: hormones, tiredness, body changes, and the sheer size of what's coming. Ups and downs are normal. Persistent low mood or anxiety is common too — and treatable.",
        why:
          "Mental health in pregnancy matters for you and shapes the early months with your baby. Naming it early makes support easier.",
        points: [
          "Weepiness, irritability, vivid dreams and worry about the baby are all common.",
          "Around 1 in 10 people experience depression or anxiety during pregnancy — it is not a weakness or a failure.",
          "Risk is higher if you've had depression or anxiety before, have little support, or are going through other stress.",
          "Antenatal anxiety often shows as physical tension, sleeplessness and constant 'what if' thinking.",
          "Effective help exists — talking therapies, support groups, and, where needed, medication that's compatible with pregnancy.",
        ],
        seek:
          "Talk to your midwife or doctor if low or anxious mood lasts most days for two weeks, if you can't function day to day, or at any point if you have thoughts of harming yourself — help is available and it works.",
        takeaways: [
          "Emotional ups and downs are a normal part of pregnancy.",
          "Depression and anxiety affect ~1 in 10 and respond well to support.",
          "Two weeks of most-days low mood is the signal to reach out.",
        ],
        related: ["Stress and worry", "When to reach out for support"],
      }),
      L({
        title: "Stress and worry",
        minutes: 3,
        video: "managing stress and anxiety during pregnancy",
        intro:
          "Some worry is part of caring about your baby. The aim isn't zero stress — it's keeping it at a level you can live with.",
        why:
          "Chronic high stress isn't good for anyone, and simple daily practices genuinely lower it.",
        points: [
          "Regular gentle movement, daylight and sleep are the foundation — they blunt stress hormones.",
          "Slow breathing (longer out-breath) calms the body within minutes.",
          "Limit doom-scrolling and 'researching' worst cases late at night.",
          "Talk to someone: a partner, friend, midwife, or a pregnancy support line.",
          "Lower the bar on non-essential tasks — this is a season, not forever.",
        ],
        tips: [
          "Pick one worry-reducing habit and do it daily for a week before adding another.",
          "Schedule a short 'worry time' earlier in the day so it doesn't take over bedtime.",
        ],
        takeaways: [
          "Aim for manageable, not zero, stress.",
          "Movement, daylight, sleep and slow breathing are the basics.",
          "Talking it out beats late-night worst-case research.",
        ],
        related: ["Mood changes in pregnancy", "Winding down"],
      }),
      L({
        title: "When to reach out for support",
        minutes: 3,
        video: "perinatal mental health when to get help",
        intro:
          "It can be hard to know when normal pregnancy feelings tip into something that needs help. A few clear signals make it simpler.",
        why:
          "Getting support early is easier and more effective than waiting until you're in crisis — and it protects your bond with your baby.",
        points: [
          "Low or anxious mood most days for two weeks or more.",
          "Losing interest or pleasure in things you'd normally enjoy.",
          "Struggling to function — work, relationships, looking after yourself.",
          "Panic attacks, or intrusive frightening thoughts.",
          "Any thoughts of harming yourself or that your family would be better off without you.",
        ],
        seek:
          "Contact your midwife, GP or a perinatal mental health service for any of the above. For thoughts of self-harm, seek help immediately — call your provider or emergency services.",
        takeaways: [
          "Two weeks of most-days low mood or anxiety is the threshold to ask for help.",
          "Loss of enjoyment and trouble functioning are key signs.",
          "Any thought of self-harm is an emergency — reach out now.",
        ],
        related: ["Mood changes in pregnancy", "Parent mental health after birth"],
      }),
    ],
  },
  {
    title: "Exercise & Movement",
    emoji: "🧘",
    blurb: "Safe, gentle activity — why it helps and how to adapt it.",
    lessons: [
      L({
        title: "Why movement helps",
        minutes: 3,
        video: "benefits of exercise during pregnancy",
        intro:
          "For most pregnancies, staying active is one of the most useful things you can do. It's linked to easier pregnancies, better mood and sleep, and often smoother recovery after birth.",
        why:
          "Pregnancy is not an illness. Unless your provider has advised otherwise, keeping moving is protective, not risky.",
        points: [
          "Guidelines suggest about 150 minutes of moderate activity a week, spread across the week.",
          "Benefits include less back pain, better sleep and mood, steadier blood sugar, and a lower chance of some complications.",
          "'Moderate' means you can talk but not sing — walking, swimming, stationary cycling, prenatal yoga or Pilates.",
          "If you already train, you can usually continue, adjusting intensity as pregnancy progresses.",
          "Pelvic-floor exercises done daily support bladder control and recovery.",
        ],
        tips: [
          "Break it up: three 10-minute walks count the same as one 30-minute walk.",
          "Warm up, cool down, and keep well hydrated; avoid overheating.",
        ],
        takeaways: [
          "Aim for ~150 minutes of moderate activity a week if your pregnancy is low risk.",
          "'Moderate' = you can talk but not sing.",
          "Daily pelvic-floor exercises are worth building in now.",
        ],
        related: ["Choosing activities by trimester", "Warning signs to stop"],
      }),
      L({
        title: "Choosing activities by trimester",
        minutes: 4,
        video: "safe pregnancy exercises by trimester",
        intro:
          "The best activity is one you'll actually do and that feels good in your body today. What's comfortable shifts as the bump grows.",
        why:
          "A few adjustments keep exercise safe and comfortable as your balance, joints and belly change.",
        points: [
          "First trimester: usually little needs to change; listen to energy levels and nausea.",
          "Second trimester: avoid lying flat on your back for long; watch your balance as your centre of gravity shifts.",
          "Third trimester: lower-impact options (walking, water, cycling on a stationary bike) are often more comfortable; shorten sessions if needed.",
          "Skip contact sports, activities with a fall risk (skiing, horse riding), and scuba diving throughout.",
          "Add pelvic tilts, cat–cow, hip and hamstring stretches, and breathing practice at any stage.",
        ],
        tips: [
          "If a move causes pain, pressure, or leaking, swap it — don't push through.",
          "Supportive shoes and a bump-support band help in later pregnancy.",
        ],
        takeaways: [
          "Adapt, don't stop: lower impact and shorter sessions later on.",
          "Avoid long periods flat on your back from the second trimester.",
          "No contact sports, fall-risk activities, or scuba diving.",
        ],
        related: ["Why movement helps", "Warning signs to stop"],
      }),
      L({
        title: "Warning signs to stop",
        minutes: 3,
        video: "warning signs to stop exercising during pregnancy",
        intro:
          "Exercise is safe for most pregnancies, but a short list of symptoms means stop and get checked.",
        why:
          "These signs are uncommon, but knowing them lets you exercise with confidence the rest of the time.",
        points: [
          "Vaginal bleeding or fluid leaking.",
          "Regular painful contractions.",
          "Chest pain, dizziness, or feeling faint.",
          "Calf pain or swelling.",
          "Headache, shortness of breath before starting, or muscle weakness affecting balance.",
          "A clear decrease in the baby's movements afterward.",
        ],
        seek:
          "Stop exercising and contact your maternity unit if any of these happen. Bleeding, fluid leaking, severe breathlessness or reduced movements need same-day review.",
        takeaways: [
          "Bleeding, fluid leak, contractions, chest pain, dizziness, calf pain = stop.",
          "Reduced movements after exercise needs a same-day call.",
          "Otherwise, staying active is safe and good for you.",
        ],
        related: ["Choosing activities by trimester", "Why movement helps"],
      }),
    ],
  },
  {
    title: "Preparing the Home",
    emoji: "🏠",
    blurb: "Getting the space ready calmly — sleep space, safety and keeping it simple.",
    lessons: [
      L({
        title: "A safe sleep space",
        minutes: 4,
        video: "safe sleep space for baby crib setup",
        intro:
          "The single most important bit of nursery prep is a safe place for the baby to sleep. Everything else can be sorted at your own pace.",
        why:
          "Safe sleep practices substantially reduce the risk of sudden infant death (SIDS) and sleep accidents.",
        points: [
          "A firm, flat mattress that fits the cot/crib/Moses basket snugly, with a fitted sheet and nothing else.",
          "No pillows, duvets, bumpers, pods or soft toys in the sleep space.",
          "Baby sleeps on their back, in the same room as you, for at least the first 6 months.",
          "Keep the room at a comfortable temperature (around 16–20°C / 61–68°F) and don't overheat.",
          "A baby sleeping bag or a light, well-tucked blanket to no higher than the shoulders.",
        ],
        tips: [
          "Set up the sleep space early so it's one less thing later.",
          "Second-hand is fine for most things, but buy a new mattress.",
        ],
        takeaways: [
          "Firm flat mattress, fitted sheet, nothing else in the space.",
          "Back to sleep, in your room for 6+ months.",
          "Buy the mattress new; keep the room cool.",
        ],
        related: ["Room-by-room prep", "Safe sleep"],
      }),
      L({
        title: "Room-by-room prep",
        minutes: 4,
        video: "baby proofing home newborn essentials setup",
        intro:
          "Newborns don't move, so full baby-proofing can wait. Focus on a few practical set-ups that make the first weeks easier.",
        why:
          "The early days are tiring. Small conveniences — a nappy station downstairs, easy snacks — protect your energy.",
        points: [
          "A nappy-change station on each floor you use, stocked with nappies, wipes and a change of clothes.",
          "A comfortable feeding spot with a side table, water, phone charger and a light.",
          "Somewhere safe to put the baby down in each main room (a bouncer or flat mat).",
          "Batch-cook and freeze meals; stock easy one-handed snacks.",
          "Check smoke alarms, and know your car-seat installation before the birth.",
        ],
        tips: [
          "Do a 'first night home' walk-through: where will the baby sleep, feed, be changed?",
          "Full baby-proofing (stairgates, cupboard locks) can wait until your baby is on the move.",
        ],
        takeaways: [
          "Set up nappy and feeding stations; you'll use them constantly.",
          "Freeze meals and stock one-handed snacks now.",
          "Baby-proofing for mobility can wait months.",
        ],
        related: ["A safe sleep space", "The short essentials list"],
      }),
    ],
  },
  {
    title: "Baby Essentials",
    emoji: "🧺",
    blurb: "What newborns actually need at first — and what can wait.",
    lessons: [
      L({
        title: "The short essentials list",
        minutes: 4,
        video: "newborn baby essentials what you really need",
        intro:
          "Newborns need surprisingly little: somewhere safe to sleep, a way to feed, clothes, nappies, and a car seat if you drive. Everything else is optional or can wait.",
        why:
          "Baby marketing is relentless. A short list saves money and space, and you can add things once you know your baby.",
        points: [
          "Sleep: cot/crib/Moses basket + firm mattress + 2–3 fitted sheets + sleeping bags or light blankets.",
          "Feeding: if breastfeeding, not much beyond breast pads and maybe a pump later; if bottle feeding, bottles, teats and sterilising kit.",
          "Clothes: 6–8 bodysuits and sleepsuits in newborn and 0–3m, a few hats and cardigans, scratch mitts.",
          "Nappies and fragrance-free wipes or cotton wool; a changing mat; barrier cream.",
          "Transport: a correctly fitted rear-facing car seat; a pram or carrier suitable from birth.",
        ],
        tips: [
          "Buy small quantities of newborn sizes — babies grow fast and some skip that size.",
          "Borrow or buy second-hand for clothes, prams and furniture; buy the mattress and car seat new.",
        ],
        takeaways: [
          "Sleep space, feeding kit, clothes, nappies, car seat — that's the core.",
          "Don't over-buy newborn sizes.",
          "New mattress and car seat; second-hand is fine for most of the rest.",
        ],
        related: ["Feeding supplies", "What can wait"],
      }),
      L({
        title: "What can wait",
        minutes: 3,
        video: "baby items you don't need right away",
        intro:
          "Plenty of popular baby products are genuinely useful later, or never essential. Holding off keeps clutter and cost down.",
        why:
          "You'll make better choices once you've met your baby and know what your days actually look like.",
        points: [
          "High chair, weaning gear: not needed until around 6 months.",
          "Lots of toys: a newborn's world is faces, voices and light; toys come later.",
          "Cot mobiles, night lights, special bath seats: nice-to-haves, not essentials.",
          "Baby shoes: not needed until walking.",
          "Big bulk buys of one nappy brand or bottle type — test what suits your baby first.",
        ],
        tips: [
          "Keep a running wishlist instead of buying now; revisit it after a few weeks at home.",
          "Ask friends with slightly older babies what they actually used.",
        ],
        takeaways: [
          "Weaning gear, toys and shoes can all wait.",
          "Test nappies and bottles before bulk-buying.",
          "Decide most 'nice-to-haves' after your baby arrives.",
        ],
        related: ["The short essentials list", "Room-by-room prep"],
      }),
    ],
  },
  {
    title: "Financial Preparation",
    emoji: "💰",
    blurb: "Planning ahead for costs, leave and paperwork.",
    lessons: [
      L({
        title: "Budgeting for a baby",
        minutes: 4,
        video: "budgeting for a new baby first year costs",
        intro:
          "The predictable costs of a new baby are smaller than the headlines suggest — especially if you borrow big items and skip the extras. The bigger financial hit is usually reduced income during leave.",
        why:
          "A rough plan now reduces money stress later, when you'll have less bandwidth for admin.",
        points: [
          "One-off costs: sleep space, car seat, pram, a starter set of clothes and feeding kit.",
          "Ongoing costs: nappies, wipes, formula (if used), clothes as they grow, and childcare later.",
          "The largest factor for most families is the drop in income while one or both parents are on leave.",
          "Build or top up an emergency buffer before the birth if you can.",
          "Check what second-hand, hand-me-down and loan options exist in your circle and community.",
        ],
        tips: [
          "List your fixed monthly outgoings and model a few months on reduced income.",
          "Delay non-essential purchases; you may be gifted a lot at a baby shower.",
        ],
        takeaways: [
          "Predictable baby costs are modest if you borrow big items.",
          "The main financial pressure is reduced income during leave.",
          "Build a buffer and model your leave-period budget now.",
        ],
        related: ["Understanding leave options", "Paperwork before birth"],
      }),
      L({
        title: "Understanding leave options",
        minutes: 3,
        video: "maternity paternity parental leave explained",
        intro:
          "Parental leave rules vary widely by country and employer. The key is to find out your specific entitlements early so you can plan finances and timing.",
        why:
          "Some benefits have notice periods or paperwork deadlines well before the birth.",
        points: [
          "Check statutory entitlements (maternity, paternity, shared/parental leave) and how much is paid.",
          "Check your employer's policy — it may be more generous than the statutory minimum.",
          "Note any notice periods and forms, and the earliest and latest you can start leave.",
          "Understand how leave affects pension contributions and any benefits.",
          "If both parents can take leave, plan whether to overlap or stagger it.",
        ],
        tips: [
          "Ask HR for a written summary of your options and deadlines.",
          "Decide your rough return-to-work date early — you can usually change it later.",
        ],
        takeaways: [
          "Find out your exact entitlements and employer policy early.",
          "Watch for notice periods and paperwork deadlines before the birth.",
          "Plan whether to overlap or stagger two parents' leave.",
        ],
        related: ["Budgeting for a baby", "Paperwork before birth"],
      }),
      L({
        title: "Paperwork before birth",
        minutes: 3,
        video: "paperwork to prepare before baby arrives",
        intro:
          "A short admin list, done before the birth, saves you doing it one-handed at 3am with a newborn.",
        why:
          "Newborn weeks are not the time for forms. Front-load what you can.",
        points: [
          "Sort leave paperwork and notify your employer within any deadline.",
          "Check how to register the birth and what you'll need.",
          "Add the baby to health cover / insurance where relevant, and understand the timeframe.",
          "Review or make a will and think about guardianship.",
          "Save key phone numbers: maternity unit, midwife, GP, and after-hours advice lines.",
        ],
        tips: [
          "Keep a folder (paper or digital) with all pregnancy and admin documents in one place.",
          "Pre-fill any forms you can before your due date.",
        ],
        takeaways: [
          "Do leave, registration and insurance paperwork before the birth.",
          "Consider a will and guardianship.",
          "Keep all key numbers and documents in one folder.",
        ],
        related: ["Understanding leave options", "Emergency & important contacts"],
      }),
    ],
  },
  {
    title: "Birth Planning",
    emoji: "📝",
    blurb: "Thinking through birth preferences — options, not guarantees.",
    lessons: [
      L({
        title: "Preferences, not a fixed plan",
        minutes: 4,
        video: "how to write a birth plan preferences",
        intro:
          "A 'birth plan' is really a set of preferences: what matters to you if things go smoothly, and what you'd want if they change. Labour can take its own course, so flexibility is built in.",
        why:
          "Writing preferences down helps your birth partner and team support you, and prompts useful conversations beforehand.",
        points: [
          "Keep it to one page, in priority order, with your name and key details at the top.",
          "Cover: who you want with you; environment (light, movement, music); pain-relief thoughts; monitoring preferences; pushing position; and what matters immediately after birth (delayed cord clamping, skin-to-skin, first feed).",
          "Include an 'if plans change' section — e.g. preferences for an assisted or caesarean birth.",
          "Discuss it with your midwife or doctor in the third trimester.",
          "Bring printed copies for your bag.",
        ],
        tips: [
          "Use 'I'd prefer…' and 'if possible…' rather than absolute statements.",
          "Make sure your birth partner knows your priorities so they can advocate for you.",
        ],
        takeaways: [
          "It's a one-page list of preferences, in priority order.",
          "Always include an 'if plans change' section.",
          "Share it with your team and your birth partner before labour.",
        ],
        related: ["Pain-management options overview", "Who is on your team"],
      }),
      L({
        title: "Pain-management options overview",
        minutes: 5,
        video: "pain relief options in labour comparison",
        intro:
          "There's a spectrum of pain relief in labour, from movement and breathing to an epidural. None is 'better' — the right choice is the one that's right for you on the day, and you can change your mind.",
        why:
          "Knowing the options and their trade-offs beforehand means you're deciding from information, not panic.",
        points: [
          "Non-medical: movement and position changes, a birth pool or shower, breathing techniques, massage, a TENS machine, and a calm environment.",
          "Gas and air (nitrous oxide): quick on and off, take-it-yourself, mild; can make you light-headed or nauseous.",
          "Opioid injections (e.g. pethidine, diamorphine): take the edge off; can make you drowsy and, close to birth, affect the baby's breathing and early feeding.",
          "Epidural: the most effective pain relief; numbs from the waist down; needs monitoring, a drip and often a catheter; may lengthen the pushing stage and increase the chance of an assisted birth.",
          "Availability varies by setting (home, birth centre, hospital).",
        ],
        tips: [
          "Ask your provider what's available where you plan to give birth.",
          "It's fine to plan to 'see how it goes' and decide in labour.",
        ],
        takeaways: [
          "Options run from breathing and water to gas and air, opioids, and an epidural.",
          "Each has trade-offs; none is the 'right' one for everyone.",
          "You can change your mind during labour.",
        ],
        related: ["Preferences, not a fixed plan", "Contractions"],
      }),
      L({
        title: "Who is on your team",
        minutes: 3,
        video: "who is present during labour and birth roles",
        intro:
          "Knowing who does what during labour helps it feel less overwhelming and helps you know who to ask.",
        why:
          "You may meet several people. Understanding their roles helps you feel supported rather than processed.",
        points: [
          "Midwife: leads care for straightforward labour and birth, monitors you and the baby, supports comfort and decisions.",
          "Obstetrician: a doctor who gets involved if extra help or an intervention is needed.",
          "Birth partner: your chosen support — comfort measures, encouragement, advocacy, the point of contact.",
          "Support workers and students may be present with your consent.",
          "In some places, a doula provides continuous non-medical support if you arrange one.",
        ],
        tips: [
          "Ask people to introduce themselves and their role when they come in.",
          "You can ask for a student not to be present, or for a change of care provider if you're uncomfortable.",
        ],
        takeaways: [
          "Midwife leads straightforward births; an obstetrician steps in if needed.",
          "Your birth partner's job is comfort, encouragement and advocacy.",
          "You can consent to — or decline — students being present.",
        ],
        related: ["Preferences, not a fixed plan", "The partner's role in labour"],
      }),
    ],
  },
  {
    title: "Feeding Basics",
    emoji: "🍼",
    blurb: "How feeding works in the early days — breast, bottle or both.",
    lessons: [
      L({
        title: "How feeding works early on",
        minutes: 5,
        video: "newborn feeding basics first weeks breastfeeding",
        intro:
          "Newborn feeding is frequent, round the clock, and driven by tiny stomachs. Whether you breastfeed, bottle feed, or combine, the first two weeks are about establishing feeding and learning your baby's cues.",
        why:
          "Knowing what's normal — the frequency, the cluster feeds, the nappy counts — stops a lot of unnecessary worry.",
        points: [
          "Newborns feed roughly 8–12 times in 24 hours, including at night; there's no fixed schedule.",
          "A newborn's stomach is tiny (about a cherry on day one), so feeds are small and often.",
          "Watch for early hunger cues — stirring, mouthing, hands to mouth — rather than waiting for crying.",
          "'Cluster feeding' (lots of short feeds close together, often in the evening) is normal, especially in the early weeks and growth spurts.",
          "Nappies are a good guide: by day 5, expect around 6+ wet nappies and regular soft yellow stools.",
        ],
        tips: [
          "Feed responsively — offer a feed when your baby shows cues, day or night.",
          "Ask for feeding support early if anything hurts or feels stuck; it's much easier to fix early.",
        ],
        seek:
          "Contact your midwife, health visitor or doctor if your baby is very sleepy and hard to wake for feeds, has fewer wet nappies than expected, isn't back to birth weight by around 2 weeks, or feeding is consistently painful.",
        takeaways: [
          "Expect 8–12 feeds a day, including nights, on no fixed schedule.",
          "Feed on early cues, not crying; cluster feeding is normal.",
          "Wet-nappy and weight checks are the reassurance signals.",
        ],
        related: ["Positions and latch basics", "Feeding your newborn: first two weeks"],
      }),
      L({
        title: "Positions and latch basics",
        minutes: 4,
        video: "breastfeeding latch and positioning tips",
        intro:
          "If you're breastfeeding, a comfortable position and a deep latch prevent most early pain and help your baby feed well. If bottle feeding, paced bottle feeding keeps feeds calm and baby-led.",
        why:
          "Most early breastfeeding pain is a latch or positioning issue — and fixable with small adjustments or support.",
        points: [
          "Breastfeeding: baby's whole body facing you, ear-shoulder-hip in a line, nose to nipple, chin leading, wide mouth taking a big mouthful of breast (not just the nipple).",
          "Bring the baby to the breast, not the breast to the baby; support your back and use pillows.",
          "Signs of a good latch: no pinching pain after the first few sucks, rhythmic suck-swallow, rounded cheeks.",
          "Bottle feeding: hold baby fairly upright, keep the bottle horizontal, let baby draw the teat in, and pause regularly ('paced' feeding).",
          "Wind the baby partway through and at the end of feeds.",
        ],
        tips: [
          "If it hurts, gently break the latch (little finger into the corner of the mouth) and try again.",
          "See a lactation consultant or breastfeeding support service early if pain or feeding worries persist.",
        ],
        takeaways: [
          "Deep latch, baby in a line, brought to the breast — not the reverse.",
          "Ongoing pain means adjust the latch or get support.",
          "For bottles: upright baby, horizontal bottle, paced and baby-led.",
        ],
        related: ["How feeding works early on", "Formula and combination feeding"],
      }),
      L({
        title: "Formula and combination feeding",
        minutes: 4,
        video: "how to prepare formula safely combination feeding",
        intro:
          "Formula feeding and combination (breast + bottle) feeding are common and can be done safely and lovingly. The key extras are safe preparation and, if combining, protecting milk supply.",
        why:
          "Fed is the goal. Knowing the practical safety steps means you can feed with confidence.",
        points: [
          "Sterilise bottles and teats before each use for the first year.",
          "Follow the tin's instructions exactly — the right water-to-powder ratio matters. In many countries, guidance is to use water that's been boiled and cooled to no less than 70°C to make up a feed, then cool it quickly before feeding.",
          "Make feeds fresh where possible; don't save leftover milk from a feed.",
          "If combining, breastfeed or express regularly to keep supply up, especially in the early weeks.",
          "Paced bottle feeding (upright baby, frequent pauses) works for expressed milk and formula alike.",
        ],
        tips: [
          "Set up a clean, organised bottle station to make night feeds faster.",
          "Ask your midwife or health visitor to show you preparation once in person.",
        ],
        takeaways: [
          "Sterilise, follow the ratio exactly, and make feeds fresh.",
          "Check your local guidance on water temperature for making up formula.",
          "If combining, express or nurse regularly to protect supply.",
        ],
        related: ["How feeding works early on", "Positions and latch basics"],
      }),
    ],
  },
  {
    title: "Newborn Basics",
    emoji: "🌙",
    blurb: "Core newborn-care skills to practise before day one.",
    lessons: [
      L({
        title: "Diapering and burping",
        minutes: 4,
        video: "how to change a diaper and burp a newborn",
        intro:
          "Nappy changes and burping are two things you'll do many times a day. A few minutes of know-how makes them quick and calm.",
        why:
          "Confidence with the basics frees up energy for the harder parts of newborn life.",
        points: [
          "Change nappies frequently and whenever soiled; clean front to back, especially for girls.",
          "Expect dark, sticky meconium in the first days, changing to softer yellow (breastfed) or tan (formula) stools.",
          "Air-dry or pat dry; a thin layer of barrier cream if the skin looks irritated.",
          "Burp by holding baby upright against your chest or sitting supported, gently patting or rubbing the back.",
          "Not every feed produces a burp — that's fine; don't keep going for ages.",
        ],
        tips: [
          "Have everything within reach before you start a change; never step away from a raised surface.",
          "Keep a spare outfit in the changing bag — leaks happen.",
        ],
        takeaways: [
          "Change often, clean front to back, keep supplies within reach.",
          "Meconium turns to yellow/tan stools within days.",
          "Burp upright with gentle pats; no burp is okay.",
        ],
        related: ["Safe sleep", "Soothing a crying newborn"],
      }),
      L({
        title: "Safe sleep",
        minutes: 4,
        video: "safe sleep for babies back to sleep guidance",
        intro:
          "Safe-sleep practices are simple and consistent, and they meaningfully reduce the risk of sudden infant death and sleep accidents. Every caregiver should follow the same rules.",
        why:
          "The advice is well established and the same worldwide: back, firm flat surface, clear space, same room.",
        points: [
          "Always put your baby to sleep on their back, for naps and at night.",
          "Firm, flat sleep surface (cot, crib, Moses basket) with a fitted sheet and nothing else — no pillows, duvets, bumpers, pods or toys.",
          "Baby sleeps in your room (not your bed) for at least the first 6 months.",
          "Keep the room at a comfortable temperature and don't overheat; feet-to-foot with a light blanket, or a baby sleeping bag.",
          "Keep the sleep space smoke-free; avoid sofa or armchair sleeping with your baby.",
        ],
        tips: [
          "Brief the grandparents and any babysitters on the same rules.",
          "If you're worried you might fall asleep feeding, make the bed safer in advance (no pillows/duvet near baby) rather than risking the sofa.",
        ],
        takeaways: [
          "Back to sleep, every sleep.",
          "Firm flat surface, clear space, room-sharing for 6+ months.",
          "Same rules for every caregiver.",
        ],
        related: ["A safe sleep space", "Diapering and burping"],
      }),
      L({
        title: "Soothing a crying newborn",
        minutes: 4,
        video: "how to calm a crying baby techniques",
        intro:
          "All babies cry, and some cry a lot — it often peaks around 6–8 weeks and then eases. Working through a calm checklist helps, and so does knowing it's not a sign you're doing something wrong.",
        why:
          "Crying that won't settle is exhausting and can feel personal. A plan — and permission to take a break — protects you both.",
        points: [
          "Work through: hungry? nappy? too hot/cold? needs to burp? wants closeness or movement?",
          "Try skin-to-skin, holding, gentle rocking or swaying, a walk in a sling or pram, white noise, or a calm dark room.",
          "'Purple crying' / colic-type evening crying is common and usually passes; it doesn't mean pain in most cases.",
          "If your baby is unwell (fever, very floppy or stiff, poor feeding, a weak or high-pitched cry, breathing trouble), seek medical advice.",
          "It is always okay to put your baby down safely in their cot and step away for a few minutes if you feel overwhelmed.",
        ],
        seek:
          "Never shake a baby. If you feel you might lose control, put the baby down somewhere safe, walk away, and call someone for support. Seek medical help if the cry sounds unusual or the baby seems unwell.",
        takeaways: [
          "Run a calm checklist; try closeness, movement and white noise.",
          "Evening 'colic' crying is common and passes.",
          "Putting the baby down safely and taking a breather is the right call when you're overwhelmed — never shake a baby.",
        ],
        related: ["Diapering and burping", "Newborn crying"],
      }),
    ],
  },
  {
    title: "Partner Preparation",
    emoji: "🤝",
    blurb: "How the partner gets ready to support pregnancy, birth and the first weeks.",
    lessons: [
      L({
        title: "Support during pregnancy",
        minutes: 4,
        video: "how partners can support during pregnancy",
        intro:
          "The most useful support is specific and reliable. 'Let me know if you need anything' puts the work on the pregnant person; taking ownership of tasks lifts it off them.",
        why:
          "Partners who are informed and involved feel more confident at the birth and in the early weeks, and it strengthens the relationship.",
        points: [
          "Read the same week-by-week content so you share the picture.",
          "Take over one or two recurring chores completely — no need to be asked each time.",
          "Come to appointments where you can; hold the list of questions and take notes.",
          "Ask how she's feeling — physically and emotionally — and listen without rushing to fix.",
          "Learn the pregnancy red flags (bleeding, severe headache with vision changes, reduced movements) so you can act.",
        ],
        tips: [
          "Do a weekly check-in: 'What would help most this week?'",
          "Protect her rest — handle an evening or a night so she can sleep earlier.",
        ],
        takeaways: [
          "Own tasks outright rather than waiting to be asked.",
          "Share the learning and come to appointments.",
          "Know the red flags so you can respond, not just react.",
        ],
        related: ["Hospital and labour role", "Questions worth asking"],
      }),
      L({
        title: "Hospital and labour role",
        minutes: 4,
        video: "what does a birth partner do during labour",
        intro:
          "In labour, the birth partner's job is calm presence, practical comfort, and advocacy — being the steady point in the room.",
        why:
          "A prepared birth partner makes a real difference to how supported the labouring person feels.",
        points: [
          "Know the plan: where you're going, the bag contents, the birth preferences and the priorities within them.",
          "Comfort measures: drinks and snacks (for you both), cool cloths, counter-pressure on the lower back, helping with position changes, running a bath or shower.",
          "Advocacy: help ask questions ('what are the options?', 'is there time to think?'), and share the preferences with the team.",
          "Be the communication hub — updates to family go through you, so she doesn't have to.",
          "Encouragement and a calm voice; follow her lead on touch and talk.",
        ],
        tips: [
          "Pack a bag for yourself too: snacks, a phone charger, a change of clothes.",
          "Practise the counter-pressure and breathing together beforehand.",
        ],
        takeaways: [
          "Calm presence, practical comfort, advocacy.",
          "Know the bag, the route and the birth preferences.",
          "Be the buffer between the room and everyone else.",
        ],
        related: ["The partner's role in labour", "The first two weeks at home"],
      }),
      L({
        title: "The first two weeks at home",
        minutes: 4,
        video: "supporting partner first weeks after birth newborn",
        intro:
          "The 'fourth trimester' is intense. The partner's role is to protect recovery, take on the logistics, and bond with the baby — not to be a visitor.",
        why:
          "How supported the recovering parent feels in the first two weeks shapes their recovery and mood.",
        points: [
          "Take household tasks and admin by default: meals, laundry, tidying, messages, visitors.",
          "Share the nights — even if not feeding, you can do nappies, settling and bringing the baby over.",
          "Protect sleep and food: keep water, snacks and easy meals within reach, especially during feeds.",
          "Manage visitors: agree timing and length, and it's fine to say 'not yet'.",
          "Bond directly: skin-to-skin, carrying, bathing, settling — babies benefit from both parents.",
        ],
        tips: [
          "Do a daily check-in on how the other parent is really doing.",
          "Learn the signs of postpartum depression and anxiety, and how to get help.",
        ],
        seek:
          "If the other parent has low or anxious mood most days beyond two weeks, can't sleep even when the baby sleeps, or has frightening thoughts, help them contact their provider. Any thoughts of self-harm or harming the baby need immediate help.",
        takeaways: [
          "Own the logistics; you're a parent, not a helper.",
          "Share the nights and protect recovery sleep and food.",
          "Know the postpartum mental-health warning signs.",
        ],
        related: ["Partner postpartum support", "Hospital and labour role"],
      }),
    ],
  },
];

export const LEARN_MODULES: ModuleMeta[] = RAW.map((m) => ({ ...m, slug: slugify(m.title) }));

/** All lesson specs flattened, with their module attached, for lookups. */
export const ALL_LESSONS = LEARN_MODULES.flatMap((m) =>
  m.lessons.map((lesson) => ({
    module: m,
    lesson,
    slug: `${m.slug}--${slugify(lesson.title)}`,
  })),
);

export function lessonSlug(moduleSlug: string, lessonTitle: string): string {
  return `${moduleSlug}--${slugify(lessonTitle)}`;
}

export function learnLessonSeeds(): ContentSeed[] {
  return ALL_LESSONS.map(({ module: mod, lesson, slug }) => ({
    slug,
    title: lesson.title,
    contentType: "LESSON" as const,
    stage: "PREGNANCY" as const,
    category: mod.title,
    summary: lesson.intro,
    keyTakeaways: lesson.takeaways,
    blocks: [
      para(lesson.intro),
      heading("Why it matters"),
      para(lesson.why),
      heading("The key points"),
      list(lesson.points),
      ...(lesson.tips ? [heading("Practical tips"), list(lesson.tips)] : []),
      ...(lesson.avoid ? [heading("Best to avoid"), list(lesson.avoid)] : []),
      ...(lesson.seek ? [callout("caution", lesson.seek, "When to seek advice")] : []),
      callout(
        "info",
        "Finished reading? Mark the lesson complete and take the module quiz to check what stuck.",
      ),
    ],
    source: PLACEHOLDER_SOURCE,
    referenceUrls: TRUSTED_REFS,
    reviewedAt: null,
  }));
  // The lesson page resolves each lesson's video + related links from ALL_LESSONS by slug.
}
