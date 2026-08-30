// ─── AI Chat API ───────────────────────────────────────────────
// POST /api/ai/chat — Conversational AI endpoint
// GET /api/ai/chat — Get conversation history

import { NextRequest, NextResponse } from "next/server";
import { getAIEngine } from "@/lib/ai";

// ─── Auth Helper ───────────────────────────────────────────────

async function getUserFromCookie() {
  try {
    const { cookies } = await import("next/headers");
    const { jwtVerify } = await import("jose");
    const cookieStore = await cookies();
    const token = cookieStore.get("onegov-token")?.value;
    if (!token) return null;
    const JWT_SECRET = new TextEncoder().encode(
      process.env.JWT_SECRET || "onegov-secret-key-prototype-2026"
    );
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string; role: string; name: string };
  } catch {
    return null;
  }
}

// ─── POST: Send a chat message ─────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { message, contextId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    const engine = getAIEngine();
    const { response, contextId: newContextId } = await engine.chat(
      user.userId,
      message.trim(),
      contextId
    );

    return NextResponse.json({
      success: true,
      response,
      contextId: newContextId,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── GET: Get conversation context ─────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contextId = searchParams.get("contextId");

    const engine = getAIEngine();
    const context = engine.getContext(user.userId, contextId || undefined);

    if (!context) {
      return NextResponse.json({
        success: true,
        context: null,
        messages: [],
      });
    }

    return NextResponse.json({
      success: true,
      context: {
        id: context.id,
        stage: context.stage,
        currentIntent: context.currentIntent,
        collectedEntities: context.collectedEntities,
        workflowId: context.workflowId,
        createdAt: context.createdAt,
        updatedAt: context.updatedAt,
      },
      messages: context.messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        metadata: m.metadata,
      })),
    });
  } catch (error) {
    console.error("AI context error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
