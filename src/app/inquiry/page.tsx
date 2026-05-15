import { InquiryForm } from '@/components/inquiry/InquiryForm';

export default function InquiryPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">在线询盘</h1>
      <p className="text-sm text-neutral-500 mb-6">请填写以下信息，我们将尽快为您提供专业的产品建议和报价方案。</p>

      <div className="bg-white rounded-xl border border-neutral-100 p-6">
        <InquiryForm />
      </div>
    </div>
  );
}
