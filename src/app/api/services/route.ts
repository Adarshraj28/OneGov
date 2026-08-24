import { NextResponse } from "next/server";
import { MOCK_SERVICES } from "@/lib/mock-data";

export async function GET() {
  try {
    return NextResponse.json({ services: MOCK_SERVICES });
  } catch (error) {
    console.error("Services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
