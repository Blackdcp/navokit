// Server-only configuration. Import this module only from server pages and routes.
export function getSubmissionEmailConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const recipient = process.env.CONTACT_EMAIL?.trim();
  const port = Number(process.env.SMTP_PORT || "465");
  const from = process.env.SMTP_FROM?.trim() || user;

  if (!host || !user || !pass || !recipient || !from || host.endsWith("example.com") ||
      !Number.isInteger(port) || port < 1 || port > 65535) return null;

  return { host, port, auth: { user, pass }, recipient, from };
}
