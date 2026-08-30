"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  ChevronRight,
  FileText,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    intent?: string;
    workflow?: {
      id: string;
      title: string;
      totalSteps: number;
      estimatedDays: number;
      steps: {
        id: string;
        sequence: number;
        title: string;
        department: string;
        status: string;
        estimatedDays: number;
      }[];
    };
  };
}

interface AIChatProps {
  onWorkflowCreated?: (workflowId: string) => void;
}

function StartJourneyButton({
  intent,
  onCreated,
}: {
  intent: string;
  onCreated: (journeyId: string) => void;
}) {
  const [creating, setCreating] = useState(false);

  const handleStart = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/journeys/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent }),
      });
      const data = await res.json();
      if (data.success && data.journey?.id) {
        onCreated(data.journey.id);
      }
    } catch {
      // Handle error silently
    } finally {
      setCreating(false);
    }
  };

  return (
    <button
      onClick={handleStart}
      disabled={creating}
      className="mt-2 w-full flex items-center justify-center gap-1 px-3 py-1.5 bg-[#FF9933] text-white rounded-md text-xs font-medium hover:bg-[#e88a2d] transition-colors disabled:opacity-50"
    >
      {creating ? (
        <>
          <Loader2 className="w-3 h-3 animate-spin" />
          Creating Journey...
        </>
      ) : (
        <>
          Start Your Journey
          <ArrowRight className="w-3 h-3" />
        </>
      )}
    </button>
  );
}

export default function AIChat({ onWorkflowCreated }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [contextId, setContextId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Send greeting on mount
  useEffect(() => {
    if (initialized) return;
    setInitialized(true);

    const sendGreeting = async () => {
      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "Hello" }),
        });
        const data = await res.json();
        if (data.success && data.response) {
          setMessages([
            {
              id: "greeting",
              role: "assistant",
              content: data.response.content,
              timestamp: new Date().toISOString(),
              metadata: data.response.metadata,
            },
          ]);
          setContextId(data.contextId);
        }
      } catch {
        // Silently handle greeting failure
      }
    };

    sendGreeting();
  }, [initialized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          contextId,
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response.content,
          timestamp: new Date().toISOString(),
          metadata: data.response.metadata,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setContextId(data.contextId);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (text: string) => {
    sendMessage(text);
  };

  const resetChat = async () => {
    setMessages([]);
    setContextId(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello" }),
      });
      const data = await res.json();
      if (data.success && data.response) {
        setMessages([
          {
            id: "greeting-new",
            role: "assistant",
            content: data.response.content,
            timestamp: new Date().toISOString(),
            metadata: data.response.metadata,
          },
        ]);
        setContextId(data.contextId);
      }
    } catch {
      // Handle silently
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    "I want to open a restaurant",
    "I need a passport",
    "I want to start a business",
    "I need to update my Aadhaar",
  ];

  // Render markdown-like content (simple bold/heading support)
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="text-base font-bold text-gray-900 mt-3 mb-1">
            {line.slice(3)}
          </h3>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h4 key={i} className="text-sm font-semibold text-gray-800 mt-2 mb-1">
            {line.slice(4)}
          </h4>
        );
      }
      // Bold text
      const boldParsed = line.replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-gray-900">$1</strong>'
      );
      // Empty lines
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      // Bullet points
      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-[#FF9933] mt-0.5 shrink-0">•</span>
            <span
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{ __html: boldParsed.slice(2) }}
            />
          </div>
        );
      }
      // Numbered steps
      const stepMatch = line.match(/^(\d+)\.\s/);
      if (stepMatch) {
        return (
          <div key={i} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-xs font-bold text-[#FF9933] bg-[#FF9933]/10 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
              {stepMatch[1]}
            </span>
            <span
              className="text-sm text-gray-700"
              dangerouslySetInnerHTML={{
                __html: boldParsed.replace(/^\d+\.\s/, ""),
              }}
            />
          </div>
        );
      }
      // Regular text
      return (
        <p
          key={i}
          className="text-sm text-gray-700 my-0.5"
          dangerouslySetInnerHTML={{ __html: boldParsed }}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF9933] rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">OneGov AI Assistant</h3>
            <p className="text-[10px] text-blue-200">
              Powered by Government Service Knowledge Base
            </p>
          </div>
        </div>
        <button
          onClick={resetChat}
          className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          title="New conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-[#FF9933] text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-900 rounded-tl-sm"
              }`}
            >
              <div className={msg.role === "assistant" ? "space-y-1" : ""}>
                {msg.role === "assistant"
                  ? renderContent(msg.content)
                  : (
                    <p className="text-sm">{msg.content}</p>
                  )
                }
              </div>

              {/* Workflow Card */}
              {msg.metadata?.workflow && (
                <div className="mt-3 bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-[#FF9933]" />
                    <span className="text-xs font-semibold text-gray-900">
                      {msg.metadata.workflow.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-2">
                    <span>{msg.metadata.workflow.totalSteps} steps</span>
                    <span>~{msg.metadata.workflow.estimatedDays} days</span>
                  </div>
                  <div className="space-y-1.5">
                    {msg.metadata.workflow.steps.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            step.status === "ready"
                              ? "bg-blue-100 text-blue-600"
                              : step.status === "blocked"
                                ? "bg-gray-100 text-gray-400"
                                : "bg-gray-50 text-gray-300"
                          }`}
                        >
                          {step.status === "ready" ? (
                            <ChevronRight className="w-3 h-3" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          )}
                        </div>
                        <span className="text-gray-700">{step.title}</span>
                        <span className="text-gray-400 ml-auto">
                          {step.department.split("(")[0].trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {onWorkflowCreated && (
                    <StartJourneyButton
                      intent={msg.content}
                      onCreated={onWorkflowCreated}
                    />
                  )}
                </div>
              )}

              <p
                className={`text-[10px] mt-1 ${
                  msg.role === "user" ? "text-orange-100" : "text-gray-400"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 bg-[#FF9933] rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 bg-blue-900 rounded-lg flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#FF9933] animate-spin" />
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions (show only when few messages) */}
      {messages.length <= 2 && !loading && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="text-xs px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full hover:bg-[#FF9933]/10 hover:text-[#FF9933] transition-colors border border-gray-200 hover:border-[#FF9933]/30"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-gray-200 bg-gray-50"
      >
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to accomplish..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] bg-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FF9933] to-[#e88a2d] text-white rounded-lg font-medium hover:from-[#e88a2d] hover:to-[#FF9933] transition-all disabled:opacity-50 flex items-center gap-1 shadow-md"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          OneGov AI understands natural language — describe your goal in your own words
        </p>
      </form>
    </div>
  );
}
