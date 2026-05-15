// ============ ROLES ============
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  BOSS: 'boss',
  PRODUCT_MANAGER: 'product_manager',
  DESIGNER: 'designer',
  SALESPERSON: 'salesperson',
  FOREIGN_TRADE: 'foreign_trade',
  AFTER_SALES: 'after_sales',
  DEALER: 'dealer',
} as const;

export type RoleSlug = (typeof ROLES)[keyof typeof ROLES];

// ============ PERMISSIONS ============
export const PERMISSIONS = {
  PRODUCTS_READ: 'products:read',
  PRODUCTS_WRITE: 'products:write',
  PRODUCTS_DELETE: 'products:delete',
  CATEGORIES_READ: 'categories:read',
  CATEGORIES_WRITE: 'categories:write',
  CATEGORIES_DELETE: 'categories:delete',
  IMAGES_WRITE: 'images:write',
  VIDEOS_WRITE: 'videos:write',
  DOCUMENTS_WRITE: 'documents:write',
  FAQS_WRITE: 'faqs:write',
  SALESPERSONS_READ: 'salespersons:read',
  SALESPERSONS_WRITE: 'salespersons:write',
  INQUIRIES_READ: 'inquiries:read',
  INQUIRIES_WRITE: 'inquiries:write',
  ANALYTICS_READ: 'analytics:read',
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
  FOREIGN_TRADE: 'foreign_trade',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ============ PRODUCT STATUS ============
export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// ============ PRODUCT TYPE ============
export const PRODUCT_TYPE = {
  SINGLE: 'single',
  SYSTEM: 'system',
  ACCESSORY: 'accessory',
  TEST_DEVICE: 'test_device',
  VIDEO_CASE: 'video_case',
  SERVICE: 'service',
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

// ============ COMPLETENESS LEVEL ============
export const COMPLETENESS_LEVEL = {
  A_FULL: 'A',
  B_BASIC: 'B',
  C_PENDING: 'C',
  D_OFFLINE: 'D',
} as const;

// ============ IMAGE TYPE ============
export const IMAGE_TYPES = [
  'real_shot',
  'main',
  'detail',
  'ai_render',
  'transparent',
  'scene',
  'poster',
  'video_cover',
] as const;

// ============ VIDEO TYPE ============
export const VIDEO_TYPES = [
  'principle_animation',
  'installation',
  'spray_effect',
  'troubleshooting',
  'customer_case',
  'maintenance',
  'english_explanation',
  'factory_tour',
  'exhibition',
] as const;

// ============ DOCUMENT TYPE ============
export const DOCUMENT_TYPES = [
  'product_manual',
  'spec_sheet',
  'selection_guide',
  'installation_manual',
  'service_manual',
  'pricing_info',
  'english_material',
  'product_catalog',
] as const;

// ============ FAQ QUESTION TYPE ============
export const FAQ_QUESTION_TYPES = [
  'selection',
  'installation',
  'usage',
  'troubleshooting',
  'after_sales',
  'pricing',
  'delivery',
  'safety',
  'foreign_trade',
] as const;

// ============ EVENT TYPE ============
export const EVENT_TYPES = [
  'page_view',
  'category_view',
  'product_view',
  'search',
  'phone_click',
  'wechat_click',
  'whatsapp_click',
  'document_download',
  'video_play',
  'video_progress',
  'inquiry_submit',
  'ai_chat_start',
  'ai_transfer_human',
  'scroll_depth',
  'time_on_page',
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

// ============ INQUIRY STATUS ============
export const INQUIRY_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUOTING: 'quoting',
  CLOSED_WON: 'closed_won',
  CLOSED_LOST: 'closed_lost',
} as const;

export type InquiryStatus = (typeof INQUIRY_STATUS)[keyof typeof INQUIRY_STATUS];

// ============ INQUIRY SOURCE ============
export const INQUIRY_SOURCES = ['salesperson', 'exhibition', 'dealer', 'public', 'foreign_trade'] as const;

// ============ INTENT LEVEL ============
export const INTENT_LEVELS = {
  L1: { level: 1, name: '普通访问', nameEn: 'Normal Visit' },
  L2: { level: 2, name: '有效访问', nameEn: 'Engaged Visit' },
  L3: { level: 3, name: '高意向', nameEn: 'High Intent' },
  L4: { level: 4, name: '强意向', nameEn: 'Strong Intent' },
  L5: { level: 5, name: '成交线索', nameEn: 'Hot Lead' },
} as const;

// ============ FAQ RISK LEVEL ============
export const FAQ_RISK_LEVELS = {
  NORMAL: 'normal',
  NEED_CONFIRM: 'need_confirm',
  BLOCK_AI: 'block_ai',
} as const;

// ============ FAQ REVIEW STATUS ============
export const FAQ_REVIEW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  NEEDS_REVISION: 'needs_revision',
} as const;

// ============ DOCUMENT PERMISSION ============
export const DOCUMENT_PERMISSIONS = {
  PUBLIC: 'public',
  AFTER_INQUIRY: 'after_inquiry',
  INTERNAL: 'internal',
} as const;

// ============ LANGUAGE ============
export const LANGUAGES = {
  ZH: 'zh',
  EN: 'en',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

// ============ CATEGORY DEFAULT LIST ============
export const DEFAULT_CATEGORIES = [
  { name: '公司与品牌', slug: 'company-brand', sortOrder: 1 },
  { name: '粉末静电喷涂设备', slug: 'powder-spray-equipment', sortOrder: 2 },
  { name: '液体静电喷涂设备', slug: 'liquid-spray-equipment', sortOrder: 3 },
  { name: '自动化喷涂系统', slug: 'automation-system', sortOrder: 4 },
  { name: '实验与检测设备', slug: 'test-inspection-equipment', sortOrder: 5 },
  { name: '配件与耗材', slug: 'parts-consumables', sortOrder: 6 },
  { name: '行业应用方案', slug: 'industry-solutions', sortOrder: 7 },
  { name: '视频与案例', slug: 'videos-cases', sortOrder: 8 },
  { name: '资料下载与联系', slug: 'downloads-contact', sortOrder: 9 },
];
