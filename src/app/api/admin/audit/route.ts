import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAuditLogs } from "@/lib/audit/service";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "admin" && user.role !== "officer")) {
      return NextResponse.json({ error: "Admin or officer access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const resource = searchParams.get("resource") || undefined;
    const action = searchParams.get("action") || undefined;

    const result = await getAuditLogs({ page, limit, resource, action });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
