import { useEffect } from "react";
import { useLocation } from "react-router";
import { useSiteContent } from "./SiteContentProvider";
import type { SeoPageKey } from "../data/siteContent";

const ROUTE_TO_SEO: Record<string, SeoPageKey> = {
  "/": "home",
  "/lessons": "lessons",
  "/series": "lessons",
  "/lectures": "lectures",
  "/words": "words",
  "/shorts": "shorts",
  "/recitations": "recitations",
  "/schedule": "schedule",
  "/contact": "contact",
};

function setMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

// Applies per-page title/description/robots/OG tags imperatively as the route
// changes. Mounted inside the router (Layout) so it can read the location.
export function SeoManager() {
  const content = useSiteContent();
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = content.seo;
    const key = ROUTE_TO_SEO[pathname];
    const page = key ? seo.pages[key] : undefined;

    const hasTitle = Boolean(page?.title?.trim());
    const title =
      hasTitle && key !== "home"
        ? `${page!.title} — ${seo.siteTitle}`
        : hasTitle
          ? page!.title
          : seo.siteTitle;

    const description = page?.description?.trim()
      ? page.description
      : seo.defaultDescription;

    document.title = title;
    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      seo.allowIndexing
        ? "index, follow"
        : "noindex, nofollow, noarchive, nosnippet",
    );
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
  }, [pathname, content]);

  return null;
}
