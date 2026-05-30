export type KnowledgeSubCategory = {
  id: string;
  name: string;
  description?: string;
};

export type KnowledgeCategory = {
  id: string;
  name: string;
  description: string;
  displayOrder: number;
  children: KnowledgeSubCategory[];
};

export const knowledgeCategories: KnowledgeCategory[] = [
  {
    id: "tafsir",
    name: "التفسير وعلوم القرآن",
    description:
      "ما يتعلق بتفسير كتاب الله وعلوم القرآن وشروح كتب التفسير والفوائد القرآنية.",
    displayOrder: 1,
    children: [
      {
        id: "tafsir-quran",
        name: "تفسير القرآن",
        description: "دروس وسلاسل في تفسير آيات القرآن الكريم.",
      },
      {
        id: "tafsir-books",
        name: "شروح كتب التفسير",
        description: "التعليق على كتب التفسير المعتمدة.",
      },
      {
        id: "tafsir-benefits",
        name: "فوائد تفسيرية",
        description: "فوائد مختصرة متعلقة بتفسير الآيات.",
      },
    ],
  },
  {
    id: "hadith",
    name: "الحديث وعلومه",
    description:
      "ما يتعلق بشروح كتب الحديث، وأحاديث الأحكام، وفوائد السنة النبوية.",
    displayOrder: 2,
    children: [
      {
        id: "hadith-books",
        name: "شروح كتب الحديث",
        description: "السلاسل العلمية في شرح كتب الحديث.",
      },
      {
        id: "hadith-ahkam",
        name: "أحاديث الأحكام",
        description: "الأحاديث التي يُستنبط منها الحكم الفقهي.",
      },
      {
        id: "hadith-mustalah",
        name: "مصطلح الحديث",
        description: "ما يتعلق بعلوم الرواية والدراية.",
      },
    ],
  },
  {
    id: "fiqh",
    name: "الفقه",
    description:
      "ما يتعلق بالأحكام الفقهية، والعبادات، والمعاملات، والقضاء، والأسرة.",
    displayOrder: 3,
    children: [
      {
        id: "fiqh-ibadat",
        name: "العبادات",
        description: "أحكام الطهارة والصلاة والزكاة والصيام والحج.",
      },
      {
        id: "fiqh-muamalat",
        name: "المعاملات",
        description: "أحكام البيع والشراء والعقود والمعاملات المالية.",
      },
      {
        id: "fiqh-family",
        name: "الأسرة",
        description: "أحكام النكاح والطلاق والنفقة وما يتعلق بالأسرة.",
      },
      {
        id: "fiqh-qada",
        name: "القضاء",
        description: "أحكام القضاء والشهادات والبينات وما يتعلق بها.",
      },
      {
        id: "fiqh-salah",
        name: "فقه الصلاة",
        description: "أحكام الصلاة وآدابها وما يتعلق بالمساجد والصفوف.",
      },
      {
        id: "fiqh-wasaya",
        name: "الوصايا",
        description: "أحكام الوصية وما يتعلق بها من مسائل وتنبيهات.",
      },
    ],
  },
  {
    id: "aqidah",
    name: "العقيدة",
    description:
      "ما يتعلق بالتوحيد، والإيمان، ومسائل الاعتقاد، والردود العلمية.",
    displayOrder: 4,
    children: [
      {
        id: "aqidah-tawhid",
        name: "التوحيد",
        description: "مسائل التوحيد وأقسامه وما يضادّه.",
      },
      {
        id: "aqidah-iman",
        name: "الإيمان",
        description: "مسائل الإيمان وأصول الاعتقاد.",
      },
      {
        id: "aqidah-rudud",
        name: "الردود العلمية",
        description: "الردود على الشبهات والمخالفات العقدية.",
      },
    ],
  },
  {
    id: "adab-ilm",
    name: "آداب العلم والتربية",
    description:
      "ما يتعلق بطلب العلم وآدابه وثمراته وتربية النفس على المنهج العلمي.",
    displayOrder: 5,
    children: [
      {
        id: "adab-talab",
        name: "طلب العلم",
        description: "مسائل وآداب تتعلق بطالب العلم.",
      },
      {
        id: "adab-mutaallim",
        name: "آداب المتعلم",
        description: "ما ينبغي لطالب العلم من أدب وسمت.",
      },
      {
        id: "adab-thamarat",
        name: "ثمرات العلم",
        description: "آثار العلم النافع وثمراته على صاحبه.",
      },
      {
        id: "adab-wasaya",
        name: "الوصايا",
        description: "وصايا وتوجيهات لطالب العلم والمسلم عمومًا.",
      },
    ],
  },
  {
    id: "raqaiq",
    name: "الرقائق والآداب",
    description: "ما يتعلق بالمواعظ، وتزكية النفس، وحسن الخلق، وآداب التعامل.",
    displayOrder: 6,
    children: [
      {
        id: "raqaiq-mawaiz",
        name: "المواعظ",
        description: "كلمات ومواعظ مؤثرة في تزكية القلوب.",
      },
      {
        id: "raqaiq-akhlaq",
        name: "حسن الخلق",
        description: "المواد المتعلقة بالأخلاق وحسن التعامل.",
      },
      {
        id: "raqaiq-nafs",
        name: "تهذيب النفس",
        description: "ما يعين على إصلاح النفس وترك آفاتها.",
      },
      {
        id: "raqaiq-haq",
        name: "قبول الحق",
        description: "مواد تتعلق بالتواضع للحق وترك التعنت.",
      },
    ],
  },
].sort((a, b) => a.displayOrder - b.displayOrder);

export function getKnowledgeCategoryByName(name: string) {
  return knowledgeCategories.find((category) => category.name === name);
}

export function getKnowledgeCategoryById(id: string) {
  return knowledgeCategories.find((category) => category.id === id);
}

export function getAllKnowledgeAreaNames() {
  return knowledgeCategories.map((category) => category.name);
}

export function getAllSubCategoryNames() {
  return knowledgeCategories.flatMap((category) =>
    category.children.map((child) => child.name),
  );
}
