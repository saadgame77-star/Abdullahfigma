import {
  ChevronDown,
  Eye,
  GripVertical,
  History,
  Loader2,
  Plus,
  RefreshCw,
  Rocket,
  Save,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSiteContent,
  mergeSiteContent,
  type HomeSection,
  type NavLink,
  type SiteContent,
} from "../../data/siteContent";
import {
  siteContentApi,
  type SiteContentVersion,
} from "../../lib/siteContentApi";

type Feedback = { type: "success" | "error"; message: string };

const PREVIEW_SRC = "/?previewContent=1";

const COLOR_FIELDS: { key: keyof SiteContent["theme"]["colors"]; label: string }[] =
  [
    { key: "green", label: "الأخضر الأساسي" },
    { key: "greenLight", label: "الأخضر الفاتح" },
    { key: "greenDark", label: "الأخضر الداكن" },
    { key: "gold", label: "الذهبي" },
    { key: "goldLight", label: "الذهبي الفاتح" },
    { key: "ivory", label: "العاجي (الخلفية)" },
    { key: "gray", label: "الرمادي" },
    { key: "text", label: "لون النص" },
  ];

export function SiteContentManager() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [versions, setVersions] = useState<SiteContentVersion[]>([]);
  const [versionsOpen, setVersionsOpen] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const previewReady = useRef(false);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFeedback = useCallback((next: Feedback) => {
    setFeedback(next);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 4000);
  }, []);

  // Initial load: edit the working draft.
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await siteContentApi.getAdmin();
        if (!active) return;
        setContent(mergeSiteContent(res.draft));
        setPublishedAt(res.publishedAt);
      } catch {
        if (active)
          showFeedback({ type: "error", message: "تعذر تحميل محتوى الموقع." });
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [showFeedback]);

  // Push live edits into the preview iframe.
  const pushPreview = useCallback((next: SiteContent) => {
    if (!previewReady.current) return;
    iframeRef.current?.contentWindow?.postMessage(
      { type: "site-content-preview", content: next },
      "*",
    );
  }, []);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if ((event.data as { type?: string })?.type === "site-content-preview-ready") {
        previewReady.current = true;
        pushPreview(content);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [content, pushPreview]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  // Immutable update helper.
  const edit = useCallback(
    (mutate: (draft: SiteContent) => void) => {
      setContent((prev) => {
        const next = structuredClone(prev);
        mutate(next);
        pushPreview(next);
        return next;
      });
    },
    [pushPreview],
  );

  async function handleSave() {
    setSaving(true);
    try {
      await siteContentApi.saveDraft(content);
      showFeedback({ type: "success", message: "تم حفظ المسودة." });
    } catch {
      showFeedback({ type: "error", message: "تعذر حفظ المسودة." });
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setPublishing(true);
    try {
      // Always persist the on-screen draft before publishing it.
      await siteContentApi.saveDraft(content);
      const res = await siteContentApi.publish();
      setPublishedAt(res.publishedAt);
      showFeedback({ type: "success", message: "تم نشر المحتوى للجمهور." });
    } catch {
      showFeedback({ type: "error", message: "تعذر نشر المحتوى." });
    } finally {
      setPublishing(false);
    }
  }

  async function loadVersions() {
    try {
      const res = await siteContentApi.listVersions();
      setVersions(res.items);
    } catch {
      showFeedback({ type: "error", message: "تعذر تحميل سجل النسخ." });
    }
  }

  async function handleToggleVersions() {
    const next = !versionsOpen;
    setVersionsOpen(next);
    if (next) await loadVersions();
  }

  async function handleRestore(id: string) {
    try {
      const res = await siteContentApi.restoreVersion(id);
      const restored = mergeSiteContent(res.draft);
      setContent(restored);
      pushPreview(restored);
      showFeedback({
        type: "success",
        message: "تم استرجاع النسخة إلى المسودة. عاينها ثم انشرها.",
      });
    } catch {
      showFeedback({ type: "error", message: "تعذر استرجاع النسخة." });
    }
  }

  function refreshPreview() {
    previewReady.current = false;
    if (iframeRef.current) iframeRef.current.src = PREVIEW_SRC;
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--color-islamic-gold)]" />
        <p className="mt-2">جارٍ تحميل محتوى الموقع...</p>
      </div>
    );
  }

  return (
    <section className="p-5">
      {feedback && (
        <div
          className={`mb-4 rounded-sm border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-green-100 bg-green-50 text-green-800"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Action bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gray-200 bg-white p-4">
        <div className="text-sm text-gray-500">
          {publishedAt
            ? `آخر نشر: ${new Date(publishedAt).toLocaleString("ar")}`
            : "لم يُنشر بعد — تظهر القيم الافتراضية للجمهور."}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleVersions}
            className="inline-flex items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <History className="h-4 w-4" />
            سجل النسخ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-islamic-green)] bg-white px-4 py-2 text-sm font-bold text-[var(--color-islamic-green)] hover:bg-gray-50 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            حفظ المسودة
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishing}
            className="inline-flex items-center gap-2 rounded-sm bg-[var(--color-islamic-green)] px-4 py-2 text-sm font-bold text-white hover:bg-[var(--color-islamic-green-dark)] disabled:opacity-60"
          >
            {publishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            نشر
          </button>
        </div>
      </div>

      {versionsOpen && (
        <div className="mb-5 rounded-sm border border-gray-200 bg-white p-4">
          <h3 className="mb-3 font-bold text-gray-700">سجل النسخ المنشورة</h3>
          {versions.length === 0 ? (
            <p className="text-sm text-gray-400">لا توجد نسخ بعد.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {versions.map((version) => (
                <li
                  key={version.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="text-gray-600">
                    {new Date(version.createdAt).toLocaleString("ar")}
                    {version.label ? ` — ${version.label}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRestore(version.id)}
                    className="rounded-sm border border-gray-200 px-3 py-1 text-xs font-bold text-[var(--color-islamic-green)] hover:bg-gray-50"
                  >
                    استرجاع
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Editor */}
        <div className="space-y-3">
          <Group title="المظهر — الألوان والخطوط" defaultOpen>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COLOR_FIELDS.map((field) => (
                <ColorField
                  key={field.key}
                  label={field.label}
                  value={content.theme.colors[field.key]}
                  onChange={(value) =>
                    edit((d) => {
                      d.theme.colors[field.key] = value;
                    })
                  }
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TextField
                label="الخط الأساسي (sans)"
                value={content.theme.fonts.sans}
                onChange={(v) => edit((d) => (d.theme.fonts.sans = v))}
              />
              <TextField
                label="خط العناوين (serif)"
                value={content.theme.fonts.serif}
                onChange={(v) => edit((d) => (d.theme.fonts.serif = v))}
              />
            </div>
          </Group>

          <Group title="العلامة (الترويسة)">
            <TextField
              label="حرف/رمز الشعار"
              value={content.brand.logoText}
              onChange={(v) => edit((d) => (d.brand.logoText = v))}
            />
            <TextField
              label="السطر العلوي"
              value={content.brand.siteSubtitle}
              onChange={(v) => edit((d) => (d.brand.siteSubtitle = v))}
            />
            <TextField
              label="اسم الموقع/الشيخ"
              value={content.brand.siteTitle}
              onChange={(v) => edit((d) => (d.brand.siteTitle = v))}
            />
          </Group>

          <Group title="قائمة التنقل">
            <LinkListEditor
              items={content.nav.items}
              onChange={(items) => edit((d) => (d.nav.items = items))}
            />
          </Group>

          <Group title="الصفحة الرئيسية">
            <SubTitle>القسم العلوي (Hero)</SubTitle>
            <TextField
              label="السطر التمهيدي"
              value={content.pages.home.hero.eyebrow}
              onChange={(v) => edit((d) => (d.pages.home.hero.eyebrow = v))}
            />
            <TextField
              label="العنوان — السطر الأول"
              value={content.pages.home.hero.titleLine1}
              onChange={(v) => edit((d) => (d.pages.home.hero.titleLine1 = v))}
            />
            <TextField
              label="العنوان — السطر الثاني"
              value={content.pages.home.hero.titleLine2}
              onChange={(v) => edit((d) => (d.pages.home.hero.titleLine2 = v))}
            />
            <TextArea
              label="النص التعريفي"
              value={content.pages.home.hero.subtitle}
              onChange={(v) => edit((d) => (d.pages.home.hero.subtitle = v))}
            />

            <SubTitle>قسم أحدث المحتوى</SubTitle>
            <TextField
              label="السطر التمهيدي"
              value={content.pages.home.latest.eyebrow}
              onChange={(v) => edit((d) => (d.pages.home.latest.eyebrow = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.home.latest.heading}
              onChange={(v) => edit((d) => (d.pages.home.latest.heading = v))}
            />
            <TextField
              label="رابط (تصفّح البقية)"
              value={content.pages.home.latest.browseAll}
              onChange={(v) => edit((d) => (d.pages.home.latest.browseAll = v))}
            />
            <TextField
              label="نص الحالة الفارغة"
              value={content.pages.home.latest.empty}
              onChange={(v) => edit((d) => (d.pages.home.latest.empty = v))}
            />

            <SubTitle>قسم المقاطع القصيرة</SubTitle>
            <TextField
              label="السطر التمهيدي"
              value={content.pages.home.shorts.eyebrow}
              onChange={(v) => edit((d) => (d.pages.home.shorts.eyebrow = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.home.shorts.heading}
              onChange={(v) => edit((d) => (d.pages.home.shorts.heading = v))}
            />

            <SubTitle>قسم الإحصاءات</SubTitle>
            <TextField
              label="السطر التمهيدي"
              value={content.pages.home.stats.eyebrow}
              onChange={(v) => edit((d) => (d.pages.home.stats.eyebrow = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.home.stats.title}
              onChange={(v) => edit((d) => (d.pages.home.stats.title = v))}
            />

            <SubTitle>ترتيب وإظهار الأقسام</SubTitle>
            <HomeSectionsEditor
              items={content.pages.home.sections}
              onChange={(items) => edit((d) => (d.pages.home.sections = items))}
            />
          </Group>

          <Group title="صفحة: الدروس العلمية">
            <TextField
              label="الشارة"
              value={content.pages.lessons.badge}
              onChange={(v) => edit((d) => (d.pages.lessons.badge = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.lessons.title}
              onChange={(v) => edit((d) => (d.pages.lessons.title = v))}
            />
            <TextArea
              label="الوصف"
              value={content.pages.lessons.description}
              onChange={(v) => edit((d) => (d.pages.lessons.description = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.lessons.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.lessons.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: المحاضرات">
            <TextField
              label="الشارة"
              value={content.pages.lectures.badge}
              onChange={(v) => edit((d) => (d.pages.lectures.badge = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.lectures.title}
              onChange={(v) => edit((d) => (d.pages.lectures.title = v))}
            />
            <TextArea
              label="الوصف"
              value={content.pages.lectures.description}
              onChange={(v) => edit((d) => (d.pages.lectures.description = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.lectures.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.lectures.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: الكلمات الدعوية">
            <TextField
              label="الشارة"
              value={content.pages.words.badge}
              onChange={(v) => edit((d) => (d.pages.words.badge = v))}
            />
            <TextField
              label="العنوان"
              value={content.pages.words.title}
              onChange={(v) => edit((d) => (d.pages.words.title = v))}
            />
            <TextArea
              label="الوصف"
              value={content.pages.words.description}
              onChange={(v) => edit((d) => (d.pages.words.description = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.words.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.words.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: المقاطع القصيرة">
            <TextField
              label="العنوان"
              value={content.pages.shorts.title}
              onChange={(v) => edit((d) => (d.pages.shorts.title = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.shorts.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.shorts.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: المتفرقات">
            <TextField
              label="العنوان"
              value={content.pages.recitations.title}
              onChange={(v) => edit((d) => (d.pages.recitations.title = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.recitations.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.recitations.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: الجدول">
            <TextField
              label="العنوان"
              value={content.pages.schedule.title}
              onChange={(v) => edit((d) => (d.pages.schedule.title = v))}
            />
            <TextField
              label="نص حقل البحث"
              value={content.pages.schedule.searchPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.schedule.searchPlaceholder = v))
              }
            />
          </Group>

          <Group title="صفحة: تواصل معنا">
            <TextField
              label="العنوان"
              value={content.pages.contact.title}
              onChange={(v) => edit((d) => (d.pages.contact.title = v))}
            />
            <TextArea
              label="المقدمة"
              value={content.pages.contact.intro}
              onChange={(v) => edit((d) => (d.pages.contact.intro = v))}
            />

            <SubTitle>التنبيه</SubTitle>
            <TextField
              label="عنوان التنبيه"
              value={content.pages.contact.warningTitle}
              onChange={(v) => edit((d) => (d.pages.contact.warningTitle = v))}
            />
            <TextArea
              label="نص التنبيه"
              value={content.pages.contact.warningMessage}
              onChange={(v) =>
                edit((d) => (d.pages.contact.warningMessage = v))
              }
            />

            <SubTitle>القنوات الرسمية</SubTitle>
            <TextField
              label="العنوان"
              value={content.pages.contact.channelsTitle}
              onChange={(v) => edit((d) => (d.pages.contact.channelsTitle = v))}
            />
            <TextField
              label="العنوان الفرعي"
              value={content.pages.contact.channelsSubtitle}
              onChange={(v) =>
                edit((d) => (d.pages.contact.channelsSubtitle = v))
              }
            />
            <TextField
              label="عنوان الحالة الفارغة"
              value={content.pages.contact.channelsEmptyTitle}
              onChange={(v) =>
                edit((d) => (d.pages.contact.channelsEmptyTitle = v))
              }
            />
            <TextArea
              label="نص الحالة الفارغة"
              value={content.pages.contact.channelsEmptyMessage}
              onChange={(v) =>
                edit((d) => (d.pages.contact.channelsEmptyMessage = v))
              }
            />

            <SubTitle>إرشادات قبل الإرسال</SubTitle>
            <TextField
              label="عنوان الإرشادات"
              value={content.pages.contact.tipsTitle}
              onChange={(v) => edit((d) => (d.pages.contact.tipsTitle = v))}
            />
            <StringListEditor
              items={content.pages.contact.tips}
              onChange={(items) => edit((d) => (d.pages.contact.tips = items))}
            />

            <SubTitle>نموذج الإرسال</SubTitle>
            <TextField
              label="عنوان النموذج"
              value={content.pages.contact.formTitle}
              onChange={(v) => edit((d) => (d.pages.contact.formTitle = v))}
            />
            <TextField
              label="العنوان الفرعي للنموذج"
              value={content.pages.contact.formSubtitle}
              onChange={(v) => edit((d) => (d.pages.contact.formSubtitle = v))}
            />
            <TextField
              label="تسمية الاسم"
              value={content.pages.contact.nameLabel}
              onChange={(v) => edit((d) => (d.pages.contact.nameLabel = v))}
            />
            <TextField
              label="تسمية البريد"
              value={content.pages.contact.emailLabel}
              onChange={(v) => edit((d) => (d.pages.contact.emailLabel = v))}
            />
            <TextField
              label="تسمية نوع الرسالة"
              value={content.pages.contact.typeLabel}
              onChange={(v) => edit((d) => (d.pages.contact.typeLabel = v))}
            />
            <TextField
              label="تسمية نص الرسالة"
              value={content.pages.contact.messageLabel}
              onChange={(v) => edit((d) => (d.pages.contact.messageLabel = v))}
            />
            <TextField
              label="نص حقول الإدخال المعطّلة"
              value={content.pages.contact.fieldPlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.contact.fieldPlaceholder = v))
              }
            />
            <TextField
              label="نص مربع الرسالة المعطّل"
              value={content.pages.contact.messagePlaceholder}
              onChange={(v) =>
                edit((d) => (d.pages.contact.messagePlaceholder = v))
              }
            />
            <TextField
              label="زر الإرسال"
              value={content.pages.contact.submitLabel}
              onChange={(v) => edit((d) => (d.pages.contact.submitLabel = v))}
            />
            <TextArea
              label="ملاحظة أسفل النموذج"
              value={content.pages.contact.formNote}
              onChange={(v) => edit((d) => (d.pages.contact.formNote = v))}
            />
          </Group>

          <Group title="التذييل">
            <TextField
              label="عنوان التذييل"
              value={content.footer.title}
              onChange={(v) => edit((d) => (d.footer.title = v))}
            />
            <TextArea
              label="الوصف"
              value={content.footer.description}
              onChange={(v) => edit((d) => (d.footer.description = v))}
            />
            <TextField
              label="عنوان الروابط السريعة"
              value={content.footer.quickLinksTitle}
              onChange={(v) => edit((d) => (d.footer.quickLinksTitle = v))}
            />
            <LinkListEditor
              items={content.footer.quickLinks}
              onChange={(items) => edit((d) => (d.footer.quickLinks = items))}
            />
            <TextField
              label="عنوان التواصل"
              value={content.footer.contactTitle}
              onChange={(v) => edit((d) => (d.footer.contactTitle = v))}
            />
            <TextField
              label="رسالة التواصل"
              value={content.footer.contactMessage}
              onChange={(v) => edit((d) => (d.footer.contactMessage = v))}
            />
            <TextField
              label="زر التواصل"
              value={content.footer.contactButton}
              onChange={(v) => edit((d) => (d.footer.contactButton = v))}
            />
            <TextField
              label="حقوق النشر (استخدم {year} للسنة)"
              value={content.footer.copyright}
              onChange={(v) => edit((d) => (d.footer.copyright = v))}
            />
            <TextField
              label="الاقتباس الختامي"
              value={content.footer.quote}
              onChange={(v) => edit((d) => (d.footer.quote = v))}
            />
          </Group>

          <Group title="SEO">
            <TextField
              label="عنوان الموقع (في المتصفح)"
              value={content.seo.siteTitle}
              onChange={(v) => edit((d) => (d.seo.siteTitle = v))}
            />
          </Group>
        </div>

        {/* Live preview */}
        <div className="xl:sticky xl:top-4 xl:self-start">
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-700">
              <Eye className="h-4 w-4" /> معاينة حيّة
            </span>
            <button
              type="button"
              onClick={refreshPreview}
              className="inline-flex items-center gap-1.5 rounded-sm border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              تحديث
            </button>
          </div>
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white">
            <iframe
              ref={iframeRef}
              src={PREVIEW_SRC}
              title="معاينة الموقع"
              className="h-[70vh] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Group({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-sm border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between p-4 text-right font-bold text-[var(--color-islamic-green-dark)]"
      >
        {title}
        <ChevronDown
          className={`h-5 w-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="space-y-3 border-t border-gray-100 p-4">{children}</div>}
    </div>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return (
    <p className="mt-2 border-r-2 border-[var(--color-islamic-gold)] pr-2 text-sm font-bold text-gray-500">
      {children}
    </p>
  );
}

const inputClass =
  "w-full rounded-sm border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[var(--color-islamic-gold)] focus:outline-none focus:ring-1 focus:ring-[var(--color-islamic-gold)]";

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-gray-600">{label}</span>
      <input
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-gray-600">{label}</span>
      <textarea
        className={`${inputClass} min-h-[90px] resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-sm border border-gray-200 bg-white"
        />
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
        />
      </div>
    </label>
  );
}

function LinkListEditor({
  items,
  onChange,
}: {
  items: NavLink[];
  onChange: (items: NavLink[]) => void;
}) {
  function update(index: number, patch: Partial<NavLink>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function add() {
    onChange([...items, { label: "عنصر جديد", href: "/" }]);
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-sm border border-gray-100 bg-gray-50 p-2"
        >
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => move(index, -1)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="أعلى"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="أسفل"
            >
              ▼
            </button>
          </div>
          <GripVertical className="h-4 w-4 shrink-0 text-gray-300" />
          <input
            className={`${inputClass} flex-1`}
            value={item.label}
            placeholder="النص"
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <input
            className={`${inputClass} w-32`}
            value={item.href}
            placeholder="الرابط"
            dir="ltr"
            onChange={(e) => update(index, { href: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="rounded-sm p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-[var(--color-islamic-gold)]"
      >
        <Plus className="h-4 w-4" />
        إضافة رابط
      </button>
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            className={`${inputClass} flex-1`}
            value={item}
            onChange={(e) =>
              onChange(items.map((it, i) => (i === index ? e.target.value : it)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="rounded-sm p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            aria-label="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, "عنصر جديد"])}
        className="inline-flex items-center gap-1.5 rounded-sm border border-dashed border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:border-[var(--color-islamic-gold)]"
      >
        <Plus className="h-4 w-4" />
        إضافة عنصر
      </button>
    </div>
  );
}

const HOME_SECTION_LABELS: Record<string, string> = {
  latest: "أحدث المحتوى",
  shorts: "المقاطع القصيرة",
  stats: "الإحصاءات",
};

function HomeSectionsEditor({
  items,
  onChange,
}: {
  items: HomeSection[];
  onChange: (items: HomeSection[]) => void;
}) {
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function toggle(index: number) {
    onChange(
      items.map((it, i) =>
        i === index ? { ...it, visible: !it.visible } : it,
      ),
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div
          key={item.key}
          className="flex items-center gap-2 rounded-sm border border-gray-100 bg-gray-50 p-2"
        >
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => move(index, -1)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="أعلى"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              className="text-gray-400 hover:text-gray-700"
              aria-label="أسفل"
            >
              ▼
            </button>
          </div>
          <span className="flex-1 text-sm font-medium text-gray-700">
            {HOME_SECTION_LABELS[item.key] ?? item.key}
          </span>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={item.visible}
              onChange={() => toggle(index)}
              className="h-4 w-4 accent-[var(--color-islamic-green)]"
            />
            ظاهر
          </label>
        </div>
      ))}
    </div>
  );
}
