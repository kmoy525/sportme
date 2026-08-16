import "server-only";

import { put } from "@vercel/blob";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/**
 * Vercel auto-connected this project's Blob store under a prefixed variable
 * name (SPORTME_PROPICS_*) because a BLOB_STORE_ID from an earlier store
 * already existed. Fall back to the plain name for anyone who connects a
 * store without a prefix conflict.
 */
function blobToken(): string | undefined {
  return process.env.SPORTME_PROPICS_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;
}

export type PhotoUploadResult =
  | { ok: true; url: string | null }
  | { ok: false; error: string };

/**
 * Uploads a profile photo to Vercel Blob.
 *
 * Photos are optional, so a missing token is not fatal — local dev without a
 * blob store just proceeds without a photo.
 */
export async function uploadProfilePhoto(file: File | null): Promise<PhotoUploadResult> {
  if (!file || file.size === 0) return { ok: true, url: null };

  if (file.size > MAX_BYTES) {
    return { ok: false, error: "That photo is over 6 MB. Pick a smaller one." };
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return { ok: false, error: "Use a JPEG, PNG, or WebP image." };
  }

  const token = blobToken();
  if (!token) {
    return { ok: true, url: null };
  }

  try {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const blob = await put(`profile-photos/${crypto.randomUUID()}.${ext}`, file, {
      access: "public",
      contentType: file.type || "image/jpeg",
      token,
    });
    return { ok: true, url: blob.url };
  } catch {
    return { ok: false, error: "Photo upload failed. Try again, or continue without one." };
  }
}

export function photoStorageConfigured(): boolean {
  return Boolean(blobToken());
}

/** File from FormData, or null when nothing was chosen. */
export function fileFrom(form: FormData, key: string): File | null {
  const value = form.get(key);
  if (value && typeof value === "object" && "size" in value && "name" in value) {
    return value as File;
  }
  return null;
}
