import { NextResponse } from "next/server";
import { MOCK_USERS } from "@/lib/mock-data";

export async function GET() {
  try {
    const { cookies } = await import("next/headers");
    const { jwtVerify } = await import("jose");

    const cookieStore = await cookies();
    const token = cookieStore.get("onegov-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "onegov-secret-key-prototype-2026"
    );

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userId = payload.userId as string;
      const email = payload.email as string;

      const user = MOCK_USERS[email];
      if (!user) {
        return NextResponse.json({ user: null }, { status: 404 });
      }

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          profile: user.profile || null,
        },
      });
    } catch {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
