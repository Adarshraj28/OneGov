import { NextResponse } from "next/server";
import { removeAuthCookie, getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit/service";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await logAuditEvent(user.userId, "user.logout", "user", user.userId);
    }

    await removeAuthCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
