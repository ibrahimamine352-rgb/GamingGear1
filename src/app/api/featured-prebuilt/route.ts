import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "4");
  const featuredFlag = (url.searchParams.get("featured") ?? "").toLowerCase();

  const where: any = {
    isArchived: false,
    // only prebuilt PC models
    PreBuiltPcmodel: { isNot: null },
  };
  if (featuredFlag && !["0","false","off"].includes(featuredFlag)) {
    where.isFeatured = true; // optional curation
  }

  const items = await prismadb.product.findMany({
    where,
    include: { images: true, PreBuiltPcmodel: true },
    orderBy: { createdAt: "desc" },
    take: Number.isFinite(limit) ? limit : 4,
  });

  return NextResponse.json(items);
}
