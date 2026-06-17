// Canonical shape + built-in defaults for the editable site content document.
// This file is browser-safe (no DB/server deps). The server stores the
// document as opaque JSON; the frontend always merges whatever is stored over
// these defaults, so the site keeps working as the schema grows.

export type NavLink = { label: string; href: string };

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
