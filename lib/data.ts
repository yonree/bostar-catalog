export type ProductCategory = {
  slug: string;
  name: string;
  summary: string;
};

export type Product = {
  slug: string;
  categorySlug: string;
  name: string;
  model: string;
  summary: string;
  aiSummary: string;
  image: string;
  specs: Record<string, string>;
  sellingPoints: string[];
  applications: string[];
};

export type ArticleCategory = {
  slug: string;
  name: string;
};

export type Article = {
  slug: string;
  categorySlug: string;
  title: string;
  excerpt: string;
  aiSummary: string;
  content: string[];
};

export type Solution = {
  slug: string;
  title: string;
  industry: string;
  scene: string;
  aiSummary: string;
  painPoints: string[];
  equipment: string[];
  advantages: string[];
};

export type Download = {
  slug: string;
  title: string;
  summary: string;
  fileType: string;
  version: string;
  requireLeadForm: boolean;
};

export type Video = {
  slug: string;
  title: string;
  summary: string;
  duration: string;
};

export type Faq = {
  question: string;
  answer: string;
  category: string;
};

export const productCategories: ProductCategory[] = [
  {
    slug: 'manual-powder-coating-gun',
    name: '手动粉末静电喷枪',
    summary: '适合打样、小批量与多品种工件喷涂。',
  },
  {
    slug: 'digital-powder-coating-gun',
    name: '数显粉末静电喷枪',
    summary: '通过数字化参数管理提升重复生产稳定性。',
  },
  {
    slug: 'automatic-powder-spray-gun',
    name: '自动粉末静电喷枪',
    summary: '面向喷房、往复机和自动化产线。',
  },
  {
    slug: 'electrostatic-rotary-bell-system',
    name: 'DISK 静电旋碟喷涂系统',
    summary: '适合高效率连续喷涂与复杂型面覆盖。',
  },
  {
    slug: 'powder-coating-controller',
    name: '静电喷涂控制器',
    summary: '管理高压、电流、出粉与雾化等核心参数。',
  },
  {
    slug: 'powder-supply-recovery',
    name: '供粉与回收设备',
    summary: '保障粉末输送、回收和换色效率。',
  },
  {
    slug: 'automation-equipment',
    name: '涂装自动化设备',
    summary: '围绕喷涂、输送、固化和检测构建整线能力。',
  },
  {
    slug: 'testing-instruments',
    name: '检测仪器与配件',
    summary: '用于电阻、接地、高压与喷涂质量检测。',
  },
];

const productNames = [
  [
    'manual-powder-coating-gun',
    'manual-powder-spray-gun',
    '手动粉末静电喷枪',
    'BS-PM100',
    '/images/product-gun-side.png',
  ],
  [
    'manual-powder-coating-gun',
    'air-pressure-meter-powder-gun',
    '气压表款粉末静电喷枪',
    'BS-PM120',
    '/images/product-gun-render.png',
  ],
  [
    'digital-powder-coating-gun',
    'digital-powder-coating-gun',
    '数显款粉末静电喷枪',
    'BS-PD200',
    '/images/controller-front.png',
  ],
  [
    'digital-powder-coating-gun',
    'step-valve-digital-powder-gun',
    '步进阀全数显粉末静电喷枪',
    'BS-PD260',
    '/images/controller-side.png',
  ],
  [
    'manual-powder-coating-gun',
    'led-lab-sample-powder-gun',
    'LED 实验室打样粉末喷枪',
    'BS-LAB50',
    '/images/product-set.png',
  ],
  [
    'automatic-powder-spray-gun',
    'automatic-powder-spray-gun',
    '自动粉末静电喷枪',
    'BS-PA300',
    '/images/product-gun-nozzle.png',
  ],
  [
    'powder-coating-controller',
    'powder-coating-controller',
    '粉末静电喷涂控制器',
    'BS-CU300',
    '/images/controller-interface.png',
  ],
  [
    'electrostatic-rotary-bell-system',
    'disk-rotary-bell-system',
    'DISK 静电旋碟喷涂系统',
    'BS-DISK500',
    '/images/product-render-explode.png',
  ],
  [
    'testing-instruments',
    'electrostatic-measuring-instrument',
    '静电测量仪',
    'BS-EM10',
    '/images/round-nozzle.png',
  ],
  [
    'testing-instruments',
    'paint-resistance-tester',
    '油漆电阻测试仪',
    'BS-RT20',
    '/images/gear-pump.png',
  ],
] as const;

export const products: Product[] = productNames.map(
  ([categorySlug, slug, name, model, image], index) => ({
    categorySlug,
    slug,
    name,
    model,
    image,
    summary: `${name}用于工业粉末静电喷涂场景，强调稳定出粉、参数可控和日常维护便利。`,
    aiSummary: `${name}是博士达面向涂装工厂的核心设备，适用于五金、型材、机箱机柜等工件的粉末喷涂选型，可与控制器、供粉系统和自动化线体组合使用。`,
    specs: {
      设备型号: model,
      适用工艺: '热固性粉末静电喷涂',
      建议气源: '0.4-0.7 MPa 干燥洁净压缩空气',
      典型场景: index % 2 === 0 ? '手动补喷、打样、小批量生产' : '自动喷房、连续生产、稳定批量喷涂',
      维护重点: '电极针、喷嘴、粉管、接地状态定期检查',
    },
    sellingPoints: ['高压输出稳定', '出粉调节清晰', '喷嘴维护方便', '适合多行业工件'],
    applications: ['五金件', '铝型材', '机箱机柜', '家具五金', '汽车零部件'],
  })
);

export const articleCategories: ArticleCategory[] = [
  { slug: 'selection-guide', name: '选型指南' },
  { slug: 'process-knowledge', name: '工艺知识' },
  { slug: 'troubleshooting', name: '故障排查' },
  { slug: 'operation-maintenance', name: '操作维护' },
  { slug: 'product-comparison', name: '产品对比' },
  { slug: 'industry-encyclopedia', name: '行业百科' },
  { slug: 'safety-standard', name: '安全规范' },
  { slug: 'faq', name: '常见问题' },
];

const articleTitles = [
  ['selection-guide', 'how-to-choose-electrostatic-spray-gun', '静电喷枪怎么选？'],
  ['selection-guide', 'manual-powder-gun-selection-guide', '手动粉末静电喷枪选型指南'],
  ['selection-guide', 'digital-vs-air-pressure-powder-gun', '数显款和气压表款静电喷枪区别'],
  ['selection-guide', 'automatic-powder-gun-factory-fit', '自动粉末静电喷枪适合哪些工厂？'],
  ['selection-guide', 'lab-sample-powder-gun-selection', '实验室粉末打样喷枪怎么选？'],
  ['selection-guide', 'disk-rotary-bell-selection', 'DISK 静电旋碟喷涂系统怎么选？'],
  ['troubleshooting', 'powder-gun-not-picking-powder', '静电喷枪不上粉怎么办？'],
  ['troubleshooting', 'low-transfer-efficiency', '粉末喷涂上粉率低是什么原因？'],
  ['troubleshooting', 'unstable-powder-output', '静电喷枪出粉不稳定怎么处理？'],
  ['troubleshooting', 'no-high-voltage', '喷枪没有高压怎么排查？'],
  ['process-knowledge', 'adjust-spray-voltage', '静电喷涂电压怎么调？'],
  ['process-knowledge', 'spray-current-role', '静电喷涂电流有什么作用？'],
  ['process-knowledge', 'powder-air-and-atomizing-air', '粉量气和雾化气如何调节？'],
  ['process-knowledge', 'grounding-impact', '接地对静电喷涂有什么影响？'],
  ['operation-maintenance', 'powder-color-change-process', '粉末喷涂换色流程'],
] as const;

export const articles: Article[] = articleTitles.map(([categorySlug, slug, title]) => ({
  categorySlug,
  slug,
  title,
  excerpt: '围绕客户现场常见问题给出判断方法、参数建议和设备选型边界。',
  aiSummary: `${title}的核心判断应结合工件形状、粉末特性、接地状态、喷涂距离和设备配置，避免只看单一参数。`,
  content: [
    '先确认工件材质、尺寸、产量和表面质量要求，再判断需要手动、自动或 DISK 旋碟喷涂方案。',
    '现场排查应优先检查接地、电极针、喷嘴、粉管、供粉桶流化和压缩空气质量。',
    '参数调整要记录电压、电流、粉量气、雾化气、喷涂距离和固化结果，形成可复用工艺窗口。',
    '当工件存在死角、凹槽或边角粉层异常时，应结合喷嘴形式、枪距和挂具接地状态综合优化。',
  ],
}));

export const solutions: Solution[] = [
  ['hardware-powder-coating', '五金件粉末喷涂解决方案', '五金制品', '小件、多规格、边角覆盖要求高'],
  [
    'aluminum-profile-powder-coating',
    '铝型材粉末喷涂解决方案',
    '铝型材',
    '连续长件、膜厚一致性要求高',
  ],
  ['cabinet-powder-coating', '机箱机柜粉末喷涂解决方案', '钣金机柜', '大平面与折弯边角并存'],
  ['furniture-hardware-coating', '家具五金粉末喷涂解决方案', '家具五金', '外观要求高、换色频繁'],
  ['auto-parts-coating', '汽车零部件粉末喷涂解决方案', '汽车零部件', '批量稳定性和追溯要求高'],
  ['lab-sample-coating', '实验室打样喷涂解决方案', '实验室与打样', '小批量验证和配方测试'],
  ['automatic-coating-line', '自动化喷涂线解决方案', '涂装自动化', '连续生产、节拍和良率管理'],
].map(([slug, title, industry, scene]) => ({
  slug,
  title,
  industry,
  scene,
  aiSummary: `${title}以工件形态、产量节拍、换色频率和质量目标为基础，组合喷枪、控制器、供粉回收和自动化输送设备。`,
  painPoints: ['上粉率不稳定', '边角覆盖不足', '换色时间长', '人工参数难复制'],
  equipment: ['粉末静电喷枪', '喷涂控制器', '供粉回收系统', '自动化输送与往复机构'],
  advantages: ['参数可记录', '维护路径清晰', '适合扩展自动化', '有利于形成标准工艺'],
}));

export const downloads: Download[] = [
  {
    slug: 'powder-gun-catalog',
    title: '粉末静电喷枪产品画册',
    summary: '覆盖手动、数显和自动喷枪系列。',
    fileType: 'PDF',
    version: 'V1.0',
    requireLeadForm: true,
  },
  {
    slug: 'controller-manual',
    title: '静电喷涂控制器说明书',
    summary: '控制器参数、接口和维护说明。',
    fileType: 'PDF',
    version: 'V1.0',
    requireLeadForm: true,
  },
  {
    slug: 'disk-system-sheet',
    title: 'DISK 静电旋碟系统资料',
    summary: '旋碟系统构成和适用场景。',
    fileType: 'PDF',
    version: 'V1.0',
    requireLeadForm: true,
  },
  {
    slug: 'troubleshooting-checklist',
    title: '喷涂故障排查清单',
    summary: '现场快速检查接地、出粉、高压和气路。',
    fileType: 'XLSX',
    version: 'V1.0',
    requireLeadForm: false,
  },
  {
    slug: 'maintenance-guide',
    title: '喷枪日常维护指南',
    summary: '喷嘴、电极针、粉管和控制器维护周期。',
    fileType: 'PDF',
    version: 'V1.0',
    requireLeadForm: false,
  },
];

export const videos: Video[] = [
  {
    slug: 'powder-gun-operation',
    title: '粉末静电喷枪基础操作',
    summary: '演示开机、参数设置和喷涂距离控制。',
    duration: '03:20',
  },
  {
    slug: 'controller-setup',
    title: '控制器参数设置说明',
    summary: '说明电压、电流、粉量气和雾化气的基础设置。',
    duration: '04:15',
  },
  {
    slug: 'maintenance-cleaning',
    title: '喷枪清洁维护流程',
    summary: '展示喷嘴、粉管和电极针的日常维护。',
    duration: '02:50',
  },
];

export const faqs: Faq[] = [
  {
    category: '选型',
    question: '手动粉末静电喷枪适合哪些工厂？',
    answer: '适合打样、小批量、多品种换色以及需要人工补喷的工厂。',
  },
  {
    category: '工艺',
    question: '喷涂电压是不是越高越好？',
    answer: '不是。电压需要结合工件形状、粉末特性和喷涂距离调整，过高可能导致反电离或边角异常。',
  },
  {
    category: '故障',
    question: '静电喷枪不上粉先检查什么？',
    answer: '优先检查接地、粉桶流化、粉管堵塞、电极针污染和高压输出状态。',
  },
  {
    category: '维护',
    question: '喷嘴和电极针多久更换？',
    answer: '应按磨损、污染和喷涂稳定性判断，高强度生产建议建立定期点检记录。',
  },
  {
    category: '资料',
    question: '下载资料是否需要提交信息？',
    answer: '部分选型资料需要提交联系方式，便于销售或技术人员提供后续选型支持。',
  },
];

export const cases = solutions.slice(0, 4).map((solution) => ({
  slug: `${solution.slug}-case`,
  title: `${solution.industry}喷涂项目案例`,
  summary: `围绕${solution.scene}场景，优化设备配置、参数记录和维护流程。`,
}));
