import { prisma } from "@/src/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Please provide a query parameter" },
      { status: 400 }
    );
  }

  if (typeof query !== "string" || query.trim() === "") {
    return NextResponse.json(
      {
        error: "Please provide a valid query parameter",
      },
      {
        status: 400,
      }
    );
  }

  const sanitizedQuery = query.replace(/\^\d/g, "");

  try {
    const results = await prisma.server.findMany({
      where: {
        hostname: {
          contains: sanitizedQuery,
          mode: "insensitive",
        },
      },
      take: 5,
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error while searching server:", error);
    return NextResponse.json(
      { error: "Error while searching servers" },
      { status: 500 }
    );
  }
}
