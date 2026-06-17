import { randomBytes } from "node:crypto";
import { Client } from "@replit/object-storage";

// The Replit Object Storage client auto-discovers the default bucket from the
// environment. Instantiated lazily so importing this module never throws when
// storage isn't configured (e.g. local dev without a bucket).
let client: Client | null = null;
function getClient(): Client {
  if (!client) client = new Client();
  return client;
}

const MIME_TO_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

export function extForMime(mime: string): string | null {
  return MIME_TO_EXT[mime.toLowerCase()] ?? null;
}

export function mimeForName(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}

// Object names are flat and restricted to a safe charset (no slashes), so the
// public serve route can match them with a single path segment.
const SAFE_NAME = /^[A-Za-z0-9._-]+$/;

export function isSafeObjectName(name: string): boolean {
  return SAFE_NAME.test(name) && !name.includes("..");
}

function errorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "STORAGE_ERROR";
}

export async function uploadImage(
  buffer: Buffer,
  mime: string,
): Promise<string> {
  const ext = extForMime(mime);
  if (!ext) throw new Error("UNSUPPORTED_TYPE");

  const name = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const result = await getClient().uploadFromBytes(name, buffer);
  if (!result.ok) throw new Error(errorMessage(result.error));
  return name;
}

export async function downloadImage(
  name: string,
): Promise<{ buffer: Buffer; mime: string } | null> {
  const result = await getClient().downloadAsBytes(name);
  if (!result.ok) return null;
  return { buffer: result.value[0], mime: mimeForName(name) };
}

// Lists stored image objects (newest first; non-image objects are ignored).
export async function listImages(): Promise<string[]> {
  const result = await getClient().list();
  if (!result.ok) throw new Error(errorMessage(result.error));
  return result.value
    .map((object) => object.name)
    .filter((name) => mimeForName(name) !== "application/octet-stream")
    .sort((a, b) => b.localeCompare(a));
}

export async function deleteImage(name: string): Promise<void> {
  const result = await getClient().delete(name);
  if (!result.ok) throw new Error(errorMessage(result.error));
}
