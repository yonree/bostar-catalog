export function validateLead(
  body: Record<string, unknown>
): { ok: true } | { ok: false; message: string } {
  if (body.website) return { ok: false, message: '提交失败' };
  if (!String(body.name || '').trim()) return { ok: false, message: '请填写姓名。' };
  if (!String(body.phone || '').trim() && !String(body.email || '').trim())
    return { ok: false, message: '电话和邮箱至少填写一项。' };
  if (String(body.message || '').length > 2000)
    return { ok: false, message: '留言不能超过 2000 字。' };
  return { ok: true };
}
