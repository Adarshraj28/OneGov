// ─── OneGov AI Engine — Conversation Context Manager ───────────
// Manages multi-turn conversation state and history

import type { ConversationContext, ConversationMessage } from "./types";
import { v4 as uuid } from "uuid";

// ─── In-Memory Conversation Store ──────────────────────────────
// In production, this would be Redis/DB backed

const conversationStore = new Map<string, ConversationContext>();

// ─── Context Manager ───────────────────────────────────────────

export class ConversationManager {
  /**
   * Get or create a conversation context for a user
   */
  getOrCreateContext(userId: string, existingContextId?: string): ConversationContext {
    if (existingContextId) {
      const existing = conversationStore.get(existingContextId);
      if (existing && existing.userId === userId) {
        return existing;
      }
    }

    // Look for an active conversation context for this user
    // Only reuse contexts that are still collecting info (not completed/confirmed)
    for (const ctx of conversationStore.values()) {
      if (
        ctx.userId === userId &&
        (ctx.stage === "greeting" || ctx.stage === "collecting_info") &&
        Date.now() - new Date(ctx.updatedAt).getTime() < 30 * 60 * 1000 // 30 min timeout
      ) {
        return ctx;
      }
    }

    // Create new context
    const context: ConversationContext = {
      id: uuid(),
      userId,
      messages: [],
      currentIntent: null,
      collectedEntities: {
        location: { state: null, city: null },
        businessType: null,
        businessStructure: null,
        serviceType: null,
      },
      workflowId: null,
      stage: "greeting",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    conversationStore.set(context.id, context);
    return context;
  }

  /**
   * Add a user message to the conversation
   */
  addUserMessage(context: ConversationContext, content: string): ConversationMessage {
    const message: ConversationMessage = {
      id: uuid(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    context.messages.push(message);
    context.updatedAt = new Date().toISOString();
    return message;
  }

  /**
   * Add an assistant message to the conversation
   */
  addAssistantMessage(
    context: ConversationContext,
    content: string,
    metadata?: ConversationMessage["metadata"]
  ): ConversationMessage {
    const message: ConversationMessage = {
      id: uuid(),
      role: "assistant",
      content,
      timestamp: new Date().toISOString(),
      metadata,
    };

    context.messages.push(message);
    context.updatedAt = new Date().toISOString();
    return message;
  }

  /**
   * Update collected entities from AI extraction
   */
  updateEntities(
    context: ConversationContext,
    entities: Partial<ConversationContext["collectedEntities"]>
  ): void {
    if (entities.intent) context.currentIntent = entities.intent;
    if (entities.location) {
      context.collectedEntities.location = {
        ...context.collectedEntities.location,
        ...entities.location,
      };
    }
    if (entities.businessType) context.collectedEntities.businessType = entities.businessType;
    if (entities.businessStructure) context.collectedEntities.businessStructure = entities.businessStructure;
    if (entities.serviceType) context.collectedEntities.serviceType = entities.serviceType;
    context.updatedAt = new Date().toISOString();
  }

  /**
   * Advance the conversation stage
   */
  advanceStage(
    context: ConversationContext,
    stage: ConversationContext["stage"]
  ): void {
    context.stage = stage;
    context.updatedAt = new Date().toISOString();
  }

  /**
   * Get conversation history formatted for LLM context
   */
  getHistoryForLLM(context: ConversationContext): Array<{ role: string; content: string }> {
    return context.messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }

  /**
   * Build a summary of collected information
   */
  getCollectedInfoSummary(context: ConversationContext): string {
    const parts: string[] = [];

    if (context.currentIntent) {
      parts.push(`Goal: ${context.currentIntent.replace(/_/g, " ").toLowerCase()}`);
    }
    if (context.collectedEntities.location?.state) {
      parts.push(`State: ${context.collectedEntities.location.state}`);
    }
    if (context.collectedEntities.location?.city) {
      parts.push(`City: ${context.collectedEntities.location.city}`);
    }
    if (context.collectedEntities.businessType) {
      parts.push(`Business type: ${context.collectedEntities.businessType}`);
    }
    if (context.collectedEntities.businessStructure) {
      parts.push(`Structure: ${context.collectedEntities.businessStructure}`);
    }

    return parts.length > 0 ? parts.join("; ") : "No information collected yet";
  }

  /**
   * Get a specific conversation context
   */
  getContext(contextId: string): ConversationContext | undefined {
    return conversationStore.get(contextId);
  }

  /**
   * Delete a conversation context
   */
  deleteContext(contextId: string): boolean {
    return conversationStore.delete(contextId);
  }

  /**
   * Clean up expired conversations (older than 2 hours)
   */
  cleanup(): number {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    let count = 0;

    for (const [id, ctx] of conversationStore.entries()) {
      if (new Date(ctx.updatedAt).getTime() < twoHoursAgo) {
        conversationStore.delete(id);
        count++;
      }
    }

    return count;
  }
}

// Singleton
let managerInstance: ConversationManager | null = null;

export function getConversationManager(): ConversationManager {
  if (!managerInstance) {
    managerInstance = new ConversationManager();
  }
  return managerInstance;
}
