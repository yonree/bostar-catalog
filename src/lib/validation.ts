import { z } from 'zod';

// ============ AUTH ============
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符').max(100),
});

// ============ CATEGORY ============
export const categorySchema = z.object({
  name: z.string().min(1, '分类名称不能为空').max(50),
  nameEn: z.string().max(100).optional().nullable(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'slug格式不正确'),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  coverImage: z.string().url().optional().nullable().or(z.literal('')),
  parentId: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isVisible: z.boolean().optional(),
});

// ============ PRODUCT ============
export const productSchema = z.object({
  productCode: z.string().min(1, '产品编码不能为空').max(50),
  model: z.string().max(50).optional().nullable(),
  name: z.string().min(1, '产品名称不能为空').max(100),
  nameEn: z.string().max(200).optional().nullable(),
  categoryId: z.string().min(1, '请选择分类'),
  productType: z.enum(['single', 'system', 'accessory', 'test_device', 'video_case', 'service']).optional(),
  tagline: z.string().max(100).optional().nullable(),
  taglineEn: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  sellingPoints: z.any().optional(),
  sellingPointsEn: z.any().optional(),
  applications: z.any().optional(),
  applicationsEn: z.any().optional(),
  mainImage: z.string().url().optional().nullable().or(z.literal('')),
  isFeatured: z.boolean().optional(),
  isExportVisible: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  completenessLevel: z.enum(['A', 'B', 'C', 'D']).optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'slug格式不正确'),
  sortOrder: z.number().int().optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(12),
  category: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  lang: z.enum(['zh', 'en']).optional().default('zh'),
  sort: z.enum(['latest', 'name_asc', 'name_desc', 'sort_order']).optional().default('sort_order'),
  featured: z.coerce.boolean().optional(),
  export: z.coerce.boolean().optional(),
  productType: z.string().optional(),
});

// ============ PARAMETER ============
export const parameterSchema = z.object({
  paramName: z.string().min(1, '参数名不能为空').max(100),
  paramNameEn: z.string().max(200).optional().nullable(),
  paramValue: z.string().min(1, '参数值不能为空').max(500),
  unit: z.string().max(20).optional().nullable(),
  description: z.string().optional().nullable(),
  groupName: z.string().optional().default(''),
  groupNameEn: z.string().optional().nullable(),
  isPublic: z.boolean().optional(),
  isAiEnabled: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// ============ IMAGE ============
export const imageSchema = z.object({
  imageType: z.enum(['real_shot', 'main', 'detail', 'ai_render', 'transparent', 'scene', 'poster', 'video_cover']).optional(),
  title: z.string().max(100).optional().nullable(),
  url: z.string().min(1, '图片URL不能为空'),
  altText: z.string().max(200).optional().nullable(),
  isMain: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  isDownloadable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// ============ VIDEO ============
export const videoSchema = z.object({
  title: z.string().min(1, '视频标题不能为空').max(200),
  titleEn: z.string().max(400).optional().nullable(),
  videoType: z.enum(['principle_animation', 'installation', 'spray_effect', 'troubleshooting', 'customer_case', 'maintenance', 'english_explanation', 'factory_tour', 'exhibition']).optional(),
  videoUrl: z.string().min(1, '视频URL不能为空'),
  coverImage: z.string().url().optional().nullable().or(z.literal('')),
  duration: z.number().int().optional().nullable(),
  language: z.enum(['zh', 'en', 'other']).optional(),
  isPublic: z.boolean().optional(),
  isAiRecommendable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

// ============ DOCUMENT ============
export const documentSchema = z.object({
  title: z.string().min(1, '资料名称不能为空').max(200),
  titleEn: z.string().max(400).optional().nullable(),
  documentType: z.enum(['product_manual', 'spec_sheet', 'selection_guide', 'installation_manual', 'service_manual', 'pricing_info', 'english_material', 'product_catalog']).optional(),
  fileUrl: z.string().min(1, '文件URL不能为空'),
  fileSize: z.number().int().optional().nullable(),
  fileType: z.string().max(20).optional().nullable(),
  language: z.enum(['zh', 'en', 'other']).optional(),
  version: z.string().max(20).optional().nullable(),
  isDownloadable: z.boolean().optional(),
  isAiEnabled: z.boolean().optional(),
  permissionLevel: z.enum(['public', 'after_inquiry', 'internal']).optional(),
});

// ============ FAQ ============
export const faqSchema = z.object({
  question: z.string().min(1, '问题不能为空'),
  answer: z.string().min(1, '答案不能为空'),
  questionEn: z.string().optional().nullable(),
  answerEn: z.string().optional().nullable(),
  questionType: z.enum(['selection', 'installation', 'usage', 'troubleshooting', 'after_sales', 'pricing', 'delivery', 'safety', 'foreign_trade']).optional(),
  isPublic: z.boolean().optional(),
  isAiEnabled: z.boolean().optional(),
  riskLevel: z.enum(['normal', 'need_confirm', 'block_ai']).optional(),
  reviewStatus: z.enum(['pending', 'approved', 'needs_revision']).optional(),
  sortOrder: z.number().int().optional(),
});

// ============ SALESPERSON ============
export const salespersonSchema = z.object({
  name: z.string().min(1, '姓名不能为空').max(50),
  department: z.enum(['domestic', 'foreign_trade', 'after_sales', 'dealer']).optional(),
  title: z.string().max(50).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  wechatQr: z.string().url().optional().nullable().or(z.literal('')),
  whatsapp: z.string().max(20).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  region: z.string().max(50).optional().nullable(),
  productLines: z.any().optional(),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'slug格式不正确'),
  isActive: z.boolean().optional(),
  roleLevel: z.enum(['sales', 'manager', 'admin']).optional(),
});

// ============ INQUIRY ============
export const inquirySchema = z.object({
  customerName: z.string().min(1, '请输入姓名').max(50),
  company: z.string().max(100).optional().nullable().or(z.literal('')),
  phone: z.string().max(30).optional().nullable().or(z.literal('')),
  whatsapp: z.string().max(30).optional().nullable().or(z.literal('')),
  email: z.string().email('邮箱格式不正确').optional().nullable().or(z.literal('')),
  region: z.string().max(50).optional().nullable().or(z.literal('')),
  productId: z.string().optional().nullable(),
  requirement: z.string().min(1, '请描述您的需求').max(2000),
  sourcePage: z.string().optional().nullable(),
  salespersonId: z.string().optional().nullable(),
  sourceType: z.enum(['salesperson', 'exhibition', 'dealer', 'public', 'foreign_trade']).optional().default('public'),
  needQuote: z.boolean().optional(),
  needSample: z.boolean().optional(),
});

export const inquiryUpdateSchema = z.object({
  followStatus: z.enum(['new', 'contacted', 'quoting', 'closed_won', 'closed_lost']).optional(),
  intentLevel: z.enum(['normal', 'high', 'key_account']).optional(),
  remark: z.string().max(1000).optional().nullable(),
  handledById: z.string().optional().nullable(),
  nextFollowTime: z.string().optional().nullable(),
});

// ============ EVENT ============
export const eventSchema = z.object({
  visitorId: z.string().min(1),
  sessionId: z.string().min(1),
  salespersonId: z.string().optional(),
  eventType: z.enum([
    'page_view', 'category_view', 'product_view', 'search',
    'phone_click', 'wechat_click', 'whatsapp_click', 'document_download',
    'video_play', 'video_progress', 'inquiry_submit',
    'ai_chat_start', 'ai_transfer_human', 'scroll_depth', 'time_on_page',
  ]),
  pageUrl: z.string().min(1),
  pageTitle: z.string().optional(),
  productId: z.string().optional(),
  documentId: z.string().optional(),
  videoId: z.string().optional(),
  keyword: z.string().optional(),
  duration: z.number().int().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const eventBatchSchema = z.object({
  events: z.array(eventSchema).min(1).max(50),
});

// ============ AI ============
export const aiChatSchema = z.object({
  message: z.string().min(1, '请输入问题').max(2000),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().default([]),
  language: z.enum(['zh', 'en']).optional().default('zh'),
});

export const aiRecommendSchema = z.object({
  industry: z.string().min(1, '请选择行业').max(100),
  material: z.string().max(100).optional(),
  dailyOutput: z.string().max(100).optional(),
  budget: z.string().max(100).optional(),
  coatingType: z.string().max(100).optional(),
  language: z.enum(['zh', 'en']).optional().default('zh'),
});

// ============ SETTINGS ============
export const settingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string().min(1),
    value: z.string(),
  })),
});

// ============ HELPER ============
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    const { ValidationError } = require('./errors');
    throw new ValidationError('数据验证失败', result.error.flatten().fieldErrors);
  }
  return result.data;
}

export function validateQuery<T>(schema: z.ZodSchema<T>, searchParams: URLSearchParams): T {
  const obj: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    obj[key] = value;
  });
  const result = schema.safeParse(obj);
  if (!result.success) {
    const { ValidationError } = require('./errors');
    throw new ValidationError('参数验证失败', result.error.flatten().fieldErrors);
  }
  return result.data;
}
