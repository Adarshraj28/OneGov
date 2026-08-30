// ─── OneGov AI Engine — Main Entry Point ───────────────────────
// Production-ready architecture — swap MockAIProvider for a real LLM provider

import type {
  AIProvider,
  AIResponse,
  ConversationContext,
  ExtractedEntities,
  WorkflowData,
} from "./types";
import { MockAIProviderV2 as MockAIProvider } from "./mock-provider-v2";
import { getConversationManager } from "./conversation";
import { getRAGRetriever } from "./rag";

// ─── AI Engine ─────────────────────────────────────────────────

export class AIEngine {
  private provider: AIProvider;
  private conversationManager;
  private rag;

  constructor(provider?: AIProvider) {
    this.provider = provider || new MockAIProvider();
    this.conversationManager = getConversationManager();
    this.rag = getRAGRetriever();
  }

  /**
   * Process a user message and return an AI response
   * This is the main entry point for all AI interactions
   */
  async chat(
    userId: string,
    userMessage: string,
    contextId?: string
  ): Promise<{
    response: AIResponse;
    contextId: string;
  }> {
    // Get or create conversation context
    const context = this.conversationManager.getOrCreateContext(userId, contextId);

    // Add user message to history
    this.conversationManager.addUserMessage(context, userMessage);

    // Generate AI response
    const response = await this.provider.generateResponse(context);

    // Add assistant response to history
    this.conversationManager.addAssistantMessage(context, response.content, {
      intent: response.metadata?.intent,
      entities: response.metadata?.entities,
      workflowGenerated: response.type === "workflow",
    });

    // Update context entities if provided
    if (response.metadata?.entities) {
      this.conversationManager.updateEntities(context, response.metadata.entities);
    }

    return {
      response,
      contextId: context.id,
    };
  }

  /**
   * Get the conversation context for a user
   */
  getContext(userId: string, contextId?: string): ConversationContext | null {
    if (contextId) {
      return this.conversationManager.getContext(contextId) || null;
    }
    // Find active context for user
    for (const ctx of this.getallContexts()) {
      if (ctx.userId === userId && ctx.stage !== "completed") {
        return ctx;
      }
    }
    return null;
  }

  /**
   * Get all contexts (for debugging)
   */
  private getallContexts(): ConversationContext[] {
    // Access the store through the manager
    const manager = this.conversationManager as any;
    if (manager.contexts) {
      return Array.from(manager.contexts.values());
    }
    return [];
  }

  /**
   * Clear a conversation context
   */
  clearContext(contextId: string): boolean {
    return this.conversationManager.deleteContext(contextId);
  }

  /**
   * Search the service knowledge base
   */
  searchServices(query: string, topK = 5) {
    return this.rag.retrieve(query, topK);
  }

  /**
   * Get service details from knowledge base
   */
  getServiceDetails(serviceCode: string) {
    return this.rag.getService(serviceCode);
  }

  /**
   * Get services by category
   */
  getServicesByCategory(category: string) {
    return this.rag.getServicesByCategory(category);
  }
}

// ─── Singleton ─────────────────────────────────────────────────

let engineInstance: AIEngine | null = null;

export function getAIEngine(): AIEngine {
  if (!engineInstance) {
    engineInstance = new AIEngine();
  }
  return engineInstance;
}

// ─── Re-export types and components ────────────────────────────

export type {
  AIProvider,
  AIResponse,
  ConversationContext,
  ExtractedEntities,
  WorkflowData,
  WorkflowStepData,
  ConversationMessage,
  IntentCategory,
  AIResponseType,
} from "./types";

export { MockAIProviderV2 as MockAIProvider } from "./mock-provider-v2";
export { getConversationManager } from "./conversation";
export { getRAGRetriever } from "./rag";
export { SERVICE_KNOWLEDGE_BASE } from "./rag";
export { AI_TOOLS, executeToolCall } from "./tools";
