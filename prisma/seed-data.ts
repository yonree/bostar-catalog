export const siteSeed = {
  siteName: '博士达 BOSTAR GEO',
  brandNameCn: '博士达',
  brandNameEn: 'BOSTAR GEO',
  companyName: '深圳市博士达机械设备有限公司',
  slogan: '静电喷涂设备与工艺知识中心',
  description: '粉末静电喷枪、自动喷涂系统、DISK 静电旋碟喷涂系统与涂装自动化设备官网。',
  phone: '400-000-0000',
  email: 'sales@example.com',
  address: '广东省深圳市',
  defaultSeoTitle: '博士达 BOSTAR GEO 静电喷涂设备品牌官网',
  defaultSeoDesc: '博士达专注粉末静电喷枪、控制器、DISK 静电旋碟系统与涂装自动化设备。',
};

export const productCategories = [
  ['manual-powder-coating-gun', '手动粉末静电喷枪'],
  ['digital-powder-coating-gun', '数显粉末静电喷枪'],
  ['automatic-powder-spray-gun', '自动粉末静电喷枪'],
  ['electrostatic-rotary-bell-system', 'DISK 静电旋碟喷涂系统'],
  ['powder-coating-controller', '静电喷涂控制器'],
  ['powder-supply-recovery', '供粉与回收设备'],
  ['automation-equipment', '涂装自动化设备'],
  ['testing-instruments', '检测仪器与配件'],
].map(([slug, name], sortOrder) => ({
  slug,
  name,
  summary: `${name}系列`,
  sortOrder,
  isPublished: true,
}));

export const articleCategories = [
  ['selection-guide', '选型指南'],
  ['process-knowledge', '工艺知识'],
  ['troubleshooting', '故障排查'],
  ['operation-maintenance', '操作维护'],
  ['product-comparison', '产品对比'],
  ['industry-encyclopedia', '行业百科'],
  ['safety-standard', '安全规范'],
  ['faq', '常见问题'],
].map(([slug, name], sortOrder) => ({ slug, name, sortOrder, isPublished: true }));

export const products = [
  ['manual-powder-coating-gun', 'manual-powder-spray-gun', '手动粉末静电喷枪', 'BS-PM100'],
  [
    'manual-powder-coating-gun',
    'air-pressure-meter-powder-gun',
    '气压表款粉末静电喷枪',
    'BS-PM120',
  ],
  ['digital-powder-coating-gun', 'digital-powder-coating-gun', '数显款粉末静电喷枪', 'BS-PD200'],
  [
    'digital-powder-coating-gun',
    'step-valve-digital-powder-gun',
    '步进阀全数显粉末静电喷枪',
    'BS-PD260',
  ],
  ['manual-powder-coating-gun', 'led-lab-sample-powder-gun', 'LED 实验室打样粉末喷枪', 'BS-LAB50'],
  ['automatic-powder-spray-gun', 'automatic-powder-spray-gun', '自动粉末静电喷枪', 'BS-PA300'],
  ['powder-coating-controller', 'powder-coating-controller', '粉末静电喷涂控制器', 'BS-CU300'],
  [
    'electrostatic-rotary-bell-system',
    'disk-rotary-bell-system',
    'DISK 静电旋碟喷涂系统',
    'BS-DISK500',
  ],
  ['testing-instruments', 'electrostatic-measuring-instrument', '静电测量仪', 'BS-EM10'],
  ['testing-instruments', 'paint-resistance-tester', '油漆电阻测试仪', 'BS-RT20'],
].map(([categorySlug, slug, name, model]) => ({
  categorySlug,
  slug,
  data: {
    slug,
    name,
    model,
    summary: `${name}用于工业粉末静电喷涂场景。`,
    aiSummary: `${name}适用于粉末喷涂设备选型、工艺调试和现场维护。`,
    specs: { model, craft: '粉末静电喷涂' },
    isPublished: true,
  },
}));

export const articles = [
  ['selection-guide', 'how-to-choose-electrostatic-spray-gun', '静电喷枪怎么选？'],
  ['selection-guide', 'manual-powder-gun-selection-guide', '手动粉末静电喷枪选型指南'],
  ['troubleshooting', 'powder-gun-not-picking-powder', '静电喷枪不上粉怎么办？'],
  ['process-knowledge', 'adjust-spray-voltage', '静电喷涂电压怎么调？'],
].map(([categorySlug, slug, title]) => ({
  categorySlug,
  slug,
  data: {
    slug,
    title,
    excerpt: '围绕现场问题给出判断方法和设备建议。',
    content: '问题定义、常见原因、排查方法、解决方案和预防建议。',
    aiSummary: `${title}需要结合工件、接地、粉末和设备参数综合判断。`,
    isPublished: true,
    publishedAt: new Date(),
  },
}));

export const faqs = [
  {
    question: '静电喷枪不上粉怎么办？',
    answer: '优先检查接地、粉管、喷嘴、电极针和高压输出。',
    category: '故障',
  },
  {
    question: '电压越高越好吗？',
    answer: '不是，电压需要结合工件形状和粉末特性调整。',
    category: '工艺',
  },
];

export const solutions = [
  'hardware-powder-coating',
  'aluminum-profile-powder-coating',
  'cabinet-powder-coating',
  'furniture-hardware-coating',
  'auto-parts-coating',
  'lab-sample-coating',
  'automatic-coating-line',
].map((slug) => ({
  slug,
  title: `${slug} 解决方案`,
  industry: '工业涂装',
  scene: '粉末喷涂',
  aiSummary: '按工件、产量、换色和质量目标组合设备。',
  isPublished: true,
}));

export const downloads = [
  ['powder-gun-catalog', '粉末静电喷枪产品画册'],
  ['controller-manual', '静电喷涂控制器说明书'],
  ['disk-system-sheet', 'DISK 静电旋碟系统资料'],
  ['troubleshooting-checklist', '喷涂故障排查清单'],
  ['maintenance-guide', '喷枪日常维护指南'],
].map(([slug, title]) => ({
  slug,
  title,
  fileUrl: '/sample-download.pdf',
  fileType: 'PDF',
  version: 'V1.0',
  summary: title,
  isPublished: true,
}));

export const videos = [
  ['powder-gun-operation', '粉末静电喷枪基础操作'],
  ['controller-setup', '控制器参数设置说明'],
  ['maintenance-cleaning', '喷枪清洁维护流程'],
].map(([slug, title]) => ({
  slug,
  title,
  videoUrl: '/videos/demo.mp4',
  summary: title,
  isPublished: true,
}));
