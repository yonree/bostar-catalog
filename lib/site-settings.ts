import { cache } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { PRIMARY_SITE_ORIGIN } from '@/lib/site-origin';

export type SiteSettings = {
  brandCn: string;
  brandEn: string;
  company: string;
  url: string;
  logoUrl: string;
  aboutTitle: string;
  aboutDescription: string;
  homepageHeroImageUrl: string;
  homepageHeroEyebrow: string;
  homepageHeroTitle: string;
  homepageHeroDescription: string;
  phone: string;
  email: string;
  address: string;
  wechat: string;
  whatsapp: string;
  workHours: string;
  responsePromise: string;
  defaultTitle: string;
  description: string;
  productCenterDescription: string;
};

export const defaultSiteSettings: SiteSettings = {
  brandCn: '博士达',
  brandEn: 'BOSTAR',
  company: '深圳市博士达机械设备有限公司',
  url: PRIMARY_SITE_ORIGIN,
  logoUrl: '',
  aboutTitle: '关于博士达',
  aboutDescription:
    '博士达聚焦粉末与液体静电喷涂核心设备、旋杯雾化系统及自动化配套设备，为工业制造企业提供更稳定、可验证的喷涂能力。',
  homepageHeroImageUrl: '/images/product-set.png',
  homepageHeroEyebrow: '静电喷涂核心设备制造商',
  homepageHeroTitle: '让静电喷涂更稳定、更高效、更易控制',
  homepageHeroDescription:
    '自主研发制造粉末与液体静电喷枪、旋杯雾化器及自动化配套设备，为工业制造提供可验证、可复制的喷涂能力。',
  phone: '400-000-0000',
  email: 'sales@fjbosd.com',
  address: '中国广东省深圳市',
  wechat: 'BOSTAR-Service',
  whatsapp: '+86 000 0000 0000',
  workHours: '周一至周六 08:30 - 18:00 (UTC+8)',
  responsePromise: '工作时间内 30 分钟响应',
  defaultTitle: '博士达 BOSTAR 静电喷涂核心设备制造商',
  description:
    '博士达官网提供静电喷涂核心设备、行业解决方案、工程案例、技术知识、寄样测试与询盘支持。',
  productCenterDescription:
    '围绕粉末静电喷涂设备、液体静电喷涂设备、旋杯雾化器与 DISK、自动化配套设备，建立可选型、可比较、可验证的工业产品体系。',
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  noStore();

  let setting;
  try {
    setting = await prisma.brandSetting.findFirst({
      orderBy: { updatedAt: 'desc' },
    });
  } catch {
    return defaultSiteSettings;
  }

  if (!setting) {
    return defaultSiteSettings;
  }

  return {
    brandCn: setting.brandNameCn || defaultSiteSettings.brandCn,
    brandEn: setting.brandNameEn || defaultSiteSettings.brandEn,
    company: setting.companyName || defaultSiteSettings.company,
    url: PRIMARY_SITE_ORIGIN,
    logoUrl: setting.logoUrl || defaultSiteSettings.logoUrl,
    aboutTitle: setting.slogan || defaultSiteSettings.aboutTitle,
    aboutDescription: setting.description || defaultSiteSettings.aboutDescription,
    homepageHeroImageUrl: setting.homepageHeroImageUrl || defaultSiteSettings.homepageHeroImageUrl,
    homepageHeroEyebrow: setting.homepageHeroEyebrow || defaultSiteSettings.homepageHeroEyebrow,
    homepageHeroTitle: setting.homepageHeroTitle || defaultSiteSettings.homepageHeroTitle,
    homepageHeroDescription:
      setting.homepageHeroDescription || defaultSiteSettings.homepageHeroDescription,
    phone: setting.phone || defaultSiteSettings.phone,
    email: setting.email || defaultSiteSettings.email,
    address: setting.address || defaultSiteSettings.address,
    wechat: setting.wechat || defaultSiteSettings.wechat,
    whatsapp: setting.whatsapp || defaultSiteSettings.whatsapp,
    workHours: defaultSiteSettings.workHours,
    responsePromise: defaultSiteSettings.responsePromise,
    defaultTitle: setting.defaultSeoTitle || setting.siteName || defaultSiteSettings.defaultTitle,
    description: setting.defaultSeoDesc || defaultSiteSettings.description,
    productCenterDescription:
      setting.productCenterDescription ?? defaultSiteSettings.productCenterDescription,
  };
});
