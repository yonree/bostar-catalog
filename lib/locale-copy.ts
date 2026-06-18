import type { Locale } from '@/lib/i18n';

type NavItem = {
  href: string;
  label: string;
};

type LocaleCopy = {
  homeLabel: string;
  menuOpenLabel: string;
  menuCloseLabel: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  topbar: {
    worktime: string;
    phone: string;
    wechat: string;
    whatsapp: string;
    email: string;
    search: string;
  };
  footerNavTitle: string;
  footerProductsTitle: string;
  footerContactLabels: {
    phone: string;
    email: string;
    address: string;
  };
  copyrightSuffix: string;
  localeSwitchLabel: string;
  navItems: NavItem[];
  leadForm: {
    name: string;
    company: string;
    phone: string;
    email: string;
    whatsapp: string;
    wechat: string;
    country: string;
    workpiece: string;
    workpieceMaterial: string;
    coatingMaterial: string;
    target: string;
    capacity: string;
    demandType: string;
    message: string;
    attachment: string;
    privacyConsent: string;
    submit: string;
    submitting: string;
    success: string;
    upload: string;
    uploadFailed: string;
    placeholders: Record<string, string>;
    demandOptions: string[];
  };
};

const localeCopy: Record<Locale, LocaleCopy> = {
  'zh-CN': {
    homeLabel: '首页',
    menuOpenLabel: '打开菜单',
    menuCloseLabel: '关闭菜单',
    primaryCtaLabel: '获取选型与报价建议',
    secondaryCtaLabel: '预约寄样喷涂测试',
    topbar: {
      worktime: '工作时间 30 分钟内响应',
      phone: '电话咨询',
      wechat: '微信咨询',
      whatsapp: 'WhatsApp',
      email: '邮箱',
      search: '站内搜索',
    },
    footerNavTitle: '站点导航',
    footerProductsTitle: '核心产品线',
    footerContactLabels: {
      phone: '电话',
      email: '邮箱',
      address: '地址',
    },
    copyrightSuffix: '保留所有权利',
    localeSwitchLabel: '切换语言',
    navItems: [
      { href: '/products', label: '产品中心' },
      { href: '/solutions', label: '行业解决方案' },
      { href: '/cases', label: '应用案例' },
      { href: '/knowledge', label: '技术与知识' },
      { href: '/support', label: '服务与支持' },
      { href: '/about', label: '关于博士达' },
    ],
    leadForm: {
      name: '联系人',
      company: '公司名称',
      phone: '电话',
      email: '邮箱',
      whatsapp: 'WhatsApp',
      wechat: '微信',
      country: '国家或地区',
      workpiece: '工件信息',
      workpieceMaterial: '工件材质',
      coatingMaterial: '粉末或涂料',
      target: '目标需求',
      capacity: '产量或线速',
      demandType: '需求类型',
      message: '当前问题与补充说明',
      attachment: '附件上传',
      privacyConsent: '我已阅读并同意隐私政策及表单数据说明。',
      submit: '提交需求',
      submitting: '提交中...',
      success: '提交成功',
      upload: '上传附件',
      uploadFailed: '附件上传失败，请稍后重试。',
      placeholders: {
        name: '请输入联系人姓名',
        company: '请输入公司名称',
        phone: '手机或座机',
        email: 'example@company.com',
        whatsapp: '如需海外沟通可填写',
        wechat: '选填',
        country: '如：中国 / 越南 / 马来西亚',
        workpiece: '如：钣金件、铝型材、工程机械结构件',
        workpieceMaterial: '如：铝、钢、镀锌板、塑料',
        coatingMaterial: '如：环氧粉末、水性漆、溶剂型底漆',
        target: '如：获取报价、配置建议、寄样测试',
        capacity: '如：日产量、线速、批次规模',
        message: '请描述工件材质、尺寸、当前问题、目标膜厚和现有产线情况。',
      },
      demandOptions: ['获取设备配置建议', '预约寄样喷涂测试', '获取报价', '下载资料', '售后与备件支持'],
    },
  },
  en: {
    homeLabel: 'Home',
    menuOpenLabel: 'Open menu',
    menuCloseLabel: 'Close menu',
    primaryCtaLabel: 'Request a Quotation',
    secondaryCtaLabel: 'Request a Sample Coating Test',
    topbar: {
      worktime: 'Response within 30 minutes during business hours',
      phone: 'Call',
      wechat: 'WeChat',
      whatsapp: 'WhatsApp',
      email: 'Email',
      search: 'Search',
    },
    footerNavTitle: 'Navigation',
    footerProductsTitle: 'Core Product Lines',
    footerContactLabels: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
    },
    copyrightSuffix: 'All rights reserved',
    localeSwitchLabel: 'Switch language',
    navItems: [
      { href: '/products', label: 'Products' },
      { href: '/solutions', label: 'Applications' },
      { href: '/cases', label: 'Case Studies' },
      { href: '/knowledge', label: 'Technical Resources' },
      { href: '/support', label: 'Service & Support' },
      { href: '/about', label: 'About BOSTAR' },
    ],
    leadForm: {
      name: 'Contact Name',
      company: 'Company',
      phone: 'Phone',
      email: 'Email',
      whatsapp: 'WhatsApp',
      wechat: 'WeChat',
      country: 'Country or Region',
      workpiece: 'Part or Workpiece',
      workpieceMaterial: 'Part Material',
      coatingMaterial: 'Powder or Coating Material',
      target: 'Target Request',
      capacity: 'Output or Line Speed',
      demandType: 'Request Type',
      message: 'Current Issue and Notes',
      attachment: 'Attachment',
      privacyConsent: 'I agree to the privacy policy and the form data notice.',
      submit: 'Submit Inquiry',
      submitting: 'Submitting...',
      success: 'Submitted',
      upload: 'Upload attachment',
      uploadFailed: 'Attachment upload failed. Please try again.',
      placeholders: {
        name: 'Enter contact name',
        company: 'Company name',
        phone: 'Mobile or landline',
        email: 'example@company.com',
        whatsapp: 'Optional',
        wechat: 'Optional',
        country: 'China / Vietnam / Malaysia / Thailand',
        workpiece: 'Example: appliance panel, aluminum profile, machinery part',
        workpieceMaterial: 'Example: aluminum, steel, galvanized steel, plastic',
        coatingMaterial: 'Example: epoxy powder, waterborne paint',
        target: 'Quotation, sample test, selection support',
        capacity: 'Daily output, takt time, or line speed',
        message: 'Share part material, dimensions, current issue, target finish, and line constraints.',
      },
      demandOptions: ['Request a Quotation', 'Request a Sample Coating Test', 'Selection Support', 'Download Resources', 'After-sales Support'],
    },
  },
};

export function getLocaleCopy(locale: Locale) {
  return localeCopy[locale];
}
