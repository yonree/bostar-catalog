import { randomUUID } from 'crypto';

export function asString(value: unknown) {
  return String(value ?? '').trim();
}

export function optionalString(value: unknown) {
  const normalized = asString(value);
  return normalized || undefined;
}

export function asArrayOfStrings(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => asString(item)).filter(Boolean);
}

export function toInquiryNumber(now = new Date()) {
  const stamp = now.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `BS-${stamp}-${Math.floor(Math.random() * 900 + 100)}`;
}

export function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '{}';
  }
}

export function parseJsonObject(value: string | null | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function redactContact(value: string) {
  if (!value) {
    return '';
  }

  if (value.includes('@')) {
    const [name, domain] = value.split('@');
    return `${name.slice(0, 2)}***@${domain}`;
  }

  if (value.length <= 4) {
    return '***';
  }

  return `${value.slice(0, 3)}***${value.slice(-2)}`;
}

export function compactText(value: string, maxLength = 240) {
  const normalized = value.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3)}...`;
}

export function normalizeExtension(filename: string) {
  const match = filename.toLowerCase().match(/(\.[a-z0-9]+)$/);
  return match?.[1] || '';
}

export function makeUploadToken() {
  return `lu_${randomUUID().replace(/-/g, '')}`;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
