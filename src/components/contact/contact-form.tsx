"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { submitLead } from "@/actions/lead";
import { budgetOptions } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Field, inputClasses } from "@/components/ui/form-field";
import { GENERAL_ENQUIRY, leadSchema, type LeadInput } from "@/validation/lead";

type ServiceOption = { slug: string; title: string };

const timestamp = () => Date.now();

export function ContactForm({ services }: { services: ServiceOption[] }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      service: "",
      budget: "",
      message: "",
      website: "",
      startedAt: 0,
    },
  });

  // Client-only values: when the visitor started filling in the form (spam check),
  // and a service pre-selected via ?service=slug from a service page.
  useEffect(() => {
    setValue("startedAt", timestamp());
    const requested = new URLSearchParams(window.location.search).get("service");
    if (requested && services.some((s) => s.slug === requested)) setValue("service", requested);
  }, [services, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await submitLead(values);
      if (result.ok) {
        setStatus("success");
        reset({ ...values, fullName: "", email: "", company: "", message: "", budget: "", startedAt: timestamp() });
        return;
      }
      setStatus("error");
      setServerError(result.error);
      for (const [field, message] of Object.entries(result.fieldErrors ?? {})) {
        if (message) setError(field as keyof LeadInput, { message });
      }
    } catch {
      setStatus("error");
      setServerError("We could not reach the server. Please check your connection and try again.");
    }
  });

  const describedBy = (name: keyof LeadInput) => (errors[name] ? `${name}-error` : undefined);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="flex min-h-[520px] flex-col items-start justify-center rounded-md border border-line bg-paper p-8 sm:p-12"
          >
            <span className="grid size-14 place-items-center rounded-full bg-[#e3efe8] text-success">
              <CircleCheck className="size-7" aria-hidden />
            </span>
            <h2 className="display mt-8 text-5xl">Thank you. Message received.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
              Your enquiry is safely with us. The founder will read it personally and reply to your email, usually within
              one business day.
            </p>
            <Button variant="secondary" className="mt-10" onClick={() => setStatus("idle")}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            method="post"
            noValidate
            className="rounded-md border border-line bg-paper p-6 sm:p-10"
            aria-describedby={serverError ? "form-error" : undefined}
          >
            <AnimatePresence>
              {status === "error" && serverError && (
                <motion.div
                  id="form-error"
                  role="alert"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="flex gap-3 rounded-md border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
                    <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {serverError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="fullName" label="Full name" error={errors.fullName?.message}>
                <input
                  id="fullName"
                  autoComplete="name"
                  className={inputClasses}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={describedBy("fullName")}
                  {...register("fullName")}
                />
              </Field>
              <Field id="email" label="Email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  className={inputClasses}
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy("email")}
                  {...register("email")}
                />
              </Field>
              <Field id="company" label="Company name" optional error={errors.company?.message}>
                <input
                  id="company"
                  autoComplete="organization"
                  className={inputClasses}
                  aria-invalid={!!errors.company}
                  aria-describedby={describedBy("company")}
                  {...register("company")}
                />
              </Field>
              <Field id="service" label="Service interested in" error={errors.service?.message}>
                <select
                  id="service"
                  className={`${inputClasses} appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%236b645c' stroke-width='1.5'%3E%3Cpath d='m3 4.5 3 3 3-3'/%3E%3C/svg%3E")] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10`}
                  aria-invalid={!!errors.service}
                  aria-describedby={describedBy("service")}
                  {...register("service")}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                  <option value={GENERAL_ENQUIRY}>Something else / General enquiry</option>
                </select>
              </Field>
            </div>

            <fieldset className="mt-8">
              <legend className="flex w-full items-baseline justify-between text-sm font-medium">
                <span>Estimated budget</span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">Optional</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgetOptions.map((b) => (
                  <label key={b} className="cursor-pointer">
                    <input type="radio" value={b} className="peer sr-only" {...register("budget")} />
                    <span className="inline-block rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ink/40 hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field id="message" label="Message" error={errors.message?.message} hint="What are you building, and what does success look like?" className="mt-8">
              <textarea
                id="message"
                rows={6}
                className={`${inputClasses} resize-y`}
                aria-invalid={!!errors.message}
                aria-describedby={describedBy("message") ?? "message-hint"}
                {...register("message")}
              />
            </Field>

            {/* Honeypot: hidden from people and assistive tech, attractive to bots. */}
            <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </div>
            <input type="hidden" {...register("startedAt", { valueAsNumber: true })} />

            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-xs leading-relaxed text-muted">
                By sending this form you agree to our{" "}
                <a href="/privacy" className="underline underline-offset-2 hover:text-ink">
                  Privacy Policy
                </a>
                . We never share your details.
              </p>
              <Button type="submit" size="lg" disabled={isSubmitting} arrow={!isSubmitting} className="sm:min-w-[200px]">
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
