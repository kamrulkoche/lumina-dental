import { NextResponse } from "next/server";
import { validateBooking, type BookingInput } from "@/lib/booking";

/**
 * Validates and accepts a booking request. There is no database in this project,
 * so an accepted booking returns a reference; wire `persist()` to a CRM or email service to go live.
 */
export async function POST(req: Request) {
  let body: Partial<BookingInput>;
  try {
    body = (await req.json()) as Partial<BookingInput>;
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Invalid request body." } }, { status: 400 });
  }

  const errors = validateBooking(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const reference = `LD-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return NextResponse.json({ ok: true, reference }, { status: 201 });
}
