import { AdminShell } from '@/components/admin/AdminShell';
import { CmsManager } from '@/components/admin/CmsManager';

export default function AdminSettingsPage() {
  return (
    <AdminShell title="网站设置">
      <CmsManager
        title="网站设置"
        endpoint="/api/admin/settings"
        columns={[
          { key: 'siteName', label: '站点名称' },
          { key: 'brandNameCn', label: '中文品牌' },
          { key: 'brandNameEn', label: '英文品牌' },
          { key: 'companyName', label: '公司名称' },
        ]}
        fields={[
          { name: 'siteName', label: '站点名称', required: true },
          { name: 'brandNameCn', label: '中文品牌', required: true },
          { name: 'brandNameEn', label: '英文品牌', required: true },
          { name: 'companyName', label: '公司名称', required: true },
          { name: 'slogan', label: '关于页标题' },
          { name: 'description', label: '关于页描述', type: 'textarea' },
          { name: 'homepageHeroEyebrow', label: '首页眉标' },
          { name: 'homepageHeroTitle', label: '首页主标题', type: 'textarea' },
          { name: 'homepageHeroDescription', label: '首页主描述', type: 'textarea' },
          { name: 'productCenterDescription', label: '产品中心说明', type: 'textarea' },
          { name: 'phone', label: '电话' },
          { name: 'email', label: '邮箱' },
          { name: 'address', label: '地址' },
          { name: 'wechat', label: '微信' },
          { name: 'whatsapp', label: 'WhatsApp' },
          { name: 'logoUrl', label: 'Logo URL', type: 'media' },
          { name: 'homepageHeroImageUrl', label: '首页主图 URL', type: 'media' },
          { name: 'faviconUrl', label: 'Favicon URL', type: 'media' },
          { name: 'defaultSeoTitle', label: '默认 SEO 标题' },
          { name: 'defaultSeoDesc', label: '默认 SEO 描述', type: 'textarea' },
        ]}
      />
    </AdminShell>
  );
}
