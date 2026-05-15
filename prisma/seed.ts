import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ============ ROLES ============
  const roles = [
    { name: '超级管理员', slug: 'super_admin', permissions: ['products:read', 'products:write', 'products:delete', 'categories:read', 'categories:write', 'categories:delete', 'images:write', 'videos:write', 'documents:write', 'faqs:write', 'salespersons:read', 'salespersons:write', 'inquiries:read', 'inquiries:write', 'analytics:read', 'users:read', 'users:write', 'settings:read', 'settings:write', 'foreign_trade'] },
    { name: '老板/负责人', slug: 'boss', permissions: ['products:read', 'categories:read', 'salespersons:read', 'inquiries:read', 'analytics:read', 'settings:read'] },
    { name: '产品管理员', slug: 'product_manager', permissions: ['products:read', 'products:write', 'categories:read', 'categories:write', 'faqs:write', 'documents:write'] },
    { name: '设计人员', slug: 'designer', permissions: ['products:read', 'images:write', 'videos:write'] },
    { name: '销售人员', slug: 'salesperson', permissions: ['products:read', 'categories:read', 'inquiries:read', 'inquiries:write'] },
    { name: '外贸人员', slug: 'foreign_trade', permissions: ['products:read', 'categories:read', 'inquiries:read', 'inquiries:write', 'foreign_trade'] },
    { name: '售后/技术人员', slug: 'after_sales', permissions: ['products:read', 'categories:read', 'faqs:write', 'documents:write'] },
    { name: '经销商', slug: 'dealer', permissions: ['products:read', 'categories:read', 'inquiries:read'] },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: role,
      create: role,
    });
  }
  console.log('Roles created.');

  // ============ ADMIN USER ============
  const adminRole = await prisma.role.findUnique({ where: { slug: 'super_admin' } });
  const passwordHash = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@bostar.com' },
    update: {},
    create: {
      email: 'admin@bostar.com',
      passwordHash,
      name: '系统管理员',
      roleId: adminRole!.id,
      language: 'zh',
      status: 'active',
    },
  });
  console.log('Admin user created (admin@bostar.com / admin123).');

  // ============ CATEGORIES ============
  const categories = [
    { name: '公司与品牌', nameEn: 'Company & Brand', slug: 'company-brand', sortOrder: 1, description: '了解博士达公司介绍、品牌理念、资质荣誉、工厂实拍' },
    { name: '粉末静电喷涂设备', nameEn: 'Powder Electrostatic Spray Equipment', slug: 'powder-spray-equipment', sortOrder: 2, description: '手动/自动粉末静电喷枪、控制器、供粉系统' },
    { name: '液体静电喷涂设备', nameEn: 'Liquid Electrostatic Spray Equipment', slug: 'liquid-spray-equipment', sortOrder: 3, description: '液体静电喷枪、静电旋杯、齿轮泵、供漆系统' },
    { name: '自动化喷涂系统', nameEn: 'Automated Spray Systems', slug: 'automation-system', sortOrder: 4, description: 'DISK旋碟系统、往复机、机器人喷涂工作站' },
    { name: '实验与检测设备', nameEn: 'Testing & Inspection Equipment', slug: 'test-inspection-equipment', sortOrder: 5, description: '静电测量仪、油漆电阻测试仪、实验室喷枪' },
    { name: '配件与耗材', nameEn: 'Parts & Consumables', slug: 'parts-consumables', sortOrder: 6, description: '喷嘴、电极、过滤器、软管、密封件等' },
    { name: '行业应用方案', nameEn: 'Industry Solutions', slug: 'industry-solutions', sortOrder: 7, description: '汽车零部件、家电、建材、五金等行业涂装方案' },
    { name: '视频与案例', nameEn: 'Videos & Cases', slug: 'videos-cases', sortOrder: 8, description: '产品视频、喷涂演示、客户案例、展会视频' },
    { name: '资料下载与联系', nameEn: 'Downloads & Contact', slug: 'downloads-contact', sortOrder: 9, description: '产品说明书、技术参数表、选型手册、联系我们' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log('Categories created.');

  // ============ SAMPLE PRODUCTS ============
  const powderCategory = await prisma.category.findUnique({ where: { slug: 'powder-spray-equipment' } });
  const liquidCategory = await prisma.category.findUnique({ where: { slug: 'liquid-spray-equipment' } });
  const autoCategory = await prisma.category.findUnique({ where: { slug: 'automation-system' } });
  const testCategory = await prisma.category.findUnique({ where: { slug: 'test-inspection-equipment' } });

  const products = [
    {
      productCode: 'ES-MP001',
      model: 'BSD-6020',
      name: '手动粉末静电喷枪（气压表款）',
      nameEn: 'Manual Powder Electrostatic Spray Gun (Bar Gauge)',
      categoryId: powderCategory!.id,
      productType: 'single',
      tagline: '操作简便，适合多品种小批量喷涂',
      taglineEn: 'Easy operation, ideal for multi-variety small batch coating',
      description: 'BSD-6020手动粉末静电喷枪采用内置高压模块设计，充电效率高，粉末带电均匀，一次上粉率高。适用于五金、家电、建材等行业的手动涂装作业。',
      descriptionEn: 'BSD-6020 manual powder electrostatic spray gun features built-in high voltage module, high charging efficiency, and uniform powder charging. Suitable for manual coating in hardware, home appliances, and building materials industries.',
      sellingPoints: JSON.stringify(['内置高压模块，安全可靠', '充电效率高，上粉率≥75%', '人体工学设计，长时间操作不疲劳', '模块化结构，维护简单', '多种喷嘴可选，适应不同工件']),
      sellingPointsEn: JSON.stringify(['Built-in HV module, safe and reliable', 'High charging efficiency, powder deposition ≥75%', 'Ergonomic design for long operation time', 'Modular structure, easy maintenance', 'Multiple nozzle options for different workpieces']),
      applications: JSON.stringify(['五金工具涂装', '家电外壳涂装', '建材型材涂装', '汽车零部件涂装', '金属家具涂装']),
      slug: 'bsd-6020',
      isFeatured: true,
      isPublished: true,
      completenessLevel: 'A',
      sortOrder: 1,
    },
    {
      productCode: 'ES-AP001',
      model: 'BSD-8010',
      name: '自动粉末静电喷枪（往复机配套）',
      nameEn: 'Automatic Powder Electrostatic Spray Gun (Reciprocator Mount)',
      categoryId: powderCategory!.id,
      productType: 'single',
      tagline: '高产能自动化喷涂首选',
      taglineEn: 'Top choice for high-capacity automated coating',
      description: 'BSD-8010自动粉末静电喷枪专为自动化产线设计，配合往复机使用可实现24小时连续稳定作业。内置智能电流控制，确保涂层均匀一致。',
      descriptionEn: 'BSD-8010 automatic powder electrostatic spray gun is designed for automated production lines. It works with reciprocators for 24-hour continuous stable operation with intelligent current control for uniform coating.',
      sellingPoints: JSON.stringify(['智能电流控制，涂层厚度一致', '24小时连续稳定运行', '快拆式设计，换色方便', '数字通讯接口，可接入MES系统', 'IP65防护等级']),
      applications: JSON.stringify(['家电自动化涂装线', '建材自动化涂装线', '汽车轮毂自动涂装', '货架层板自动涂装']),
      slug: 'bsd-8010',
      isFeatured: true,
      isPublished: true,
      completenessLevel: 'A',
      sortOrder: 2,
    },
    {
      productCode: 'ES-CC001',
      model: 'BSD-KZ01',
      name: '粉末喷枪控制器（触摸屏款）',
      nameEn: 'Powder Spray Gun Controller (Touch Screen)',
      categoryId: powderCategory!.id,
      productType: 'single',
      tagline: '精准控制，操作直观',
      taglineEn: 'Precise control, intuitive operation',
      description: 'BSD-KZ01粉末喷枪控制器采用7寸彩色触摸屏，可精确控制输出电压、电流、粉末输出量等参数。支持配方存储和调用，最多可存储100组工艺参数。',
      descriptionEn: 'BSD-KZ01 powder gun controller features a 7-inch color touch screen for precise control of output voltage, current, powder output, and other parameters. Supports recipe storage and recall with up to 100 process parameter sets.',
      sellingPoints: JSON.stringify(['7寸彩色触摸屏', '100组配方存储', '电压/电流/粉末量精确控制', '支持远程监控', '异常报警功能']),
      slug: 'bsd-kz01',
      isFeatured: false,
      isPublished: true,
      completenessLevel: 'B',
      sortOrder: 3,
    },
    {
      productCode: 'ES-LS001',
      model: 'BSD-LQ01',
      name: '液体静电喷枪（手持式）',
      nameEn: 'Liquid Electrostatic Spray Gun (Handheld)',
      categoryId: liquidCategory!.id,
      productType: 'single',
      tagline: '漆雾包围效果好，省漆30%以上',
      taglineEn: 'Excellent wrap-around effect, saves 30%+ paint',
      description: 'BSD-LQ01液体静电喷枪采用先进静电雾化技术，漆雾粒子带电均匀，包围效果好，特别适合管状、网架等复杂形状工件喷涂。相比传统空气喷涂可节省油漆30%-60%。',
      descriptionEn: 'BSD-LQ01 liquid electrostatic spray gun uses advanced electrostatic atomization technology. Paint particles are charged uniformly for excellent wrap-around effect, ideal for complex shapes like tubes and frames. Saves 30%-60% paint compared to conventional air spray.',
      sellingPoints: JSON.stringify(['静电雾化，漆雾均匀', '节省油漆30%-60%', '复杂工件包围效果好', '重量轻，操作灵活', '防爆认证']),
      slug: 'bsd-lq01',
      isFeatured: true,
      isPublished: true,
      completenessLevel: 'A',
      sortOrder: 4,
    },
    {
      productCode: 'ES-RC001',
      model: 'BSD-XB100',
      name: '液体静电旋杯（机器人/往复机挂载）',
      nameEn: 'Liquid Electrostatic Rotary Bell (Robot/Reciprocator Mount)',
      categoryId: liquidCategory!.id,
      productType: 'single',
      tagline: '微米级雾化，涂膜如镜面',
      taglineEn: 'Micron-level atomization, mirror-like finish',
      description: 'BSD-XB100液体静电旋杯采用高速旋杯技术，转速可达60000rpm，实现微米级雾化。配合机器人或往复机使用，可达到镜面级涂膜效果，适用于汽车外饰件、3C产品等高要求涂装。',
      descriptionEn: 'BSD-XB100 liquid electrostatic rotary bell uses high-speed bell technology up to 60,000 rpm for micron-level atomization. Used with robots or reciprocators for mirror-like finish, suitable for automotive exterior parts and 3C products.',
      sellingPoints: JSON.stringify(['60000rpm高速旋杯', '微米级雾化', '镜面级涂膜效果', '兼容水性/溶剂型涂料', '德国进口轴承']),
      slug: 'bsd-xb100',
      isFeatured: true,
      isPublished: true,
      completenessLevel: 'A',
      sortOrder: 5,
    },
    {
      productCode: 'ES-DS001',
      model: 'BSD-DISK200',
      name: 'DISK静电旋碟喷涂系统',
      nameEn: 'DISK Electrostatic Disk Spray System',
      categoryId: autoCategory!.id,
      productType: 'system',
      tagline: '全自动流水线涂装方案',
      taglineEn: 'Full automatic conveyor coating solution',
      description: 'BSD-DISK200静电旋碟喷涂系统是一套完整的自动化涂装解决方案，包含旋碟主机、高压电源、供漆系统、控制系统和工件旋转机构。适用于大批量、高产能的流水线涂装作业。',
      descriptionEn: 'BSD-DISK200 is a complete automated coating solution including disk main unit, HV power supply, paint supply system, control system, and workpiece rotation mechanism. Suitable for high-volume, high-capacity conveyor coating.',
      sellingPoints: JSON.stringify(['全自动无人化操作', '涂料利用率≥90%', '日产能可达10万件', 'PLC智能控制', '模块化设计，扩展灵活']),
      applications: JSON.stringify(['汽车轮毂自动涂装', '家电外壳自动涂装', '管件自动涂装', '金属家具自动涂装', '建材型材自动涂装']),
      slug: 'bsd-disk200',
      isFeatured: true,
      isPublished: true,
      completenessLevel: 'A',
      sortOrder: 6,
    },
    {
      productCode: 'ES-RM001',
      model: 'BSD-WFJ300',
      name: '喷涂往复机（立式）',
      nameEn: 'Spray Reciprocator (Vertical)',
      categoryId: autoCategory!.id,
      productType: 'single',
      tagline: '稳定可靠的自动喷涂执行机构',
      taglineEn: 'Reliable automatic spraying actuator',
      description: 'BSD-WFJ300立式喷涂往复机采用伺服电机驱动，运行平稳、定位精准。行程可根据工件尺寸定制，支持多枪挂载，是自动化喷涂线的核心执行机构。',
      descriptionEn: 'BSD-WFJ300 vertical reciprocator uses servo motor for smooth and precise positioning. Stroke customizable by workpiece size. Supports multi-gun mounting, the core actuator for automated coating lines.',
      sellingPoints: JSON.stringify(['伺服电机驱动，精度±1mm', '运行速度可调', '多枪挂载能力', '钢架结构，稳定耐用', '多种行程可选（1.2m-3.0m）']),
      slug: 'bsd-wfj300',
      isFeatured: false,
      isPublished: true,
      completenessLevel: 'B',
      sortOrder: 7,
    },
    {
      productCode: 'ES-EM001',
      model: 'BSD-JCY01',
      name: '静电测量仪',
      nameEn: 'Electrostatic Measuring Instrument',
      categoryId: testCategory!.id,
      productType: 'test_device',
      tagline: '专业级静电参数检测',
      taglineEn: 'Professional electrostatic parameter measurement',
      description: 'BSD-JCY01静电测量仪可精确测量高压输出电压、电流和静电电压，是喷涂设备检测和质量控制的重要工具。便携式设计，适合车间现场和实验室使用。',
      descriptionEn: 'BSD-JCY01 measures HV output voltage, current, and electrostatic voltage precisely. An essential tool for spray equipment testing and quality control. Portable design for workshop and lab use.',
      sellingPoints: JSON.stringify(['高压/静电/电阻多参数测量', '数字显示，读数直观', '便携式设计', '内置电池供电', '测量精度±0.5%']),
      slug: 'bsd-jcy01',
      isFeatured: false,
      isPublished: true,
      completenessLevel: 'B',
      sortOrder: 8,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log('Sample products created.');

  // ============ SAMPLE SALESPERSONS ============
  const salespersonRole = await prisma.role.findUnique({ where: { slug: 'salesperson' } });
  const salesUser = await prisma.user.upsert({
    where: { email: 'zhangsan@bostar.com' },
    update: {},
    create: {
      email: 'zhangsan@bostar.com',
      passwordHash: await bcrypt.hash('123456', 12),
      name: '张三',
      roleId: salespersonRole!.id,
      language: 'zh',
      status: 'active',
    },
  });

  await prisma.salesperson.upsert({
    where: { slug: 'zhangsan' },
    update: {},
    create: {
      userId: salesUser.id,
      name: '张三',
      department: 'domestic',
      title: '华东区销售经理',
      phone: '13800138001',
      wechatQr: '/images/qr/zhangsan-wechat.png',
      whatsapp: '8613800138001',
      email: 'zhangsan@bostar.com',
      region: '华东',
      productLines: JSON.stringify(['powder', 'liquid']),
      slug: 'zhangsan',
      exclusiveUrl: 'https://catalog.bostar.com?sales=zhangsan',
      isActive: true,
      roleLevel: 'manager',
    },
  });

  // Foreign trade salesperson
  const ftRole = await prisma.role.findUnique({ where: { slug: 'foreign_trade' } });
  const ftUser = await prisma.user.upsert({
    where: { email: 'lisa@bostar.com' },
    update: {},
    create: {
      email: 'lisa@bostar.com',
      passwordHash: await bcrypt.hash('123456', 12),
      name: 'Lisa Wang',
      roleId: ftRole!.id,
      language: 'en',
      status: 'active',
    },
  });

  await prisma.salesperson.upsert({
    where: { slug: 'lisa' },
    update: {},
    create: {
      userId: ftUser.id,
      name: 'Lisa Wang',
      department: 'foreign_trade',
      title: 'Overseas Sales Manager',
      phone: '13800138002',
      wechatQr: '/images/qr/lisa-wechat.png',
      whatsapp: '8613800138002',
      email: 'lisa@bostar.com',
      region: 'Global',
      productLines: JSON.stringify(['powder', 'liquid', 'system']),
      slug: 'lisa',
      exclusiveUrl: 'https://catalog.bostar.com/en?sales=lisa',
      isActive: true,
      roleLevel: 'manager',
    },
  });
  console.log('Sample salespersons created.');

  // ============ SYSTEM SETTINGS ============
  const settings = [
    { key: 'site_name', value: 'BOSTAR 静电喷涂设备智能电子画册系统', description: '网站名称' },
    { key: 'site_name_en', value: 'BOSTAR Intelligent Product Catalog System', description: 'English site name' },
    { key: 'company_name', value: '博士达静电喷涂设备有限公司', description: '公司名称' },
    { key: 'company_name_en', value: 'BOSTAR Electrostatic Spray Equipment Co., Ltd.', description: 'English company name' },
    { key: 'contact_phone', value: '400-xxx-xxxx', description: '联系电话' },
    { key: 'contact_email', value: 'info@bostar.com', description: '联系邮箱' },
    { key: 'contact_address', value: '中国广东省东莞市', description: '公司地址' },
    { key: 'contact_address_en', value: 'Dongguan, Guangdong, China', description: 'English address' },
    { key: 'feishu_webhook_url', value: '', description: '飞书Webhook地址' },
    { key: 'dify_api_url', value: '', description: 'Dify API地址' },
    { key: 'dify_api_key', value: '', description: 'Dify API Key' },
    { key: 'ai_enabled', value: 'false', description: '是否启用AI' },
    { key: 'default_language', value: 'zh', description: '默认语言' },
    { key: 'whatsapp_default_message', value: 'Hello, I am interested in BOSTAR products. Please send me more details.', description: 'WhatsApp默认消息（英文）' },
    { key: 'whatsapp_default_message_zh', value: '你好，我对博士达产品感兴趣，请发送更多资料。', description: 'WhatsApp默认消息（中文）' },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }
  console.log('System settings created.');

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
