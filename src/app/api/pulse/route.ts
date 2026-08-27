import { NextResponse } from "next/server";
import { getLatestPulse, getPulseHistory, updatePulse, type PulseSnapshot } from "@/lib/pulse-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const latest = await getLatestPulse();
  const history = await getPulseHistory();

  return NextResponse.json({
    success: true,
    data: latest,
    history,
    serverTime: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.TNV_SECRET_KEY || "tnv_secret_key_2026";

    // Optional bearer token check
    if (authHeader && authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access token" },
        { status: 401 }
      );
    }

    // Safely parse JSON even if MT5 sends trailing null bytes or whitespace
    const rawText = await request.text();
    const cleanText = rawText.replace(/\0/g, "").trim();

    if (!cleanText) {
      return NextResponse.json(
        { success: false, error: "Empty request body" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(cleanText) as Partial<PulseSnapshot>;

    if (!payload || typeof payload.price !== "number") {
      return NextResponse.json(
        { success: false, error: "Invalid payload format. 'price' number is required." },
        { status: 400 }
      );
    }

    // Merge with current state
    const current = await getLatestPulse();
    const mergedSnapshot: PulseSnapshot = {
      symbol: payload.symbol || current.symbol,
      time: payload.time || new Date().toLocaleTimeString("en-GB", { hour12: false }),
      price: payload.price,
      bias: payload.bias || current.bias,
      score: typeof payload.score === "number" ? payload.score : current.score,
      volatility: typeof payload.volatility === "number" ? payload.volatility : current.volatility,
      entry: {
        high: payload.entry?.high || current.entry.high,
        low: payload.entry?.low || current.entry.low,
        gain: payload.entry?.gain !== undefined ? payload.entry.gain : Number((payload.price - (payload.entry?.high || current.entry.high)).toFixed(2)),
      },
      exit: payload.exit || current.exit,
      htf: payload.htf || current.htf,
      multiTf: {
        m15: payload.multiTf?.m15 || current.multiTf.m15,
        m30: payload.multiTf?.m30 || current.multiTf.m30,
        h1: payload.multiTf?.h1 || current.multiTf.h1,
      },
      indicators: {
        rsi: payload.indicators?.rsi || current.indicators.rsi,
        atr: payload.indicators?.atr || current.indicators.atr,
        emaGap: payload.indicators?.emaGap || current.indicators.emaGap,
        adx: payload.indicators?.adx || current.indicators.adx,
        vwap: payload.indicators?.vwap || current.indicators.vwap,
        spread: payload.indicators?.spread || current.indicators.spread,
      },
      analysisText: payload.analysisText || current.analysisText,
    };

    await updatePulse(mergedSnapshot);

    return NextResponse.json({
      success: true,
      message: "TNV Gold pulse updated successfully",
      data: mergedSnapshot,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
