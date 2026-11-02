import { PLANS, TREATMENTS } from "./content";

export const VISIT_TYPES = ["consultation", "treatment"] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

export const TIME_SLOTS = ["08:30", "10:00", "11:30", "13:30", "15:00", "16:30", "18:00"] as const;

export type BookingInput = {
  type: VisitType;
  treatment: string;
  plan: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
};

export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\d\s-]{7,20}$/;

/** YYYY-MM-DD for a date in local time. */
export function isoDay(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Shared by the form (instant feedback) and the API route (authoritative check). */
export function validateBooking(input: Partial<BookingInput>, today: Date = new Date()): BookingErrors {
  const e: BookingErrors = {};
  if (!input.type || !VISIT_TYPES.includes(input.type)) e.type = "Choose a visit type.";
  if (input.type === "treatment" && !TREATMENTS.some((t) => t.slug === input.treatment)) e.treatment = "Choose a treatment.";
  if (input.plan && !PLANS.some((p) => p.name.toLowerCase().replace(/\s+/g, "-") === input.plan)) e.plan = "Unknown plan.";
  if (!input.name || input.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!input.email || !EMAIL.test(input.email.trim())) e.email = "Enter a valid email address.";
  if (!input.phone || !PHONE.test(input.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) e.date = "Pick a date.";
  else {
    if (input.date <= isoDay(today)) e.date = "Pick a date from tomorrow onwards.";
    else if (new Date(`${input.date}T12:00:00`).getDay() === 0) e.date = "We're closed on Sundays.";
  }
  if (!input.time || !(TIME_SLOTS as readonly string[]).includes(input.time)) e.time = "Pick a time slot.";
  if (input.notes && input.notes.length > 600) e.notes = "Keep notes under 600 characters.";
  return e;
}
