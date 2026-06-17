// Canonical shape + built-in defaults for the editable site content document.
// This file is browser-safe (no DB/server deps). The server stores the
// document as opaque JSON; the frontend always merges whatever is stored over
// these defaults, so the site keeps working as the schema grows.

export type NavLink = { label: string; href: string };

export type PageHeader = { badge: string; title: string; description: string };

export type HomeSectionKey = "latest" | "shorts" | "stats";

export type HomeSection = { key: HomeSectionKey; visible: boolean };

export type SiteThemeColors = {
  green: string;
  greenLight: string;
  greenDark: string;
  gold: string;
  goldLight: string;
  ivory: string;
  gray: string;
  text: string;
};

export type SiteContent = {
  theme: {
    colors: SiteThemeColors;
    fonts: { sans: string; serif: string };
  };
  brand: {
    logoText: string;
    siteTitle: string;
    siteSubtitle: string;
  };
  nav: {
    items: NavLink[];
  };
  footer: {
    title: string;
    description: string;
    quickLinksTitle: string;
    quickLinks: NavLink[];
    contactTitle: string;
    contactMessage: string;
    contactButton: string;
    copyright: string; // supports the {year} placeholder
    quote: string;
  };
  pages: {
    home: {
      hero: {
        eyebrow: string;
        titleLine1: string;
        titleLine2: string;
        subtitle: string;
      };
      latest: {
        eyebrow: string;
        heading: string;
        browseAll: string;
        empty: string;
      };
      shorts: { eyebrow: string; heading: string };
      stats: { eyebrow: string; title: string };
      sections: HomeSection[];
    };
    lessons: PageHeader & { searchPlaceholder: string };
    lectures: PageHeader & { searchPlaceholder: string };
    words: PageHeader & { searchPlaceholder: string };
    shorts: { title: string; searchPlaceholder: string };
    recitations: { title: string; searchPlaceholder: string };
    schedule: { title: string; searchPlaceholder: string };
    contact: {
      title: string;
      intro: string;
      warningTitle: string;
      warningMessage: string;
      channelsTitle: string;
      channelsSubtitle: string;
      channelsEmptyTitle: string;
      channelsEmptyMessage: string;
      tipsTitle: string;
      tips: string[];
      formTitle: string;
      formSubtitle: string;
      nameLabel: string;
      emailLabel: string;
      typeLabel: string;
      messageLabel: string;
      fieldPlaceholder: string;
      messagePlaceholder: string;
      submitLabel: string;
      formNote: string;
    };
  };
  seo: {
    siteTitle: string;
  };
};

export const defaultSiteContent: SiteContent = {
  theme: {
    colors: {
      green: "#0a3622",
      greenLight: "#125336",
      greenDark: "#052013",
      gold: "#c5a059",
      goldLight: "#dabb78",
      ivory: "#fdfbf7",
      gray: "#e5e3db",
      text: "#2d2d2d",
    },
    fonts: {
      sans: '"Tajawal", system-ui, sans-serif',
      serif: '"Tajawal", system-ui, sans-serif',
    },
  },
  brand: {
    logoText: "ع",
    siteTitle: "عبدالله بن سعد آل غلفيص",
    siteSubtitle: "الموقع الرسمي للشيخ",
  },
  nav: {
    items: [
      { label: "الرئيسية", href: "/" },
      { label: "الدروس العلمية", href: "/lessons" },
      { label: "المحاضرات", href: "/lectures" },
      { label: "الكلمات الدعوية", href: "/words" },
      { label: "المقاطع القصيرة", href: "/shorts" },
      { label: "متفرقات", href: "/recitations" },
      { label: "جدول المحاضرات والدروس", href: "/schedule" },
      { label: "تواصل معنا", href: "/contact" },
    ],
  },
  footer: {
    title: "الشيخ عبدالله آل غلفيص",
    description:
      "منصة علمية تعنى بنشر السلاسل العلمية، والمحاضرات، والكلمات الدعوية، والمقاطع القصيرة، والمواد المتفرقة، لتكون مرجعًا منظمًا لطالبي العلم.",
    quickLinksTitle: "روابط سريعة",
    quickLinks: [
      { label: "الدروس العلمية", href: "/lessons" },
      { label: "المحاضرات", href: "/lectures" },
      { label: "الكلمات الدعوية", href: "/words" },
      { label: "المقاطع القصيرة", href: "/shorts" },
      { label: "متفرقات", href: "/recitations" },
      { label: "جدول المحاضرات والدروس", href: "/schedule" },
    ],
    contactTitle: "تواصل معنا",
    contactMessage: "يسعدنا تواصلكم واستقبال مقترحاتكم عبر القنوات الرسمية.",
    contactButton: "صفحة التواصل",
    copyright:
      "جميع الحقوق محفوظة للموقع الرسمي للشيخ عبدالله بن سعد آل غلفيص © {year}",
    quote: "« وفوق كل ذي علم عليم »",
  },
  pages: {
    home: {
      hero: {
        eyebrow: "بوابة علمية شرعية",
        titleLine1: "دروس الشيخ ومحاضراته وكلماته",
        titleLine2: "في موضعٍ واحد منظّم",
        subtitle:
          "جمعٌ يعتني به نفرٌ من طلاب الشيخ، يضمّ سلاسله العلمية ومحاضراته وكلماته الدعوية وفوائده القصيرة، مرتّبةً وفق أبواب العلم تيسيرًا على طالب العلم.",
      },
      latest: {
        eyebrow: "المحتوى العلمي",
        heading: "أحدث المحاضرات والدروس المنشورة",
        browseAll: "تصفّح بقية المحتوى العلمي داخل الموقع",
        empty: "لا يوجد محتوى منشور إضافي حاليًا.",
      },
      shorts: {
        eyebrow: "فوائد مختصرة",
        heading: "أحدث المقاطع القصيرة",
      },
      stats: {
        eyebrow: "المحتوى في أرقام",
        title: "نظرة على ما يضمّه الموقع",
      },
      sections: [
        { key: "latest", visible: true },
        { key: "shorts", visible: true },
        { key: "stats", visible: true },
      ],
    },
    lessons: {
      badge: "مكتبة المشاهدة العلمية",
      title: "الدروس العلمية",
      description:
        "اختر السلسلة من الأيقونات، ثم اختر الحلقة وشاهدها مباشرة داخل الصفحة دون انتقال أو نوافذ منبثقة.",
      searchPlaceholder: "ابحث باسم السلسلة أو الكتاب أو باب العلم...",
    },
    lectures: {
      badge: "مكتبة المحاضرات",
      title: "المحاضرات العامة",
      description:
        "محاضرات ولقاءات علمية ودعوية لا تندرج ضمن السلاسل العلمية، تُعرض داخل الصفحة بصورة مختصرة وواضحة.",
      searchPlaceholder: "ابحث باسم المحاضرة أو باب العلم أو التصنيف...",
    },
    words: {
      badge: "مكتبة الكلمات الدعوية",
      title: "الكلمات الدعوية",
      description:
        "كلمات موجزة وتوجيهات نافعة، تُعرض داخل الصفحة بفهرس مختصر ومشغل واضح عند توفر الفيديو.",
      searchPlaceholder: "ابحث باسم الكلمة أو باب العلم أو التصنيف...",
    },
    shorts: {
      title: "المقاطع القصيرة",
      searchPlaceholder: "ابحث بعنوان المقطع أو التصنيف...",
    },
    recitations: {
      title: "متفرقات",
      searchPlaceholder: "ابحث في التلاوات والخطب والملفات...",
    },
    schedule: {
      title: "جدول المحاضرات والدروس",
      searchPlaceholder: "ابحث باسم الدرس أو الموعد...",
    },
    contact: {
      title: "تواصل معنا",
      intro:
        "هذه الصفحة مخصصة لاستقبال الملاحظات والمقترحات المتعلقة بالموقع، وسيتم تفعيل الإرسال المباشر بعد ربط النموذج بخدمة آمنة.",
      warningTitle: "تنبيه مهم",
      warningMessage:
        "نموذج التواصل غير مفعل حاليًا. سيتم تفعيل الإرسال المباشر لاحقًا بعد ربطه بخدمة آمنة من جهة الخادم، حفاظًا على الخصوصية ومنع إساءة الاستخدام.",
      channelsTitle: "القنوات الرسمية",
      channelsSubtitle: "الروابط المعتمدة للمتابعة والتواصل.",
      channelsEmptyTitle: "سيتم إضافة القنوات الرسمية قريبًا",
      channelsEmptyMessage:
        "ستظهر هنا روابط القنوات الرسمية بعد اعتمادها، مثل قناة يوتيوب أو أي وسيلة تواصل أخرى تقررها إدارة الموقع.",
      tipsTitle: "قبل إرسال الرسالة",
      tips: [
        "اكتب عنوانًا واضحًا ومختصرًا للرسالة.",
        "إذا كانت الملاحظة فنية، اذكر رابط الصفحة أو اسم القسم.",
        "لا تضع بيانات خاصة أو حساسة داخل نموذج التواصل.",
      ],
      formTitle: "نموذج الإرسال",
      formSubtitle: "سيتم تفعيله لاحقًا بعد الربط الآمن.",
      nameLabel: "الاسم الكريم",
      emailLabel: "بريدك الإلكتروني",
      typeLabel: "نوع الرسالة",
      messageLabel: "نص الرسالة",
      fieldPlaceholder: "سيتم تفعيل الحقل لاحقًا",
      messagePlaceholder: "سيتم تفعيل النموذج بعد ربطه بخدمة آمنة",
      submitLabel: "الإرسال غير مفعل حاليًا",
      formNote: "سيتم تفعيل الإرسال المباشر لاحقًا بعد ربط النموذج بخدمة آمنة.",
    },
  },
  seo: {
    siteTitle: "الشيخ عبدالله بن سعد آل غلفيص",
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Recursively merges a stored partial document over the defaults. Objects are
// merged key by key; arrays and primitives from the override replace the base.
export function mergeSiteContent(override: unknown): SiteContent {
  return deepMerge(defaultSiteContent, override) as SiteContent;
}

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return base;
  }
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(override)) {
    const incoming = override[key];
    const current = (base as Record<string, unknown>)[key];
    if (incoming === undefined) continue;
    if (isPlainObject(current) && isPlainObject(incoming)) {
      result[key] = deepMerge(current, incoming);
    } else {
      result[key] = incoming;
    }
  }
  return result as T;
}
