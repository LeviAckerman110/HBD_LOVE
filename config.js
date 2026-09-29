/* ============ كل المحتوى القابل للتعديل هنا / ALL EDITABLE CONTENT ============ */
const CONFIG = {
  name: { en: "My Love", ar: "حبيبتي" },          // اسم الشخص
  signature: "Eng Aly",                          // التوقيع الأخير
  whatsapp: "201000000000",                      // رقم واتساب بالكود الدولي بدون +
  whatsappText: { en: "Hi ❤️", ar: "أهلاً ❤️" },
  birthday: "2027-03-15T00:00:00",               // (بيتجدد تلقائيًا كل سنة) تاريخ العد التنازلي (عيد الميلاد)
  dateNight: {                                   // الخروجة (اليوم بتختاره هي من الكالندر)
    location: { en: "Our favorite spot", ar: "مكاننا المفضل" }
  },
  music: "assets/music/our-song.mp3",            // اتركه "" لإخفاء الموسيقى
  theme: {                                       // الألوان
    pink: "#f2a3bd", pinkLight: "#ffdfe9", white: "#fffafc",
    night: "#0d1030", purple: "#4a2a7a", gold: "#e6c27a", red: "#e0526f"
  },
  // عدد الجمل هنا = عدد مرات محاولة الضغط على NO الإجبارية قبل ما YES يتفتح
  noMessages: {
    en: ["You really thought that would work? 😂", "Nice try 😏", "NO is currently unavailable.", "Looks like YES is your only option ❤️"],
    ar: ["إنت بجد لسه بتحاول؟ 😂", "محاولة لطيفة 😏", "زرار الـ NO مش متاح حاليًا.", "واضح إن الاختيار الوحيد هو YES ❤️"]
  },
  timeline: [
    { date: "2024-01-10", title: { en: "First Meeting", ar: "أول لقاء" }, text: { en: "The day everything quietly changed.", ar: "اليوم اللي كل حاجة اتغيرت فيه بهدوء." }, image: "assets/photos/photo-01.jpg" },
    { date: "2024-01-12", title: { en: "First Message", ar: "أول رسالة" }, text: { en: "A simple hello I still remember.", ar: "كلمة بسيطة لسه فاكرها." }, image: "" },
    { date: "2024-03-02", title: { en: "First Date", ar: "أول خروجة" }, text: { en: "Time stopped and I didn't mind.", ar: "الوقت وقف وأنا مكنتش مضايق." }, image: "assets/photos/photo-02.jpg" },
    { date: "2024-08-20", title: { en: "Favorite Memory", ar: "أحلى ذكرى" }, text: { en: "Laughing until we forgot why.", ar: "ضحكنا لحد ما نسينا السبب." }, image: "assets/photos/photo-03.jpg" },
    { date: "2025-02-14", title: { en: "Special Day", ar: "يوم مميز" }, text: { en: "A day I would live again.", ar: "يوم أعيشه تاني." }, image: "" },
    { date: "2026-09-28", title: { en: "Today", ar: "النهارده" }, text: { en: "Still writing our story.", ar: "لسه بنكتب قصتنا." }, image: "" }
  ],
  memories: [
    { image: "assets/photos/photo-01.jpg", date: "2024-01-10", title: { en: "The Beginning", ar: "البداية" }, text: { en: "Where it all started.", ar: "من هنا بدأ كل شيء." } },
    { image: "assets/photos/photo-02.jpg", date: "2024-03-02", title: { en: "Our First Date", ar: "أول خروجة" }, text: { en: "Nervous, happy, and perfect.", ar: "متوترين، سعداء، ومثاليين." } },
    { image: "assets/photos/photo-03.jpg", date: "2024-08-20", title: { en: "Pure Laughter", ar: "ضحك من القلب" }, text: { en: "My favorite sound is your laugh.", ar: "أحلى صوت عندي هو ضحكتك." } }
    // أضف أي عدد من الذكريات
  ],
  reasons: [
    { en: "Your smile.", ar: "ابتسامتك." },
    { en: "The way you make ordinary days special.", ar: "إنك بتخلي الأيام العادية مميزة." },
    { en: "The little things you do.", ar: "التفاصيل الصغيرة اللي بتعملها." },
    { en: "How safe I feel with you.", ar: "الأمان اللي بحسه معاك." }
  ],
  moonLetter: "M",                                // الحرف اللي على القمر (بجانبه قلب)
  letters: [                                      // الرسائل المقفولة (أضف أو احذف براحتك)
    { label: { en: "Open when you miss me", ar: "افتحيها لما تفتقديني" },
      text: { en: "\u201CI miss you\u201D is too small a phrase for what I feel\u2026 Close your eyes \u2014 I'm right there, in every thought you have of me.", ar: "\u201Cوحشتيني\u201D كلمة صغيرة على اللي جوايا\u2026 غمّضي عينك، أنا موجود في كل فكرة ليكي عني." } },
    { label: { en: "Open when you can't sleep", ar: "افتحيها لما النوم يهرب منك" },
      text: { en: "Close your eyes. Somewhere I'm thinking of you right now. Breathe slowly \u2014 tomorrow will be kinder, and I'll be in it.", ar: "غمّضي عينك. في مكان ما أنا بفكر فيكي دلوقتي. خدي نفس بطيء، بكرة هيبقى ألطف وأنا فيه." } },
    { label: { en: "Open when today is hard", ar: "افتحيها لما يومك يبقى تقيل" },
      text: { en: "Whatever today took from you, it cannot take me from you. Rest. I'm on your side, always.", ar: "أيًا كان اللي اليوم أخده منك، مقدرش ياخدني منك. ارتاحي، أنا في صفك دايمًا." } },
    { label: { en: "Open when you need a laugh", ar: "افتحيها لما تحتاجي تضحكي" },
      text: { en: "Remember that thing we keep laughing about at the worst possible moment? Yeah. That. I'm smiling too, right now.", ar: "فاكرة الحاجة اللي بنضحك عليها في أسوأ وقت ممكن؟ أيوه هي دي. أنا كمان بضحك دلوقتي." } },
    { label: { en: "Open on your birthday", ar: "افتحيها في عيد ميلادك" },
      text: { en: "If you're reading this, we made it another year of us. Here's to all the years still waiting for us.", ar: "لو بتقرأي ده، يبقى عدّينا سنة كمان مع بعض. وكل السنين اللي لسه مستنيانا." } }
  ],
  funny: [                                        // "الحاجات اللي اتعلمتها عنك" (قسم مرح)
    { en: "You are always right.", ar: "إنتي دايمًا على حق." },
    { en: "Even when you're obviously wrong. \ud83d\ude02", ar: "حتى لما تكوني غلط بوضوح. \ud83d\ude02" },
    { en: "I don't know how, but you make everything more complicated and more fun. \ud83d\ude02\u2764\ufe0f", ar: "مش عارف إزاي، بس بتخلي كل حاجة أعقد وأحلى في نفس الوقت. \ud83d\ude02\u2764\ufe0f" },
    { en: "\"I'm not hungry\" means you'll eat half my plate.", ar: "\u201cمش جعانة\u201d يعني هتاكلي نص طبقي." },
    { en: "You say \"five minutes\" and mean anything but.", ar: "بتقولي \u201cخمس دقايق\u201d وتقصدي أي حاجة إلا خمس دقايق." }
  ],
  choices: [                                      // لعبة "اختاري واحدة" (أضف/احذف أزواج براحتك)
    { aIcon: "\ud83c\udfac", a: { en: "Movie night", ar: "سهرة أفلام" }, bIcon: "\ud83c\udf5d", b: { en: "Dinner out", ar: "عشا برا" } },
    { aIcon: "\ud83c\udf0a", a: { en: "Beach", ar: "بحر" }, bIcon: "\ud83c\udf0c", b: { en: "Stars", ar: "نجوم" } },
    { aIcon: "\ud83c\udf05", a: { en: "Sunrise", ar: "شروق" }, bIcon: "\ud83c\udf19", b: { en: "Midnight", ar: "نص الليل" } },
    { aIcon: "\ud83e\udd17", a: { en: "Hug", ar: "حضن" }, bIcon: "\u2764\ufe0f", b: { en: "Kiss", ar: "بوسة" } }
  ],
  surpriseImage: "",                              // صورة اختيارية داخل المفاجأة
  t: {
    en: {
      q1: "Someone loves you…", q2: "And they want to tell you in a different way.", yes: "YES ❤️", no: "NO 😏",
      forName: "For {name} ❤️", h1: "Every love story is beautiful…", h2: "But ours is my favorite. ❤️", scroll: "Scroll to explore ↓",
      love: "Since you came into my life, ordinary days started feeling special.",
      storyT: "Our Story", memT: "Our Memories", reasonsT: "Reasons I Love You", reasonsHint: "Tap a card",
      bdayT: "Happy Birthday, My Love ❤️", bdayMsg: "Another year of you, and the world is brighter for it. May every wish you make find its way to you.",
      days: "Days", hours: "Hours", mins: "Minutes", secs: "Seconds", bdayNow: "It's your day! 🎉",
      dateQ: "So… when are we going out? 👀", dateDone: "It's a date! ❤️", at: "at", change: "Pick another day",
      surBtn: "Open Your Surprise 🎁", surMsg: "You are my favorite person, my calm, my home. Thank you for being you.",
      secret: "P.S. I still choose you. Every time. ❤️", fin1: "And if I had to choose again…", fin2: "I'd still choose you. ❤️",
      made: "Made with love by", wa: "💬 Send me a message", close: "Close", music: "Toggle music", lockHint: "Try pressing NO first 😏",
      lettersT: "Letters, sealed with love \ud83d\udc8c", lettersHint: "Each one written from the heart \u2014 open them one by one.", lettersCount: "{n} of {total} letters opened \ud83d\udc8c",
      meterT: "How much do I love you? \ud83c\udf21\ufe0f", measure: "Measure it! \ud83d\udc98", again: "Break it again \ud83d\udd01",
      meterSeq: ["FILLING THE GAUGE...", "ARE YOU SURE THE GAUGE CAN HANDLE IT?", "ALMOST THERE... 99%... WAIT---", "ERROR: LOVE EXCEEDS MEASUREMENT LIMITS \ud83d\udca5", "THE METER IS OVERHEATING..."],
      mx: "{name} \u00d7 \u221e \u2764\ufe0f", minf: "infinite \u2764\ufe0f", mnote: "The needle maxed out at {name}. As expected.", mcnt: "The meter has broken \u00d7{n} because of you \ud83d\udc98",
      chapters: ["HOW IT STARTED", "THE LITTLE THINGS", "OUR MEMORIES", "WHY YOU", "WHAT COMES NEXT"],
      sinceT: "We've been creating memories for\u2026",
      funnyT: "Things I Have Learned About You \ud83d\ude04",
      hbLabel: "BPM", hbCap: "Okay\u2026 I think you broke my heart meter. \ud83d\ude02\u2764\ufe0f",
      chooseT: "Choose One \ud83d\udc95", chooseFinal: "Whatever you choose\u2026 I just want to do it with you. \u2764\ufe0f",
      beforeLeave: "Before you leave\u2026", chooseAgainQ: "Would you choose this story again?", always: "Always \u2764\ufe0f",
      nextChapter: "Then let's make the next chapter even better. \u2764\ufe0f",
      foundEgg: "You found something that wasn't supposed to be easy to find. \u2764\ufe0f", timeQ: "What time works for you? 🕗", timeOk: "Confirm ✔",
      calHint: "Pick the day that works for you 💗", dateHint: "Now send me the day and time you picked on WhatsApp so I can plan it 💌", sendDate: "💬 Send the date on WhatsApp", dateMsg: "It's a date! ❤️ I picked {date} at {time} — {place}."
    },
    ar: {
      q1: "شخص يحبك...", q2: "وقرر يعبر عن حبه لك بطريقة مختلفة.", yes: "YES ❤️", no: "NO 😏",
      forName: "إلى {name} ❤️", h1: "كل قصة حب جميلة...", h2: "لكن قصتنا هي المفضلة عندي. ❤️", scroll: "اسحب لتكتشف ↓",
      love: "من يوم ما دخلت حياتي، حتى الأيام العادية بقت مميزة.",
      storyT: "حكايتنا", memT: "ذكرياتنا", reasonsT: "ليه بحبك", reasonsHint: "اضغط على الكارت",
      bdayT: "عيد ميلاد سعيد يا حبيبتي ❤️", bdayMsg: "سنة جديدة معاك، والدنيا أحلى بيك. أتمنى كل أمنية تتمناها توصلك.",
      days: "يوم", hours: "ساعة", mins: "دقيقة", secs: "ثانية", bdayNow: "النهارده يومك! 🎉",
      dateQ: "طيب... هنخرج إمتى؟ 👀", dateDone: "اتفقنا! ❤️", at: "الساعة", change: "اختاري يوم تاني",
      surBtn: "افتح مفاجأتك 🎁", surMsg: "إنت أحب الناس لقلبي، وراحتي، وبيتي. شكرًا إنك إنت.",
      secret: "ملاحظة: لسه هختارك كل مرة. ❤️", fin1: "ولو كان قدامي الاختيار من جديد...", fin2: "هختارك برضه. ❤️",
      made: "صُنع بحب بواسطة", wa: "💬 ابعتلي رسالة", close: "إغلاق", music: "تشغيل/إيقاف الموسيقى", lockHint: "جرّب تدوس NO الأول 😏",
      lettersT: "رسائل مقفولة بالحب \ud83d\udc8c", lettersHint: "كل واحدة مكتوبة من القلب \u2014 افتحيهم واحدة واحدة.", lettersCount: "فتحتي {n} من {total} رسائل \ud83d\udc8c",
      meterT: "قد إيه بحبك؟ \ud83c\udf21\ufe0f", measure: "قيسي! \ud83d\udc98", again: "اكسريه تاني \ud83d\udd01",
      meterSeq: ["جاري ملء المقياس...", "متأكدة إن المقياس هيستحمل؟", "قربنا... 99%... استني---", "خطأ: الحب تجاوز حدود القياس \ud83d\udca5", "المقياس بيسخن..."],
      mx: "{name} \u00d7 \u221e \u2764\ufe0f", minf: "لا نهائي \u2764\ufe0f", mnote: "الإبرة وصلت لآخر المقياس عند {name}. زي المتوقع.", mcnt: "المقياس اتكسر \u00d7{n} مرة بسببك \ud83d\udc98",
      chapters: ["البداية", "التفاصيل الصغيرة", "ذكرياتنا", "ليه إنتي", "الجاي إيه"],
      sinceT: "بقالنا بنصنع ذكريات\u2026",
      funnyT: "حاجات اتعلمتها عنك \ud83d\ude04",
      hbLabel: "نبضة", hbCap: "طيب\u2026 أظن إنك كسرتي مقياس قلبي. \ud83d\ude02\u2764\ufe0f",
      chooseT: "اختاري واحدة \ud83d\udc95", chooseFinal: "أيًا كان اللي هتختاريه\u2026 أنا بس عايز أعمله معاكي. \u2764\ufe0f",
      beforeLeave: "قبل ما تمشي\u2026", chooseAgainQ: "هل كنتي هتختاري القصة دي تاني؟", always: "أكيد \u2764\ufe0f",
      nextChapter: "يبقى خلينا نخلي الفصل الجاي أحلى. \u2764\ufe0f",
      foundEgg: "لقيتي حاجة مكنش المفروض تلاقيها بسهولة. \u2764\ufe0f", timeQ: "الساعة كام تناسبك؟ 🕗", timeOk: "تأكيد ✔",
      calHint: "اختاري اليوم اللي يناسبك 💗", dateHint: "دلوقتي ابعتيلي اليوم والساعة اللي اخترتيهم على واتساب عشان أرتب كل حاجة 💌", sendDate: "💬 ابعتي الموعد على واتساب", dateMsg: "اتفقنا! ❤️ اخترت يوم {date} الساعة {time} — {place}."
    }
  }
};
