import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultSiteContent,
  mergeSiteContent,
  type SiteContent,
} from "../data/siteContent";
import { siteContentApi } from "../lib/siteContentApi";

const SiteContentContext = createContext<SiteContent>(defaultSiteContent);

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}

// True when the site is rendered inside the admin live-preview iframe.
function detectPreview(): boolean {
  if (typeof window === "undefined") return false;
  return (
    new URLSearchParams(window.location.search).get("previewContent") === "1"
  );
}

function applyTheme(content: SiteContent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const c = content.theme.colors;
  const vars: Record<string, string> = {
    "--color-islamic-green": c.green,
    "--color-islamic-green-light": c.greenLight,
    "--color-islamic-green-dark": c.greenDark,
    "--color-islamic-gold": c.gold,
    "--color-islamic-gold-light": c.goldLight,
    "--color-islamic-ivory": c.ivory,
    "--color-islamic-gray": c.gray,
    "--color-islamic-text": c.text,
    "--font-sans": content.theme.fonts.sans,
    "--font-serif": content.theme.fonts.serif,
  };
  for (const [key, value] of Object.entries(vars)) {
    if (value) root.style.setProperty(key, value);
  }
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const isPreview = useMemo(detectPreview, []);
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);

  // Load the document: draft in preview mode, published otherwise.
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        if (isPreview) {
          const res = await siteContentApi.getAdmin();
          if (active) setContent(mergeSiteContent(res.draft));
        } else {
          const res = await siteContentApi.getPublished();
          if (active) setContent(mergeSiteContent(res.content));
        }
      } catch {
        // Network/auth failure: keep built-in defaults so the site still works.
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [isPreview]);

  // In preview mode, highlight click-to-edit text regions.
  useEffect(() => {
    if (!isPreview || typeof document === "undefined") return;
    const style = document.createElement("style");
    style.textContent = `
      [data-edit-path] { cursor: text; transition: outline 0.15s, background 0.15s; border-radius: 2px; }
      [data-edit-path]:hover { outline: 2px dashed var(--color-islamic-gold, #c5a059); outline-offset: 2px; background: rgba(197,160,89,0.08); }
      [data-edit-path]:focus { outline: 2px solid var(--color-islamic-gold, #c5a059); outline-offset: 2px; background: rgba(197,160,89,0.12); }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, [isPreview]);

  // In preview mode, accept live updates pushed by the editor (no reload).
  useEffect(() => {
    if (!isPreview || typeof window === "undefined") return;
    function onMessage(event: MessageEvent) {
      const data = event.data as { type?: string; content?: unknown };
      if (data?.type === "site-content-preview" && data.content) {
        setContent(mergeSiteContent(data.content));
      }
    }
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "site-content-preview-ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, [isPreview]);

  useEffect(() => {
    applyTheme(content);
  }, [content]);

  return (
    <SiteContentContext.Provider value={content}>
      {children}
    </SiteContentContext.Provider>
  );
}
