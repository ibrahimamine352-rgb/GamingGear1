import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || "";

    if (query === "") {
      return NextResponse.json([]);
    }

    const isFeatured = searchParams.get('isFeatured');

    console.log(query);

    if (typeof query !== "string") {
      throw new Error("Invalid request");
    }

    /**
     * Search posts
     */
    const posts: Array<Product> = await prismadb.product.findMany({
      where: {
        isArchived: false,
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: {
        category: true,
        images: true
      },
      take: 5
    });

    /**
     * Save search
     */
    try {
      await prismadb.searchQuery.create({
        data: {
          query,
        },
      });
    } catch (searchError) {
      // If searchQuery table doesn't exist, just continue
      console.log("Search query logging not available:", searchError);
    }

    return NextResponse.json(posts);
  } catch (error: any) {
    console.log(error);
    return new NextResponse("Internal error", { status: 500 });
  }
}