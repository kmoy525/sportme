import { NextResponse } from "next/server";

/**
 * TEMPORARY diagnostic route for the Blob env var propagation issue.
 * Never returns actual secret values — only presence/length and key names.
 * Remove once the issue is resolved.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const blobLikeKeys = Object.keys(process.env).filter((k) => k.toUpperCase().includes("BLOB"));

  function describe(name: string) {
    const value = process.env[name];
    return {
      present: value !== undefined,
      length: value?.length ?? 0,
      startsWithVercelBlobPrefix: value?.startsWith("vercel_blob_rw_") ?? false,
    };
  }

  // Cast a wide net: find ANY env var whose value looks like a Blob
  // read-write token, regardless of what its key is named.
  const looksLikeBlobToken = Object.entries(process.env)
    .filter(([, v]) => typeof v === "string" && v.startsWith("vercel_blob_rw_"))
    .map(([k]) => k);

  return NextResponse.json({
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    blobLikeEnvKeys: blobLikeKeys,
    looksLikeBlobToken,
    allEnvKeys: Object.keys(process.env).sort(),
    BLOB_READ_WRITE_TOKEN: describe("BLOB_READ_WRITE_TOKEN"),
    SPORTME_PROPICS_BLOB_READ_WRITE_TOKEN: describe("SPORTME_PROPICS_BLOB_READ_WRITE_TOKEN"),
  });
}
