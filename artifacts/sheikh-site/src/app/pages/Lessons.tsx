import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Filter,
  Library,
  ListVideo,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

type TrustLevel = "عالٍ" | "متوسط";
type CompletionStatus = "مكتملة" | "غير مكتملة";

type ScientificSeries = {
  id: number;
  title: string;
  channel: string;
  count: string;
  category: string;
  section: string;
  playlistId: string;
  url: string;
  trust: TrustLevel;
  status: CompletionStatus;
  note?: string;
};

export function Lessons() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [activeStatus, setActiveStatus] = useState("الكل");

  const scientificSeries: ScientificSeries[] = [
    {
      id: 1,
      title: "التعليق على الملخص الفقهي من كتاب القضاء",
      channel: "إبراهيم بن عبدالله الشرافي",
      count: "2 فيديو",
      category: "فقه / القضاء",
      section: "الشروح العلمية",
      playlistId: "PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
      url: "https://www.youtube.com/playlist?list=PL28xdVEzaSCAH7OP2ObngNoUpJ1Mxl_eq",
      trust: "عالٍ",
      status: "مكتملة",
    },
    {
      id: 2,
      title: "التعليق على تفسير البغوي",
      channel: "إبراهيم بن عبدالله الشرافي",
      count: "غير محدد",
      category: "تفسير",
      section: "الشروح العلمية / التفسير",
      playlistId: "PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
      url: "https://m.youtube.com/playlist?list=PL28xdVEzaSCA1wsUQ4uLmPWFZ7k-9cSrU",
      trust: "عالٍ",
      status: "غير مكتملة",
      note: "ظهرت منها مقاطع في سورة يوسف.",
    },
    {
      id: 3,
      title: "شرح المحرر",
      channel: "قناة السنة الدعوية / الشيخ محمد بن مبارك الشرافي",
      count: "8 فيديو في نتيجة القائمة",
      category: "حديث",
      section: "الشروح العلمية / الحديث",
      playlistId: "PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
      url: "https://m.youtube.com/playlist?list=PL_Q00zrSooq8waFXBQdY8NC-ov2bqlLTa",
      trust: "عالٍ",
      status: "غير مكتملة",
      note: "قد توجد حلقات أخرى منفردة خارج القائمة.",
    },
    {
      id: 4,
      title: "الشرح المختصر لكتاب عمدة الأحكام / الشيخ عبدالله الغلفيص",
      channel: "الشيخ محمد بن مبارك الشرافي",
      count: "غير محدد",
      category: "حديث / فقه",
      section: "الشروح العلمية / الحديث",
      playlistId: "PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
      url: "https://www.youtube.com/playlist?list=PLWQYsha9_xM7Tja50Ohk1Frso9JDOK8fa",
      trust: "عالٍ",
      status: "غير مكتملة",
    },
    {
      id: 5,
      title: "التعليق على المنظومة الميمية للحافظ بن أحمد حكمي",
      channel: "عبدالله بن سعد آل غلفيص / الشيخ محمد الشرافي",
      count: "غير محدد",
      category: "آداب العلم / وصايا",
      section: "الشروح العلمية",
      playlistId: "PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
      url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWamKf-gWF7nBAxa6EGe4Lx",
      trust: "عالٍ",
      status: "غير مكتملة",
    },
    {
      id: 6,
      title: "التعليق على كتاب العلم",
      channel: "عبدالله بن سعد آل غلفيص",
      count: "7 فيديو",
      category: "آداب طلب العلم",
      section: "الشروح العلمية",
      playlistId: "PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
      url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urWquDwXCELU_mdcJEgn2MoK",
      trust: "عالٍ",
      status: "مكتملة",
    },
    {
      id: 7,
      title: "التعليق على تفسير البغوي",
      channel: "عبدالله بن سعد آل غلفيص",
      count: "15 فيديو",
      category: "تفسير",
      section: "الشروح العلمية / التفسير",
      playlistId: "PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
      url: "https://www.youtube.com/playlist?list=PLGMk6zGE-urVbxaRdViZaKhRvbNNLKGGa",
      trust: "عالٍ",
      status: "غير مكتملة",
    },
  ];

  const categories = ["الكل", "تفسير", "حديث", "فقه", "آداب العلم"];
  const statuses = ["الكل", "مكتملة", "غير مكتملة"];

  const filteredSeries = useMemo(() => {
    return scientificSeries.filter((series) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        series.title.includes(searchTerm) ||
        series.channel.includes(searchTerm) ||
        series.category.includes(searchTerm);

      const matchesCategory =
        activeCategory === "الكل" || series.category.includes(activeCategory);

      const matchesStatus =
        activeStatus === "الكل" || series.status === activeStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [activeCategory, activeStatus, searchTerm]);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-4xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
          الدروس العلمية
        </h1>
        <div className="w-24 h-1 bg-[var(--color-islamic-gold)] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          مكتبة شاملة للدروس المنهجية والشروح العلمية، تجمع السلاسل العلمية
          وقوائم التشغيل في صفحة واحدة منظمة لتسهيل طلب العلم.
        </p>
      </div>

      <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-10 flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="البحث في الدروس والشروح..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-sm py-3 px-4 pr-12 focus:outline-none focus:border-[var(--color-islamic-gold)] focus:ring-1 focus:ring-[var(--color-islamic-gold)] transition-all"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <Filter className="w-4 h-4" />
            تصفية حسب الباب:
          </div>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 ml-2">
            <CheckCircle2 className="w-4 h-4" />
            حالة السلسلة:
          </div>

          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                activeStatus === status
                  ? "bg-[var(--color-islamic-green)] text-white"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <section className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b-2 border-gray-200 pb-4">
          <div>
            <span className="text-[var(--color-islamic-gold)] font-serif text-xl block mb-2">
              السلاسل والشروح
            </span>
            <h2 className="font-serif text-3xl text-[var(--color-islamic-green-dark)] font-bold">
              قوائم تشغيل علمية مضمّنة
            </h2>
          </div>
          <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
            يتم عرض قوائم التشغيل داخل الصفحة مباشرة، مع إمكانية استعراض السلاسل
            المكتملة أو غير المكتملة وتصفيتها حسب الباب العلمي.
          </p>
        </div>

        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredSeries.map((series) => (
              <article
                key={series.id}
                className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="aspect-video bg-gray-900">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/videoseries?list=${series.playlistId}`}
                    title={series.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-[var(--color-islamic-green)] text-white font-medium">
                      <Library className="w-3 h-3" />
                      {series.section}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-gray-100 text-gray-700 font-medium">
                      <ListVideo className="w-3 h-3" />
                      {series.count}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm font-bold ${
                        series.status === "مكتملة"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {series.status}
                    </span>

                    {series.trust === "متوسط" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-amber-100 text-amber-800 font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        بحاجة تحقق
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-sm bg-green-100 text-green-800 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        موثوق
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-gray-800 leading-relaxed mb-3 group-hover:text-[var(--color-islamic-green)] transition-colors">
                    {series.title}
                  </h3>

                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    <p>
                      <span className="font-bold text-gray-700">القناة: </span>
                      {series.channel}
                    </p>
                    <p>
                      <span className="font-bold text-gray-700">
                        باب العلم:{" "}
                      </span>
                      {series.category}
                    </p>
                    {series.note && (
                      <p className="leading-relaxed text-gray-500 border-r-2 border-[var(--color-islamic-gold)] pr-3">
                        {series.note}
                      </p>
                    )}
                  </div>

                  <a
                    href={series.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 bg-white border border-[var(--color-islamic-green)] text-[var(--color-islamic-green)] px-4 py-2 rounded-sm hover:bg-[var(--color-islamic-green)] hover:text-white transition-colors font-medium text-sm"
                  >
                    فتح القائمة في يوتيوب
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-sm p-8 text-center text-gray-500">
            لا توجد نتائج مطابقة للبحث أو التصنيف المحدد.
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-sm p-8 shadow-sm">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[var(--color-islamic-gold)] font-serif text-xl mb-3">
            <ListVideo className="w-5 h-5" />
            الدروس المفردة
          </span>
          <h2 className="font-serif text-3xl text-[var(--color-islamic-green-dark)] font-bold mb-4">
            سيتم تنظيم الدروس المفردة في المرحلة التالية
          </h2>
          <p className="text-gray-600 leading-relaxed">
            بعد تثبيت السلاسل العلمية داخل هذه الصفحة، سنضيف المقاطع المفردة من
            الفهرس ونرتبها حسب الكتاب أو الباب العلمي أو التصنيف المناسب.
          </p>
        </div>
      </section>
    </div>
  );
}
