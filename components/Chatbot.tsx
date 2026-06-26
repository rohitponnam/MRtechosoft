"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "assistant" | "user"; content: string };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>();
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi. I can help with services, courses, placements, pricing, or portal access.",
    },
  ]);
  const visitorId = useRef("");

  useEffect(() => {
    const stored = localStorage.getItem("mrtechnosoft_visitor");
    visitorId.current = stored ?? crypto.randomUUID();
    if (!stored) localStorage.setItem("mrtechnosoft_visitor", visitorId.current);
  }, []);

  async function send(event: FormEvent) {
    event.preventDefault();
    const content = message.trim();
    if (!content || sending) return;

    setMessages((current) => [...current, { role: "user", content }]);
    setMessage("");
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, conversationId, visitorId: visitorId.current }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setConversationId(data.conversationId);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I’m unavailable right now. Please use the Contact page and the team will follow up.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chatbot">
      {open && (
        <section className="chatPanel" aria-label="AI assistant">
          <header>
            <div>
              <strong>MRT Assistant</strong>
              <span>AI guidance, grounded in our services</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>
          <div className="chatMessages">
            {messages.map((item, index) => (
              <p className={`chatMessage ${item.role}`} key={`${item.role}-${index}`}>
                {item.content}
              </p>
            ))}
            {sending && <p className="chatMessage assistant">Thinking...</p>}
          </div>
          <form onSubmit={send}>
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask a question..."
              aria-label="Chat message"
            />
            <button type="submit" disabled={sending} aria-label="Send message">
              ↗
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        className="chatLauncher"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      >
        {open ? "×" : "AI"}
      </button>
    </div>
  );
}
