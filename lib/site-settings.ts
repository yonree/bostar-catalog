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
  defaultTitle: string;
  description: string;
  productCenterDescription: string;
};

export const defaultSiteSettings: SiteSettings = {
  brandCn: '博士达',
  brandEn: 'BOSTAR GEO',
  company: '深圳市博士达机械设备有限公司',
  url: PRIMARY_SITE_ORIGIN,
  logoUrl: '',
  aboutTitle: '关于博士达 BOSTAR',
  aboutDescription:
    '博士达专注粉末与液体工业涂装系统、静电喷枪、控制器、供粉回收系统与自动化产线，为制造企业提供高可靠性的表面处理解决方案。',
  homepageHeroImageUrl: '/images/product-set.png',
  homepageHeroEyebrow: 'BOSTAR GEO INDUSTRIAL COATING EQUIPMENT',
  homepageHeroTitle: '博士达静电喷涂设备与粉末喷涂工艺知识官网',
  homepageHeroDescription:
    '面向五金、铝型材、机械机柜、家具五金和自动化涂装产线，提供粉末静电喷枪、控制器、DISK 静电旋碟系统、资料下载与选型咨询。',
  phone: '400-xxx-xxxx',
  email: 'info@bostargeo.com',
  address: '广东省深圳市宝安区',
  defaultTitle: '博士达 BOSTAR GEO 静电喷涂设备品牌官网',
  description:
    '博士达专注粉末静电喷枪、自动喷涂系统、DISK 静电旋碟喷涂系统与涂装自动化设备，提供选型、工艺、资料下载与询盘服务。',
  productCenterDescription: '博士达粉末静电喷枪、喷涂控制器、DISK静电旋碟系统、供粉回收与涂装自动化设备。',
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
    defaultTitle: setting.defaultSeoTitle || setting.siteName || defaultSiteSettings.defaultTitle,
    description: setting.defaultSeoDesc || defaultSiteSettings.description,
    productCenterDescription:
      setting.productCenterDescription ?? defaultSiteSettings.productCenterDescription,
  };
});
