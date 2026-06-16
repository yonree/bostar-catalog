import { LoginForm } from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <section className="section">
      <div className="container max-w-md">
        <div className="rounded border border-line bg-dark-soft p-6 shadow-card">
          <h1 className="text-2xl font-black">管理员登录</h1>
          <p className="mt-3 text-sm text-white-soft/50">请输入管理员邮箱和密码进入后台。</p>
          <LoginForm />
        </div>
      </div>
    </section>
  );
}
