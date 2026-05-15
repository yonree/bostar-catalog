import { InquiryForm } from '@/components/inquiry/InquiryForm';

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">联系我们</h1>
      <p className="text-sm text-neutral-500 mb-8">请填写以下表单，我们将尽快与您联系。</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-100 p-6">
            <InquiryForm />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-neutral-100 p-4">
            <h3 className="text-sm font-medium text-neutral-800 mb-3">联系方式</h3>
            <div className="space-y-3 text-sm text-neutral-600">
              <div>
                <p className="text-xs text-neutral-400">电话</p>
                <a href="tel:400-xxx-xxxx" className="text-brand-600 font-medium">400-xxx-xxxx</a>
              </div>
              <div>
                <p className="text-xs text-neutral-400">邮箱</p>
                <a href="mailto:info@bostar.com" className="text-brand-600">info@bostar.com</a>
              </div>
              <div>
                <p className="text-xs text-neutral-400">地址</p>
                <p>广东省东莞市</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
