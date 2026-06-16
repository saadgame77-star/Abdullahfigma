// YouTube metadata helpers. Works in two modes:
//  - With YOUTUBE_API_KEY: full data via YouTube Data API v3 (title, channel,
//    duration, publish date, thumbnail; playlist item count).
//  - Without a key: graceful fallback via public oEmbed (title, channel,
//    thumbnail) for single videos. Duration is unavailable without a key.

export type YouTubeKind = "video" | "playlist";

export type YouTubeMeta = {
  kind: YouTubeKind;
  videoId: string | null;
  playlistId: string | null;
  title: string | null;
  channel: string | null;
  durationSeconds: number | null;
  duration: string | null; // human readable e.g. "1:12:05"
  videoCount: number | null; // for playlists
  publishedAt: string | null; // ISO date
  thumbnailUrl: string | null;
  source: "youtube-api" | "oembed";
};

export function extractYouTubeIds(rawUrl: string): {
  videoId: string | null;
  playlistId: string | null;
} {
  let videoId: string | null = null;
  let playlistId: string | null = null;

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2] ?? null;
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/")[2] ?? null;
      } else if (url.pathname.startsWith("/live/")) {
        videoId = url.pathname.split("/")[2] ?? null;
      }
      playlistId = url.searchParams.get("list");
    }
  } catch {
    // Not a URL — maybe a bare id.
    const trimmed = rawUrl.trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) videoId = trimmed;
    else if (/^PL[A-Za-z0-9_-]+$/.test(trimmed)) playlistId = trimmed;
  }

  return { videoId, playlistId };
}

// Parses ISO 8601 duration (e.g. PT1H12M5S) into seconds.
export function parseIso8601Duration(iso: string): number {
  const match = /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, d, h, m, s] = match;
  return (
    (Number(d) || 0) * 86400 +
    (Number(h) || 0) * 3600 +
    (Number(m) || 0) * 60 +
    (Number(s) || 0)
  );
}

export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) return "";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

async function fetchJson(url: string, timeoutMs = 8000): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function pickThumbnail(thumbnails: unknown): string | null {
  if (!thumbnails || typeof thumbnails !== "object") return null;
  const t = thumbnails as Record<string, { url?: string } | undefined>;
  return (
    t.maxres?.url ??
    t.standard?.url ??
    t.high?.url ??
    t.medium?.url ??
    t.default?.url ??
    null
  );
}

async function fetchVideoViaApi(
  videoId: string,
  apiKey: string,
): Promise<YouTubeMeta | null> {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${encodeURIComponent(
    videoId,
  )}&key=${encodeURIComponent(apiKey)}`;
  const data = (await fetchJson(url)) as {
    items?: Array<{
      snippet?: {
        title?: string;
        channelTitle?: string;
        publishedAt?: string;
        thumbnails?: unknown;
      };
      contentDetails?: { duration?: string };
    }>;
  };

  const item = data.items?.[0];
  if (!item) return null;

  const seconds = item.contentDetails?.duration
    ? parseIso8601Duration(item.contentDetails.duration)
    : 0;

  return {
    kind: "video",
    videoId,
    playlistId: null,
    title: item.snippet?.title ?? null,
    channel: item.snippet?.channelTitle ?? null,
    durationSeconds: seconds || null,
    duration: seconds ? formatDuration(seconds) : null,
    videoCount: null,
    publishedAt: item.snippet?.publishedAt ?? null,
    thumbnailUrl:
      pickThumbnail(item.snippet?.thumbnails) ??
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    source: "youtube-api",
  };
}

async function fetchPlaylistViaApi(
  playlistId: string,
  apiKey: string,
): Promise<YouTubeMeta | null> {
  const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${encodeURIComponent(
    playlistId,
  )}&key=${encodeURIComponent(apiKey)}`;
  const data = (await fetchJson(url)) as {
    items?: Array<{
      snippet?: { title?: string; channelTitle?: string; thumbnails?: unknown };
      contentDetails?: { itemCount?: number };
    }>;
  };

  const item = data.items?.[0];
  if (!item) return null;

  return {
    kind: "playlist",
    videoId: null,
    playlistId,
    title: item.snippet?.title ?? null,
    channel: item.snippet?.channelTitle ?? null,
    durationSeconds: null,
    duration: null,
    videoCount: item.contentDetails?.itemCount ?? null,
    publishedAt: null,
    thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
    source: "youtube-api",
  };
}

async function fetchViaOEmbed(rawUrl: string): Promise<YouTubeMeta | null> {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    rawUrl,
  )}&format=json`;
  const data = (await fetchJson(url)) as {
    title?: string;
    author_name?: string;
    thumbnail_url?: string;
  };

  const { videoId, playlistId } = extractYouTubeIds(rawUrl);

  return {
    kind: playlistId && !videoId ? "playlist" : "video",
    videoId,
    playlistId,
    title: data.title ?? null,
    channel: data.author_name ?? null,
    durationSeconds: null,
    duration: null,
    videoCount: null,
    publishedAt: null,
    thumbnailUrl:
      data.thumbnail_url ??
      (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null),
    source: "oembed",
  };
}

/**
 * Fetches normalized metadata for a YouTube URL.
 * `preferred` lets callers force video vs playlist when a URL contains both.
 */
export async function fetchYouTubeMeta(
  rawUrl: string,
  preferred?: YouTubeKind,
): Promise<YouTubeMeta | null> {
  const { videoId, playlistId } = extractYouTubeIds(rawUrl);
  const apiKey = process.env.YOUTUBE_API_KEY;

  const wantPlaylist =
    preferred === "playlist" || (!videoId && Boolean(playlistId));

  if (apiKey) {
    if (wantPlaylist && playlistId) {
      const meta = await fetchPlaylistViaApi(playlistId, apiKey);
      if (meta) return meta;
    }
    if (videoId) {
      const meta = await fetchVideoViaApi(videoId, apiKey);
      if (meta) return meta;
    }
    if (playlistId) {
      const meta = await fetchPlaylistViaApi(playlistId, apiKey);
      if (meta) return meta;
    }
  }

  // Fallback: oEmbed (works for single videos without a key).
  try {
    return await fetchViaOEmbed(rawUrl);
  } catch {
    return null;
  }
}
