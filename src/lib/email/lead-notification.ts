import "server-only";
import { siteConfig } from "@/config/site";
import { escapeHtml } from "@/lib/security";
import { absoluteUrl, formatDateTime } from "@/lib/utils";

export type LeadEmailData = {
  id: string;
  fullName: string;
  email: string;
  company: string | null;
  serviceLabel: string;
  budget: string | null;
  message: string;
  createdAt: Date;
};

export function leadNotificationEmail(lead: LeadEmailData) {
  const submitted = formatDateTime(lead.createdAt);
  // Links to localhost are a strong spam signal, so the dashboard link is only included once the site has a real URL.
  const dashboardUrl = absoluteUrl(`/admin/leads/${lead.id}`);
  const adminUrl = /\/\/(localhost|127\.0\.0\.1)[:/]/.test(dashboardUrl) ? null : dashboardUrl;
  const rows: [string, string][] = [
    ["Full name", lead.fullName],
    ["Email", lead.email],
    ["Company", lead.company || "Not provided"],
    ["Service", lead.serviceLabel],
    ["Budget", lead.budget || "Not provided"],
    ["Submitted", submitted],
  ];

  const subject = `New lead: ${lead.fullName} · ${lead.serviceLabel}`;

  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f7f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0e0d0c;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4ef;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf9;border:1px solid #e3ddd3;border-radius:6px;overflow:hidden;">
        <tr><td style="background:#0e0d0c;padding:28px 32px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:26px;color:#f7f4ef;">${escapeHtml(siteConfig.name)}<span style="color:#e3a9b4;">.</span></p>
          <p style="margin:6px 0 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#a39a90;">New contact form submission</p>
        </td></tr>
        <tr><td style="padding:32px 32px 8px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:28px;line-height:1.2;">${escapeHtml(lead.fullName)} wants to talk about <span style="color:#7a2e3b;">${escapeHtml(lead.serviceLabel)}</span>.</p>
        </td></tr>
        <tr><td style="padding:16px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3ddd3;">
            ${rows
              .map(
                ([k, v]) => `<tr>
              <td style="padding:12px 0;border-bottom:1px solid #e3ddd3;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#6b645c;width:120px;vertical-align:top;">${k}</td>
              <td style="padding:12px 0;border-bottom:1px solid #e3ddd3;font-size:15px;">${k === "Email" ? `<a href="mailto:${escapeHtml(v)}" style="color:#7a2e3b;">${escapeHtml(v)}</a>` : escapeHtml(v)}</td>
            </tr>`,
              )
              .join("")}
          </table>
        </td></tr>
        <tr><td style="padding:8px 32px 8px;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#6b645c;">Message</p>
          <div style="background:#f7f4ef;border-left:3px solid #7a2e3b;padding:18px 20px;font-size:15px;line-height:1.65;white-space:pre-wrap;">${escapeHtml(lead.message)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px 36px;">
          <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;background:#0e0d0c;color:#f7f4ef;text-decoration:none;padding:12px 20px;border-radius:4px;font-size:14px;margin-right:8px;">Reply to ${escapeHtml(lead.fullName.split(" ")[0] ?? "")}</a>
          ${adminUrl ? `<a href="${escapeHtml(adminUrl)}" style="display:inline-block;border:1px solid #e3ddd3;color:#0e0d0c;text-decoration:none;padding:11px 20px;border-radius:4px;font-size:14px;">Open in dashboard</a>` : ""}
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-size:12px;color:#a39a90;">Lead ID ${escapeHtml(lead.id)} · Sent automatically by the ${escapeHtml(siteConfig.name)} website</p>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    `New lead from the ${siteConfig.name} website`,
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    lead.message,
    "",
    ...(adminUrl ? [`Dashboard: ${adminUrl}`] : []),
  ].join("\n");

  return { subject, html, text };
}
