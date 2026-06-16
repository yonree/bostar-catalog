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
    region: string;
    demandType: string;
    message: string;
    submit: string;
    submitting: string;
    success: string;
    placeholders: {
      name: string;
      company: string;
      phone: string;
      region: string;
      message: string;
    };
    demandOptions: string[];
  };
};

const localeCopy: Record<Locale, LocaleCopy> = {
  'zh-CN': {
    homeLabel: '首页',
    menuOpenLabel: '打开菜单',
    menuCloseLabel: '关闭菜单',
    primaryCtaLabel: '获取技术方案',
    footerNavTitle: '网站导航',
    footerProductsTitle: '核心设备',
    footerContactLabels: {
      phone: '电话',
      email: '邮箱',
      address: '地址',
    },
    copyrightSuffix: '版权所有',
    localeSwitchLabel: '切换语言',
    navItems: [
      { href: '/solutions', label: '涂装解决方案' },
      { href: '/products', label: '产品与设备' },
      { href: '/knowledge', label: '技术与知识' },
      { href: '/about', label: '关于 BOSTAR' },
      { href: '/contact', label: '联系咨询' },
    ],
    leadForm: {
      name: '姓名 *',
      company: '公司',
      phone: '电话',
      email: '邮箱',
      region: '地区',
      demandType: '需求类型',
      message: '当前问题或工件信息',
      submit: '提交询盘',
      submitting: '提交中...',
      success: '提交完成',
      placeholders: {
        name: '请输入姓名',
        company: '公司名称',
        phone: '手机或座机',
        region: '如：广东佛山',
        message: '请描述工件、材料、产量、现有问题，或希望了解的设备信息。',
      },
      demandOptions: ['设备选型', '获取报价', '资料下载', '售后与维护'],
    },
  },
  en: {
    homeLabel: 'Home',
    menuOpenLabel: 'Open menu',
    menuCloseLabel: 'Close menu',
    primaryCtaLabel: 'Request a Technical Plan',
    footerNavTitle: 'Navigation',
    footerProductsTitle: 'Core Equipment',
    footerContactLabels: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
    },
    copyrightSuffix: 'All rights reserved',
    localeSwitchLabel: 'Switch language',
    navItems: [
      { href: '/solutions', label: 'Solutions' },
      { href: '/products', label: 'Products' },
      { href: '/knowledge', label: 'Knowledge' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
    leadForm: {
      name: 'Name *',
      company: 'Company',
      phone: 'Phone',
      email: 'Email',
      region: 'Region',
      demandType: 'Request Type',
      message: 'Project Details',
      submit: 'Submit Inquiry',
      submitting: 'Submitting...',
      success: 'Submitted',
      placeholders: {
        name: 'Enter your name',
        company: 'Company name',
        phone: 'Mobile or landline',
        region: 'Example: Foshan, Guangdong',
        message: 'Describe the part, material, output, current issue, or the equipment information you need.',
      },
      demandOptions: ['Product selection', 'Request quotation', 'Download resources', 'Service and support'],
    },
  },
};

export function getLocaleCopy(locale: Locale) {
  return localeCopy[locale];
}
