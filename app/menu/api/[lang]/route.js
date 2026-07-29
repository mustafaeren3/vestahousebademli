import { NextResponse } from "next/server";
import { getMenuForLocale } from "@/lib/menu/queries";
import { LOCALES } from "@/lib/menu/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, { params }) {
  const lang = LOCALES.includes(params.lang) ? params.lang : "tr";

  try {
    const menu = await getMenuForLocale(lang);
    return NextResponse.json(menu, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return NextResponse.json({ error: "menu_unavailable" }, { status: 500 });
  }
}
