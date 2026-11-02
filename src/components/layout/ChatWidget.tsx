"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Send, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CLINIC } from "@/lib/content";

type Msg = { from: "bot" | "me"; text: string; cta?: { label: string; href: string } };

const QUICK: { q: string; a: Msg }[] = [
  { q: "Can I get a crown today?", a: { from: "bot", text: "Yes — most same-day crowns are scanned, milled and fitted in about two hours.", cta: { label: "Book a crown visit", href: "/book?treatment=same-day-crowns" } } },
  { q: "What do plans cost?", a: { from: "bot", text: "Membership plans start at $29/month and include two cleans a year.", cta: { label: "Compare plans", href: "/plans" } } },
  { q: "Where are you?", a: { from: "bot", text: `We're at ${CLINIC.address}. Open ${CLINIC.hours}.` } },
];

/** The floating cyan chat bubble in the reel's bottom-right corner. Offers canned answers + routes to booking. */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Hi! I'm the Lumina lab assistant. How can I help?" }]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const ask = (text: string) => {
    const match = QUICK.find((x) => x.q === text);
    const reply: Msg = match?.a ?? {
      from: "bot",
      text: "Thanks! A care coordinator will follow up. For the fastest answer, book a free consultation.",
      cta: { label: "Book consultation", href: "/book?type=consultation" },
    };
    setMsgs((m) => [...m, { from: "me", text }]);
    setTimeout(() => setMsgs((m) => [...m, reply]), 450);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Lumina Dental"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex h-[26rem] w-[min(22rem,calc(100vw-2.5rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-white/10 bg-navy-900/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Lumina Assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-cyan-soft">
                  <span className="size-1.5 rounded-full bg-cyan-glow shadow-glow" /> Online now
                </p>
              </div>
              <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-steel-300 hover:bg-white/10 hover:text-white">
                <X className="size-4" />
              </button>
            </div>
            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={m.from === "me" ? "flex justify-end" : "flex"}>
                  <div className={m.from === "me" ? "max-w-[80%] rounded-2xl rounded-br-sm bg-cyan-glow px-3.5 py-2 text-sm text-navy-950" : "max-w-[85%] rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-2 text-sm text-white"}>
                    {m.text}
                    {m.cta && (
                      <Link href={m.cta.href} onClick={() => setOpen(false)} className="mt-2 block font-semibold text-cyan-soft underline-offset-2 hover:underline">
                        {m.cta.label} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {QUICK.map((x) => (
                <button key={x.q} type="button" onClick={() => ask(x.q)} className="rounded-full border border-cyan-glow/30 px-2.5 py-1 text-[11px] text-cyan-soft transition hover:bg-cyan-glow/10">
                  {x.q}
                </button>
              ))}
            </div>
            <form
              className="flex gap-2 border-t border-white/10 p-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (draft.trim()) ask(draft.trim());
                setDraft("");
              }}
            >
              <label htmlFor="chat-input" className="sr-only">
                Message
              </label>
              <input id="chat-input" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a question…" className="min-w-0 flex-1 rounded-full bg-white/8 px-4 text-sm text-white placeholder:text-steel-500 focus:outline-none focus:ring-1 focus:ring-cyan-glow" />
              <button type="submit" aria-label="Send message" className="grid size-9 place-items-center rounded-full bg-cyan-glow text-navy-950 transition hover:bg-cyan-soft">
                <Send className="size-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 260, damping: 18 }}
        className="relative grid size-13 place-items-center rounded-2xl bg-cyan-glow text-navy-950 shadow-glow"
        data-testid="chat-toggle"
      >
        {!open && <span className="absolute inset-0 animate-pulse-ring rounded-2xl border-2 border-cyan-glow" aria-hidden />}
        {open ? <X className="size-5" /> : <MessageSquare className="size-5" />}
      </motion.button>
    </div>
  );
}
