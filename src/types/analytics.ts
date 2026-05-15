import type { Product } from './product';

export interface AnalyticsOverview {
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalInquiries: number;
  highIntentCount: number;
  topProducts: { product: Product; views: number }[];
  topKeywords: { keyword: string; count: number }[];
  downloadCount: number;
  videoPlayCount: number;
  dailyTrend: { date: string; views: number; inquiries: number }[];
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  views: number;
  avgDuration: number;
  downloads: number;
  videoPlays: number;
  inquiries: number;
}

export interface SalespersonAnalytics {
  salespersonId: string;
  salespersonName: string;
  visits: number;
  inquiries: number;
  highIntentCount: number;
  followUpRate: number;
  closedRate: number;
}

export interface ForeignTradeAnalytics {
  countries: { country: string; count: number }[];
  enPageViews: number;
  whatsappClicks: number;
  enDownloads: number;
  foreignTradeInquiries: number;
}
