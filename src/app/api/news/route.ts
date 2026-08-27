import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://www.forexfactory.com/ffcal_week_this.xml",
      { next: { revalidate: 300 } } // cache 5 phút
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, items: [] }, { status: 502 });
    }

    const xmlText = await res.text();

    // Parse XML đơn giản lấy event items
    const items: { title: string; date: string; impact: string; currency: string }[] = [];
    const eventRegex = /<event>[\s\S]*?<\/event>/g;
    const matchEvents = xmlText.match(eventRegex) || [];

    for (const evt of matchEvents.slice(0, 10)) {
      const title = evt.match(/<title>([^<]*)<\/title>/)?.[1] || "";
      const date = evt.match(/<date>([^<]*)<\/date>/)?.[1] || "";
      const impact = evt.match(/<impact>([^<]*)<\/impact>/)?.[1] || "";
      const currency = evt.match(/<currency>([^<]*)<\/currency>/)?.[1] || "";

      // Chỉ lấy sự kiên liên quan USD/Gold
      if (currency === "USD" || title.toLowerCase().includes("gold")) {
        items.push({ title, date, impact, currency });
      }
    }

    return NextResponse.json({ success: true, items: items.slice(0, 5) });
  } catch {
    return NextResponse.json({ success: false, items: [] }, { status: 500 });
  }
}
