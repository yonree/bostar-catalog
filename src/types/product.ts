import type {
  ProductStatus,
  Language,
} from '@/lib/constants';

export interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  description?: string | null;
  descriptionEn?: string | null;
  image?: string | null;
  parentId?: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
  products?: Product[];
  _count?: { products: number };
}

export interface ProductParameter {
  id: string;
  productId: string;
  groupName: string;
  groupNameEn?: string | null;
  paramName: string;
  paramNameEn?: string | null;
  paramValue: string;
  unit?: string | null;
  description?: string | null;
  isPublic: boolean;
  isAiEnabled: boolean;
  sortOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  thumbnailUrl?: string | null;
  imageType: string;
  title?: string | null;
  altText?: string | null;
  isMain: boolean;
  isPublic: boolean;
  isDownloadable: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface ProductVideo {
  id: string;
  productId: string;
  title: string;
  titleEn?: string | null;
  videoType: string;
  videoUrl: string;
  coverImage?: string | null;
  duration?: number | null;
  language: string;
  isPublic: boolean;
  isAiRecommendable: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface ProductDocument {
  id: string;
  productId: string;
  title: string;
  titleEn?: string | null;
  documentType: string;
  fileUrl: string;
  fileSize?: number | null;
  fileType?: string | null;
  language: string;
  version?: string | null;
  isDownloadable: boolean;
  isAiEnabled: boolean;
  permissionLevel: string;
  updatedAt: Date;
}

export interface ProductFAQ {
  id: string;
  productId: string;
  question: string;
  answer: string;
  questionEn?: string | null;
  answerEn?: string | null;
  questionType: string;
  isPublic: boolean;
  isAiEnabled: boolean;
  riskLevel: string;
  reviewStatus: string;
  sortOrder: number;
  updatedAt: Date;
}

export interface Product {
  id: string;
  productCode: string;
  model?: string | null;
  name: string;
  nameEn?: string | null;
  categoryId: string;
  productType: string;
  tagline?: string | null;
  taglineEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  sellingPoints?: unknown;
  sellingPointsEn?: unknown;
  applications?: unknown;
  applicationsEn?: unknown;
  mainImage?: string | null;
  isFeatured: boolean;
  isExportVisible: boolean;
  isPublished: boolean;
  completenessLevel: string;
  slug: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  parameters?: ProductParameter[];
  images?: ProductImage[];
  videos?: ProductVideo[];
  documents?: ProductDocument[];
  faqs?: ProductFAQ[];
  _count?: { images?: number; videos?: number; documents?: number };
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  status?: ProductStatus;
  lang?: Language;
  sort?: 'latest' | 'name_asc' | 'name_desc' | 'sort_order';
  featured?: boolean;
  productType?: string;
}
