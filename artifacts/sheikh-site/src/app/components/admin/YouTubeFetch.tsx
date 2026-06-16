import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { adminApi, ApiError, type YouTubeMeta } from "../../lib/adminApi";

type Props = {
  url: string;
  type?: "video" | "playlist";
  onFill: (meta: YouTubeMeta) => void;
};

// Reusable "fetch metadata from YouTube" button. Drop into any form that has a
// YouTube URL field; the parent maps the returned metadata onto its own fields.
export function YouTubeFetch({ url, type, onFill }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<
    { kind: "ok" | "error"; text: string } | null
  >(null);

  async function handleFetch() {
    if (!url.trim()) {
      setMessage({ kind: "error", text: "أدخل الرابط أولاً." });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await adminApi.getYoutubeMeta(url.trim(), type);
      onFill(result.meta);
      setMessage({
        kind: "ok",
        text:
          result.meta.source === "oembed"
            ? "تم الجلب (المدة غير متاحة — أضف مفتاح YouTube API لجلبها)."
            : "تم جلب البيانات بنجاح.",
      });
    } catch (error) {
      setMessage({
        kind: "error",
        text:
          error instanceof ApiError ? error.message : "تعذّر جلب البيانات.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleFetch}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-islamic-green)] bg-[var(--color-islamic-green)]/5 px-3 py-1.5 text-sm font-bold text-[var(--color-islamic-green)] transition-colors hover:bg-[var(--color-islamic-green)]/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        جلب البيانات من الرابط
      </button>

      {message && (
        <span
          className={`text-xs ${
            message.kind === "ok" ? "text-green-700" : "text-red-600"
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}
