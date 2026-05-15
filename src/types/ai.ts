export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recommendations?: {
    products: { id: string; name: string; slug: string; mainImage?: string }[];
    documents?: { id: string; title: string }[];
    videos?: { id: string; title: string; coverImage?: string }[];
  };
  timestamp: Date;
}

export interface AIChatRequest {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  language: 'zh' | 'en';
}

export interface AIChatResponse {
  reply: string;
  recommendations: {
    products: { id: string; name: string; slug: string; mainImage?: string; tagline?: string }[];
    documents: { id: string; title: string; fileUrl: string }[];
    videos: { id: string; title: string; coverImage?: string }[];
  };
}

export interface AIRecommendRequest {
  industry: string;
  material?: string;
  dailyOutput?: string;
  budget?: string;
  coatingType?: string;
  language: 'zh' | 'en';
}
