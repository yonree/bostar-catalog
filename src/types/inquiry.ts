import type { Product } from './product';

export interface Salesperson {
  id: string;
  userId?: string | null;
  name: string;
  department: string;
  title?: string | null;
  phone?: string | null;
  wechatQr?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  region?: string | null;
  productLines?: string[];
  slug: string;
  exclusiveUrl: string;
  qrCodeUrl?: string | null;
  isActive: boolean;
  roleLevel: string;
  createdAt: Date;
  updatedAt: Date;
  user?: import('./user').User | null;
}

export interface VisitorEvent {
  id: string;
  visitorId: string;
  sessionId: string;
  salespersonId?: string | null;
  eventType: string;
  pageUrl: string;
  pageTitle?: string | null;
  productId?: string | null;
  documentId?: string | null;
  videoId?: string | null;
  keyword?: string | null;
  duration?: number | null;
  deviceType?: string | null;
  region?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
  intentLevel: string;
  isPushed: boolean;
  createdAt: Date;
  product?: Product | null;
  salesperson?: Salesperson | null;
}

export interface Inquiry {
  id: string;
  customerName: string;
  company?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  region?: string | null;
  productId?: string | null;
  requirement: string;
  sourcePage?: string | null;
  salespersonId?: string | null;
  sourceType: string;
  intentLevel: string;
  followStatus: string;
  nextFollowTime?: Date | null;
  remark?: string | null;
  handledById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  product?: Product | null;
  salesperson?: Salesperson | null;
  handledBy?: import('./user').User | null;
}

export interface InquiryCreateInput {
  customerName: string;
  company?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  region?: string;
  productId?: string;
  requirement: string;
  sourcePage?: string;
  salespersonId?: string;
  sourceType?: string;
  needQuote?: boolean;
  needSample?: boolean;
}

export interface EventCreateInput {
  visitorId: string;
  sessionId: string;
  salespersonId?: string;
  eventType: string;
  pageUrl: string;
  pageTitle?: string;
  productId?: string;
  documentId?: string;
  videoId?: string;
  keyword?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}
