import { NextResponse } from 'next/server';
import { nullableString } from '@/lib/admin-api';
import { prisma } from '@/lib/prisma';

function settingData(body: Record<string, unknown>) {
  return {
    siteName: String(body.siteName || ''),
    brandNameCn: String(body.brandNameCn || ''),
    brandNameEn: String(body.brandNameEn || ''),
    companyName: String(body.companyName || ''),
    slogan: nullableString(body.slogan),
    description: nullableString(body.description),
    productCenterDescription: String(body.productCenterDescription ?? ''),
    homepageHeroEyebrow: nullableString(body.homepageHeroEyebrow),
    homepageHeroTitle: nullableString(body.homepageHeroTitle),
    homepageHeroDescription: nullableString(body.homepageHeroDescription),
    phone: nullableString(body.phone),
    email: nullableString(body.email),
    address: nullableString(body.address),
    wechat: nullableString(body.wechat),
    whatsapp: nullableString(body.whatsapp),
    logoUrl: nullableString(body.logoUrl),
    homepageHeroImageUrl: nullableString(body.homepageHeroImageUrl),
    faviconUrl: nullableString(body.faviconUrl),
    defaultSeoTitle: nullableString(body.defaultSeoTitle),
    defaultSeoDesc: nullableString(body.defaultSeoDesc),
  };
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const item = await prisma.brandSetting.update({ where: { id }, data: settingData(body) });
  return NextResponse.json({ success: true, message: '网站设置已更新。', item });
}
