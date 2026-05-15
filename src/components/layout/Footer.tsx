import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">BOSTAR 博士达</h3>
            <p className="text-sm leading-relaxed text-neutral-400">
              专业静电喷涂设备制造商。提供粉末/液体静电喷涂设备、自动化喷涂系统及配件耗材。
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">快速链接</h4>
            <div className="space-y-2">
              <FooterLink href="/products">产品中心</FooterLink>
              <FooterLink href="/solutions">系统方案</FooterLink>
              <FooterLink href="/videos">视频中心</FooterLink>
              <FooterLink href="/downloads">资料下载</FooterLink>
              <FooterLink href="/ai">AI顾问</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">产品分类</h4>
            <div className="space-y-2">
              <FooterLink href="/categories/powder-spray-equipment">粉末静电喷涂设备</FooterLink>
              <FooterLink href="/categories/liquid-spray-equipment">液体静电喷涂设备</FooterLink>
              <FooterLink href="/categories/automation-system">自动化喷涂系统</FooterLink>
              <FooterLink href="/categories/test-inspection-equipment">实验与检测设备</FooterLink>
              <FooterLink href="/categories/parts-consumables">配件与耗材</FooterLink>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-medium mb-3">联系方式</h4>
            <div className="space-y-2 text-sm text-neutral-400">
              <p>电话: 400-xxx-xxxx</p>
              <p>邮箱: info@bostar.com</p>
              <p>地址: 广东省东莞市</p>
              <div className="flex gap-3 mt-3">
                <Link href="/contact" className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600 transition-colors">
                  联系我们
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-6 text-center text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} BOSTAR 博士达静电喷涂设备有限公司 版权所有
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-sm text-neutral-400 hover:text-white transition-colors">
      {children}
    </Link>
  );
}
