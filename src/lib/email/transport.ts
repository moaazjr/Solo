import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export class EmailConfigError extends Error {}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new EmailConfigError(`Missing environment variable ${name}`);
  return value;
}

/** Lazily creates a single SMTP transporter from environment variables (server only). */
export function getTransporter() {
  if (transporter) return transporter;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transporter = nodemailer.createTransport({
    host: requireEnv("SMTP_HOST"),
    port,
    secure: (process.env.SMTP_SECURE ?? String(port === 465)) === "true",
    auth: { user: requireEnv("SMTP_USER"), pass: requireEnv("SMTP_PASSWORD") },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

export async function sendMail(options: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const from = process.env.MAIL_FROM ?? requireEnv("SMTP_USER");
  return getTransporter().sendMail({ from, ...options });
}
