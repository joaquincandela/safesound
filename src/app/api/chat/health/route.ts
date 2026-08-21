import { NextResponse } from "next/server";
import { getStorageMode, pingStorage } from "../../../../lib/chat-store";

export async function GET() {
  const storage = getStorageMode();

  if (storage === "file") {
    return NextResponse.json({
      storage,
      ok: false,
      hint: "Configura UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN en Vercel y haz Redeploy.",
    });
  }

  return NextResponse.json({ storage, ...(await pingStorage()) });
}
