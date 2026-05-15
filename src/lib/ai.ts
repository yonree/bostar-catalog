import { prisma } from './prisma';
import type { AIChatRequest, AIChatResponse, AIRecommendRequest } from '@/types';

const DIFY_API_URL = process.env.DIFY_API_URL || '';
const DIFY_API_KEY = process.env.DIFY_API_KEY || '';

interface DifyResponse {
  answer: string;
  metadata?: {
    products?: string[];
    documents?: string[];
  };
}

export async function chatWithAI(request: AIChatRequest): Promise<AIChatResponse> {
  // If Dify is not configured, use mock responses
  if (!DIFY_API_URL || !DIFY_API_KEY) {
    return getMockChatResponse(request.message, request.language);
  }

  try {
    // Build product context for AI
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        name: true,
        nameEn: true,
        slug: true,
        model: true,
        tagline: true,
        taglineEn: true,
        description: true,
        descriptionEn: true,
        mainImage: true,
        productType: true,
        category: { select: { name: true, nameEn: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const productContext = products.map((p) =>
      `[${p.model || ''}] ${request.language === 'en' && p.nameEn ? p.nameEn : p.name}: ${request.language === 'en' && p.taglineEn ? p.taglineEn : p.tagline || ''}`
    ).join('\n');

    const systemPrompt = request.language === 'en'
      ? `You are BOSTAR product advisor. Answer based on the following product catalog:\n\n${productContext}\n\nRules: Only use knowledge base data. Do not invent parameters or prices. For quotes, customization, or complex applications, suggest contacting a sales representative.`
      : `你是博士达(BOSTAR)产品顾问。请基于以下产品目录回答问题：\n\n${productContext}\n\n规则：只能基于知识库资料回答。不得编造产品参数、价格、交期。涉及报价、定制方案、复杂工况时，引导客户提交询盘或联系业务员。`;

    const res = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        query: request.message,
        inputs: { language: request.language },
        response_mode: 'blocking',
        user: 'bostar-customer',
        conversation_id: '',
      }),
    });

    if (!res.ok) throw new Error(`Dify API error: ${res.status}`);

    const data = await res.json();

    // Extract product recommendations from AI response
    const recommendations = extractRecommendations(data.answer, products, request.language);

    return {
      reply: data.answer,
      recommendations: {
        products: recommendations.products,
        documents: [],
        videos: [],
      },
    };
  } catch (error) {
    console.error('AI chat error:', error);
    return getMockChatResponse(request.message, request.language);
  }
}

export async function recommendProductsGPT(request: AIRecommendRequest): Promise<AIChatResponse> {
  // For now, return mock recommendations
  const products = await prisma.product.findMany({
    where: { isPublished: true },
    select: { id: true, name: true, nameEn: true, slug: true, mainImage: true, tagline: true },
    take: 3,
    orderBy: { sortOrder: 'asc' },
  });

  return {
    reply: request.language === 'en'
      ? `Based on your requirements (industry: ${request.industry}), here are recommended products:`
      : `根据您的需求（行业：${request.industry}），为您推荐以下产品：`,
    recommendations: {
      products: products.map((p) => ({
        id: p.id,
        name: request.language === 'en' && p.nameEn ? p.nameEn : p.name,
        slug: p.slug,
        mainImage: p.mainImage || undefined,
        tagline: request.language === 'en' ? undefined : (p.tagline || undefined),
      })),
      documents: [],
      videos: [],
    },
  };
}

function extractRecommendations(
  text: string,
  products: { id: string; name: string; nameEn: string | null; slug: string; mainImage: string | null; tagline: string | null; model: string | null }[],
  language: string
): { products: AIChatResponse['recommendations']['products'] } {
  const found: AIChatResponse['recommendations']['products'] = [];
  for (const p of products) {
    if (p.model && text.includes(p.model)) {
      found.push({
        id: p.id,
        name: language === 'en' && p.nameEn ? p.nameEn : p.name,
        slug: p.slug,
        mainImage: p.mainImage || undefined,
        tagline: language === 'en' ? undefined : (p.tagline || undefined),
      });
    }
    if (text.includes(p.name) || (p.nameEn && text.includes(p.nameEn))) {
      if (!found.find((f) => f.id === p.id)) {
        found.push({
          id: p.id,
          name: language === 'en' && p.nameEn ? p.nameEn : p.name,
          slug: p.slug,
          mainImage: p.mainImage || undefined,
          tagline: language === 'en' ? undefined : (p.tagline || undefined),
        });
      }
    }
  }
  return { products: found.slice(0, 3) };
}

async function getMockChatResponse(message: string, language: string): Promise<AIChatResponse> {
  const isEN = language === 'en';
  let reply = '';

  if (message.includes('铝合金') || message.includes('aluminum') || message.includes('门窗') || message.includes('window')) {
    reply = isEN
      ? 'For aluminum window frame powder coating, we recommend:\n\n1. BSD-6020 Manual Powder Spray Gun — for small batch, multi-variety\n2. BSD-8010 Automatic Powder Spray Gun with reciprocator — for mass production\n\nKey tips:\n- Use epoxy-polyester hybrid powder for indoor, pure polyester for outdoor\n- Consider pre-treatment process (degreasing, phosphating)\n\nFor pricing and detailed solutions, please submit an inquiry or contact our sales team.'
      : '对于铝合金门窗粉末喷涂，建议：\n\n1. BSD-6020 手动粉末静电喷枪 — 适合多品种小批量\n2. BSD-8010 自动粉末静电喷枪配往复机 — 适合大批量生产\n\n选型要点：\n- 室内用环氧聚酯混合粉，户外用纯聚酯粉\n- 注意前处理工艺（脱脂、磷化）\n\n如需报价和详细方案，请提交询盘或联系销售人员。';
  } else if (message.includes('DISK') || message.includes('disk') || message.includes('旋碟')) {
    reply = isEN
      ? 'The BSD-DISK200 Electrostatic Disk Spray System is ideal for:\n\n1. Automotive wheel hubs\n2. Home appliance shells\n3. Metal pipes\n4. Metal furniture\n5. Construction profiles\n\nAdvantages:\n- Paint utilization ≥90%\n- Daily capacity up to 100,000 pieces\n- PLC intelligent control, unmanned operation\n\nFor custom solutions, please contact our technical team.'
      : 'BSD-DISK200 静电旋碟喷涂系统适合：\n\n1. 汽车轮毂\n2. 家电外壳\n3. 金属管件\n4. 金属家具\n5. 建材型材\n\n核心优势：涂料利用率≥90%，日产能可达10万件，PLC智能控制，无人化操作。\n\n如需定制方案，请联系技术人员。';
  } else {
    reply = isEN
      ? 'Thank you for your inquiry! I am the BOSTAR AI Product Advisor. I can help you with:\n\n- Product selection advice\n- Technical parameter comparison\n- Usage and maintenance guidance\n- Troubleshooting\n\nPlease describe your specific needs (workpiece type, production volume, coating type, etc.) and I will recommend suitable products.\n\nFor pricing and custom solutions, please submit an inquiry or contact our sales team.'
      : '感谢您的咨询！我是BOSTAR AI产品顾问，可以帮您解答：\n\n- 产品选型建议\n- 技术参数对比\n- 使用维护指南\n- 设备故障排查\n\n请具体描述您的需求（喷涂工件类型、产能要求、涂料类型等），我会为您推荐合适的产品方案。\n\n如需报价和定制方案，请提交询盘或联系人工技术人员。';
  }

  return {
    reply,
    recommendations: { products: [], documents: [], videos: [] },
  };
}
