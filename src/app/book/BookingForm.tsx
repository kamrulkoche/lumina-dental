"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { isoDay, TIME_SLOTS, validateBooking, type BookingErrors, type BookingInput, type VisitType } from "@/lib/booking";
import { PLANS, TREATMENTS } from "@/lib/content";
import { cn } from "@/lib/cn";

type Initial = { type: VisitType; treatment: string; plan: string };

export function BookingForm({ initial }: { initial: Initial }) {
  const [form, setForm] = useState<BookingInput>({ ...initial, name: "", email: "", phone: "", date: "", time: "", notes: "" });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [reference, setReference] = useState("");

  const minDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return isoDay(d);
  }, []);

  const set = <K extends keyof BookingInput>(k: K, v: BookingInput[K]) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (touched) setErrors(validateBooking(next));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const errs = validateBooking(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/book", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = (await res.json()) as { ok: boolean; reference?: string; errors?: BookingErrors };
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setStatus("idle");
        return;
      }
      setReference(data.reference ?? "");
      setStatus("done");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  const treatmentName = TREATMENTS.find((t) => t.slug === form.treatment)?.name;

  return (
    <AnimatePresence mode="wait">
      {status === "done" ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[2rem] bg-white p-8 text-center shadow-card sm:p-12" role="status" data-testid="booking-success">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }} className="mx-auto grid size-16 place-items-center rounded-full bg-ink text-cyan-glow shadow-glow">
            <Check className="size-7" />
          </motion.span>
          <h2 className="mt-6 font-display text-2xl font-extrabold uppercase">Request received</h2>
          <p className="mt-2 text-ink-soft">
            Thanks {form.name.split(" ")[0]} — we&apos;ve reserved {form.time} on {new Date(`${form.date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} for your{" "}
            {form.type === "consultation" ? "consultation" : treatmentName}. A confirmation is on its way to {form.email}.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-mist px-4 py-1.5 font-mono text-sm">
            <CalendarCheck className="size-4 text-cyan-deep" /> Ref {reference}
          </p>
          <div className="mt-8">
            <Link href="/" className="text-sm font-semibold text-cyan-deep hover:underline">
              Back to home
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate className="rounded-[2rem] bg-white p-6 shadow-card sm:p-10" exit={{ opacity: 0, y: -10 }} data-testid="booking-form">
          <fieldset>
            <legend className="font-display text-sm font-bold uppercase tracking-widest">1 · Visit type</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2" role="radiogroup">
              {(
                [
                  ["consultation", "Free consultation", "20 min · scan & plan"],
                  ["treatment", "Book a treatment", "Choose from our menu"],
                ] as const
              ).map(([value, label, note]) => (
                <label key={value} className={cn("relative cursor-pointer rounded-2xl border p-4 transition", form.type === value ? "border-ink bg-ink text-white" : "border-ink/12 hover:border-ink/40")}>
                  <input type="radio" name="type" value={value} checked={form.type === value} onChange={() => set("type", value)} className="sr-only" />
                  <span className="block font-semibold">{label}</span>
                  <span className={cn("text-xs", form.type === value ? "text-steel-300" : "text-ink-soft")}>{note}</span>
                  {form.type === value && <Check className="absolute right-4 top-4 size-4 text-cyan-glow" aria-hidden />}
                </label>
              ))}
            </div>
            <AnimatePresence initial={false}>
              {form.type === "treatment" && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <Field label="Treatment" error={errors.treatment} id="treatment" className="pt-4">
                    <select id="treatment" name="treatment" value={form.treatment} onChange={(e) => set("treatment", e.target.value)} className={inputCls(errors.treatment)}>
                      <option value="">Select a treatment…</option>
                      {TREATMENTS.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.name} — from ${t.from.toLocaleString("en-US")}
                        </option>
                      ))}
                    </select>
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>
            <Field label="Membership plan (optional)" error={errors.plan} id="plan" className="pt-4">
              <select id="plan" name="plan" value={form.plan} onChange={(e) => set("plan", e.target.value)} className={inputCls(errors.plan)}>
                <option value="">No plan / decide later</option>
                {PLANS.map((p) => (
                  <option key={p.name} value={p.name.toLowerCase().replace(/\s+/g, "-")}>
                    {p.name} — ${p.price}/month
                  </option>
                ))}
              </select>
            </Field>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="font-display text-sm font-bold uppercase tracking-widest">2 · Date & time</legend>
            <Field label="Preferred date" error={errors.date} id="date" className="mt-4">
              <input id="date" name="date" type="date" min={minDate} value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls(errors.date)} />
            </Field>
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium" id="time-label">
                Time slot
              </p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="time-label">
                {TIME_SLOTS.map((t) => (
                  <label key={t} className={cn("cursor-pointer rounded-full border px-4 py-2 text-sm tabular-nums transition", form.time === t ? "border-cyan-deep bg-cyan-glow/15 font-semibold text-ink" : "border-ink/12 hover:border-ink/40")}>
                    <input type="radio" name="time" value={t} checked={form.time === t} onChange={() => set("time", t)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
              {errors.time && <p className="mt-1.5 text-xs text-red-600">{errors.time}</p>}
            </div>
          </fieldset>

          <fieldset className="mt-10">
            <legend className="font-display text-sm font-bold uppercase tracking-widest">3 · Your details</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name} id="name" className="sm:col-span-2">
                <input id="name" name="name" autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls(errors.name)} />
              </Field>
              <Field label="Email" error={errors.email} id="email">
                <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls(errors.email)} />
              </Field>
              <Field label="Phone" error={errors.phone} id="phone">
                <input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls(errors.phone)} />
              </Field>
              <Field label="Anything we should know? (optional)" error={errors.notes} id="notes" className="sm:col-span-2">
                <textarea id="notes" name="notes" rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={cn(inputCls(errors.notes), "h-auto py-3")} />
              </Field>
            </div>
          </fieldset>

          {status === "error" && <p className="mt-6 text-sm text-red-600">Something went wrong sending your request. Please try again or call us.</p>}
          <Button type="submit" variant="ink" size="lg" className="mt-10 w-full" disabled={status === "sending"}>
            {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : null}
            {status === "sending" ? "Sending…" : "Request appointment"}
            {status !== "sending" && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function inputCls(error?: string) {
  return cn(
    "h-12 w-full rounded-xl border bg-cloud px-4 text-[15px] text-ink transition focus:bg-white focus:outline-none focus:ring-2",
    error ? "border-red-400 focus:ring-red-200" : "border-ink/12 focus:border-cyan-deep focus:ring-cyan-glow/30",
  );
}

function Field({ label, error, id, className, children }: { label: string; error?: string; id: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
