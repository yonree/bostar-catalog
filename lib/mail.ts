export async function sendLeadMail() {
  return { skipped: true, reason: 'SMTP is not configured' };
}
