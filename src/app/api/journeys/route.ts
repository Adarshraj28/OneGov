import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserJourneys, getJourneyWithSteps } from "@/lib/workflow/engine";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const journeyId = searchParams.get("id");

    if (journeyId) {
      const journey = await getJourneyWithSteps(journeyId);
      if (!journey) {
        return NextResponse.json({ error: "Journey not found" }, { status: 404 });
      }
      return NextResponse.json({ journey });
    }

    // For officers/admins, show all journeys
    let journeys;
    if (user.role === "officer" || user.role === "admin") {
      journeys = await prisma.serviceJourney.findMany({
        include: {
          steps: {
            include: { service: true },
            orderBy: { sequence: "asc" },
          },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    } else {
      journeys = await getUserJourneys(user.userId);
    }

    return NextResponse.json({ journeys });
  } catch (error) {
    console.error("Journeys error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
