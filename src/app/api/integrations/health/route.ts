import { NextRequest, NextResponse } from "next/server";
import { MOCK_INTEGRATION_HEALTH } from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({ health: MOCK_INTEGRATION_HEALTH });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { department, status } = await request.json();
    if (!department || !status) {
      return NextResponse.json(
        { error: "department and status are required" },
        { status: 400 }
      );
    }

    // Update mock data in-memory
    const h = MOCK_INTEGRATION_HEALTH.find((h) => h.department === department);
    if (h) {
      h.status = status;
    }

    return NextResponse.json({ success: true, department, status });
  } catch (error) {
    console.error("Simulation toggle error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
