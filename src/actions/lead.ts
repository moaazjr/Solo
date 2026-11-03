"use server";

import { after } from "next/server";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email/transport";
import { leadNotificationEmail } from "@/lib/email/lead-notification";
import { canReceiveEmail } from "@/lib/email/verify-domain";
import { checkLeadRateLimit, isDuplicateLead } from "@/lib/rate-limit";
import { getRequestMeta, sanitizeText } from "@/lib/security";
import { GENERAL_ENQUIRY, leadSchema, type LeadActionResult, type LeadInput } from "@/validation/lead";

const MIN_FILL_TIME_MS = 3_000;
const GENERIC_ERROR = "Something went wrong on our side. Please try again, or email us directly.";

export async function submitLead(input: LeadInput): Promise<LeadActionResult> {
  // 1. Validate the raw payload.
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LeadInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LeadInput;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;

  // 2. Spam traps: honeypot filled or form submitted implausibly fast.
  //    Respond with success so bots get no signal, but store and send nothing.
  if (data.website || Date.now() - data.startedAt < MIN_FILL_TIME_MS) {
    return { ok: true };
  }

  // 3. Sanitize, then re-check required lengths after stripping markup.
  const clean = {
    fullName: sanitizeText(data.fullName),
    email: data.email.toLowerCase(),
    company: sanitizeText(data.company) || null,
    service: sanitizeText(data.service),
    budget: data.budget || null,
    message: sanitizeText(data.message),
  };
  if (clean.fullName.length < 2 || clean.message.length < 20) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors: { message: "Please enter a plain-text message." } };
  }

  // 4. Make sure the email's domain can actually receive mail (catches typos and made-up domains).
  if (!(await canReceiveEmail(clean.email))) {
    return {
      ok: false,
      error: "Please check the highlighted fields.",
      fieldErrors: { email: "This email domain can't receive mail. Please check the address." },
    };
  }

  try {
    // 5. Resolve the service against the database (never trust the client's label).
    const service =
      clean.service === GENERAL_ENQUIRY
        ? null
        : await db.service.findFirst({ where: { slug: clean.service, published: true }, select: { slug: true, title: true } });
    if (clean.service !== GENERAL_ENQUIRY && !service) {
      return { ok: false, error: "Please check the highlighted fields.", fieldErrors: { service: "Please choose a service from the list." } };
    }
    const serviceLabel = service?.title ?? "General enquiry";

    // 6. Rate limiting and duplicate protection.
    const { ipHash, userAgent } = await getRequestMeta();
    const { allowed } = await checkLeadRateLimit(ipHash);
    if (!allowed) {
      return { ok: false, error: "You have sent several messages recently. Please wait a few minutes before trying again." };
    }
    if (await isDuplicateLead(clean.email, clean.message)) {
      return { ok: true };
    }

    // 7. Persist the lead. If this fails, no email is sent.
    const lead = await db.lead.create({
      data: { ...clean, service: serviceLabel, ipHash, userAgent },
    });

    // 8. Notify the founder after the response is sent, so the visitor never waits on SMTP.
    //    A failed email never loses the lead; the error is recorded on the lead itself.
    after(async () => {
      try {
        const to = process.env.LEAD_NOTIFICATION_EMAIL ?? "mohamedmoaaz375@gmail.com";
        const email = leadNotificationEmail({ ...lead, serviceLabel });
        await sendMail({ to, replyTo: lead.email, ...email });
        await db.lead.update({ where: { id: lead.id }, data: { emailSent: true } });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown email error";
        console.error("[lead] notification email failed:", message);
        await db.lead.update({ where: { id: lead.id }, data: { emailError: message.slice(0, 500) } }).catch(() => {});
      }
    });

    return { ok: true };
  } catch (error) {
    console.error("[lead] submission failed:", error instanceof Error ? error.message : error);
    return { ok: false, error: GENERIC_ERROR };
  }
}
