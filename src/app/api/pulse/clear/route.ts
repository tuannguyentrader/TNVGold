import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redisUrl =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL;
const redisToken =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

export async function POST() {
  if (!redis) {
    return NextResponse.json({ success: false, error: "No Redis configured" });
  }

  try {
    await redis.del("tnv:current_pulse");
    await redis.del("tnv:pulse_history");
    return NextResponse.json({ success: true, message: "All pulse data cleared from Redis" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to clear Redis" }, { status: 500 });
  }
}
