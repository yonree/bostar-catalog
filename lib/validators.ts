import { attachmentPolicy } from '@/lib/lead/constants';
import type { LeadSubmissionInput } from '@/lib/lead/types';
import { asArrayOfStrings, asString, optionalString } from '@/lib/lead/utils';

export type LeadValidationResult =
  | { ok: true; data: LeadSubmissionInput }
  | { ok: false; message: string };

export function parseLeadSubmission(body: Record<string, unknown>): LeadValidationResult {
  if (body.website) {
    return { ok: false, message: '提交失败。' };
  }

  const locale = asString(body.locale) === 'en' ? 'en' : 'zh-CN';
  const name = asString(body.name);
  const company = asString(body.company);
  const phone = optionalString(body.phone);
  const email = optionalString(body.email);
  const country = asString(body.country);
  const target = asString(body.target);
  const message = asString(body.message);
  const attachmentTokens = asArrayOfStrings(body.attachmentTokens);

  if (!name) return { ok: false, message: '请填写联系人姓名。' };
  if (!phone && !email) {
    return { ok: false, message: '电话和邮箱至少填写一项。' };
  }
  if (!company) return { ok: false, message: '请填写公司名称。' };
  if (!country) return { ok: false, message: '请填写国家或地区。' };
  if (!target) return { ok: false, message: '请填写目标需求。' };
  if (message.length > 4000) {
    return { ok: false, message: '补充说明不能超过 4000 字。' };
  }
  if (body.privacyConsent !== true && body.privacyConsent !== 'true' && body.privacyConsent !== 'on') {
    return { ok: false, message: '请先同意隐私政策与数据说明。' };
  }
  if (attachmentTokens.length > attachmentPolicy.maxFiles) {
    return { ok: false, message: `最多只能上传 ${attachmentPolicy.maxFiles} 个附件。` };
  }

  return {
    ok: true,
    data: {
      locale,
      name,
      company,
      phone,
      email,
      wechat: optionalString(body.wechat),
      whatsapp: optionalString(body.whatsapp),
      country,
      workpiece: optionalString(body.workpiece),
      workpieceMaterial: optionalString(body.workpieceMaterial),
      coatingMaterial: optionalString(body.coatingMaterial),
      target,
      capacity: optionalString(body.capacity),
      demandType: optionalString(body.demandType),
      currentIssue: optionalString(body.currentIssue),
      message: message || undefined,
      privacyConsent: true,
      sourcePage: optionalString(body.sourcePage),
      sourceType: optionalString(body.sourceType),
      referrer: optionalString(body.referrer),
      interestedProduct: optionalString(body.interestedProduct),
      interestedProductModel: optionalString(body.interestedProductModel),
      interestedSolution: optionalString(body.interestedSolution),
      productId: optionalString(body.productId),
      attachmentTokens,
      utmSource: optionalString(body.utmSource),
      utmMedium: optionalString(body.utmMedium),
      utmCampaign: optionalString(body.utmCampaign),
      utmTerm: optionalString(body.utmTerm),
      utmContent: optionalString(body.utmContent),
      rawPayload: body,
    },
  };
}

export function validateLead(body: Record<string, unknown>) {
  const result = parseLeadSubmission(body);
  return result.ok ? { ok: true as const } : result;
}
