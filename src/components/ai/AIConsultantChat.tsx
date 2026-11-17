"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { PropertyListing, ChatMessage } from "@/types";
import { processPropertyQuery } from "@/services/aiMatcher";
import {
  Sparkles,
  Send,
  Bot,
  ArrowUpRight,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

const SUGGESTED_QUERIES = [
  "2BHK in Pune",
  "under ₹80 lakh",
  "luxury villa",
  "rental properties",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "msg-welcome-01",
  sender: "assistant",
  content:
    "Hello! Welcome to AVENORA. I’m your personal property consultant. Tell me what kind of home you're dreaming of.",
  suggestedQueries: SUGGESTED_QUERIES,
  mode: "demo_rule_based",
  timestamp: "Just now",
};

export function AIConsultantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // GSAP Animation when Chat Opens / Closes
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!chatContainerRef.current) return;

    if (isOpen) {
      if (!motionQuery.matches) {
        gsap.fromTo(
          chatContainerRef.current,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "power2.out" }
        );
      } else {
        gsap.set(chatContainerRef.current, { opacity: 1, scale: 1, y: 0 });
      }
    }
  }, [isOpen]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setHasInteracted(true);
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      content: trimmed,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsLoading(true);

    try {
      // 1. Attempt server-side API Route (supports configured server AI keys)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "assistant",
          content: data.content,
          matchedProperties: data.matchedProperties || [],
          suggestedQueries: data.suggestedQueries || [],
          mode: data.mode || "demo_rule_based",
          timestamp: "Just now",
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback cleanly to client-side rule-based matcher
    }

    // 2. Client-side Fallback using rule-based matcher against real dataset
    const processed = processPropertyQuery(trimmed);
    const assistantMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "assistant",
      content: processed.content,
      matchedProperties: processed.matchedProperties,
      suggestedQueries: processed.suggestedQueries || [],
      mode: "demo_rule_based",
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  const handleOpenPropertyModal = (property: PropertyListing) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("avenora_open_property", { detail: property })
      );
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* 1. Floating Launcher Button (Bottom-Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Subtle invitation tooltip if user hasn't opened chat yet */}
          {!hasInteracted && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#B9D7E8]/30 bg-[#263C50]/90 px-3.5 py-1.5 text-[11px] font-sans text-[#FFF9F4] backdrop-blur-md shadow-xl animate-bounce">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D]" />
              <span>Ask AI Consultant about Pune, Mumbai, villas...</span>
            </div>
          )}

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open AVENORA AI Property Consultant Chat"
            className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-[#F6B99D] bg-[#263C50] text-[#FFF9F4] shadow-[0_10px_35px_rgba(246,185,157,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-108 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F6B99D]"
          >
            {/* Concentric radar pulse aura */}
            <span
              className="absolute -inset-1 rounded-full border border-[#F6B99D]/40 animate-ping opacity-60"
              style={{ animationDuration: "3s" }}
              aria-hidden="true"
            />

            <div className="relative flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#F6B99D] transition-transform duration-300 group-hover:rotate-12" />
            </div>

            {/* Micro badge indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F6B99D] text-[9px] font-mono font-bold text-[#263C50]">
              AI
            </span>
          </button>
        </div>
      )}

      {/* 2. Floating Responsive Chat Window */}
      {isOpen && (
        <div
          ref={chatContainerRef}
          role="dialog"
          aria-label="AVENORA AI Property Consultant Chat"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex w-[calc(100vw-32px)] sm:w-[460px] md:w-[490px] h-[640px] max-h-[88vh] flex-col rounded-3xl border border-[#B9D7E8]/30 bg-[#263C50]/95 text-[#FFF9F4] shadow-[0_25px_80px_rgba(10,18,26,0.95)] backdrop-blur-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-[#B9D7E8]/15 bg-[#263C50]/80 px-5 py-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#F6B99D]/50 bg-[#F6B99D]/15 shadow-inner">
                <Bot className="h-5 w-5 text-[#F6B99D]" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#263C50]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-normal text-[#FFF9F4] leading-tight">
                    AVENORA AI
                  </h3>
                  <span className="rounded-full bg-[#F6B99D]/15 border border-[#F6B99D]/30 px-2 py-0.2 font-mono text-[9px] uppercase tracking-wider text-[#F6B99D]">
                    DEMO CONSULTANT
                  </span>
                </div>
                <span className="block text-[10px] font-mono text-[#B9D7E8]/70">
                  Natural Language Real Estate Intelligence
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                aria-label="Restart chat conversation"
                title="Restart Chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#B9D7E8]/70 hover:bg-white/5 hover:text-[#FFF9F4] transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close AI Consultant window"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#B9D7E8]/70 hover:bg-white/5 hover:text-[#FFF9F4] transition-colors"
              >
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Demo Mode Notice Ticker */}
          <div className="bg-[#B9D7E8]/10 border-b border-[#B9D7E8]/15 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-[#B9D7E8]">
            <span>ENGINE: REAL DATASET MATCHER</span>
            <span className="text-[#F6B99D]">MUMBAI · PUNE · BLR · HYD</span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-[#F6B99D] text-[#263C50] font-medium rounded-br-xs shadow-md"
                      : "bg-[#263C50]/90 border border-[#B9D7E8]/20 text-[#FFF9F4] rounded-bl-xs shadow-md"
                  }`}
                >
                  <p>{msg.content}</p>

                  {/* Matched Properties Cards inside Chat */}
                  {msg.matchedProperties && msg.matchedProperties.length > 0 && (
                    <div className="mt-3.5 space-y-2.5 pt-2 border-t border-white/10">
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-[#B9D7E8]">
                        Recommended Portfolios ({msg.matchedProperties.length})
                      </span>

                      {msg.matchedProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className="group/card flex items-center justify-between gap-3 rounded-xl border border-[#B9D7E8]/20 bg-black/25 p-2.5 hover:border-[#F6B99D]/50 transition-all"
                        >
                          {/* Image preview */}
                          <div className="relative h-12 w-14 flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={prop.images[0]}
                              alt={prop.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-xs font-normal text-[#FFF9F4] truncate">
                              {prop.title}
                            </h5>
                            <p className="font-sans text-[10px] text-[#B9D7E8]/80 truncate">
                              {prop.locality}, {prop.city} · {prop.bedrooms} BHK
                            </p>
                            <span className="font-mono text-[10px] text-[#F6B99D] font-medium">
                              {prop.priceFormatted}
                            </span>
                          </div>

                          {/* Action Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenPropertyModal(prop)}
                            className="flex-shrink-0 flex items-center gap-1 rounded-full border border-[#B9D7E8]/30 bg-white/5 px-2.5 py-1 text-[10px] font-sans text-[#FFF9F4] hover:bg-[#F6B99D] hover:text-[#263C50] hover:border-[#F6B99D] transition-colors"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Suggested Query Quick-Chips */}
                {msg.suggestedQueries && msg.suggestedQueries.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[92%]">
                    {msg.suggestedQueries.map((query) => (
                      <button
                        key={query}
                        type="button"
                        onClick={() => handleSendMessage(query)}
                        className="rounded-full border border-[#B9D7E8]/25 bg-white/5 px-3 py-1 font-mono text-[10px] text-[#B9D7E8] hover:border-[#F6B99D] hover:text-[#F6B99D] hover:bg-[#F6B99D]/10 transition-colors text-left"
                      >
                        &ldquo;{query}&rdquo;
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Loader Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#B9D7E8]/70 pl-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F6B99D] animate-ping" />
                <span>AVENORA AI is cross-referencing estates...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Bar */}
          <div className="border-t border-[#B9D7E8]/15 bg-[#263C50]/80 p-3 sm:p-4 backdrop-blur-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputQuery);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about 2BHK in Pune, villas, rent..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-full border border-[#B9D7E8]/25 bg-[#263C50] px-4 py-2.5 text-xs text-[#FFF9F4] placeholder:text-white/35 focus:border-[#F6B99D] focus:outline-none focus:ring-1 focus:ring-[#F6B99D] transition-all disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isLoading}
                aria-label="Send message to AI Property Consultant"
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F6B99D] text-[#263C50] font-medium transition-all hover:bg-[#F6B99D]/90 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
