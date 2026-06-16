# BOSTAR GEO 品牌官网

面向 GEO / SEO / 工业设备询盘转化的博士达品牌官网工程。技术栈为 Next.js App Router、TypeScript、Tailwind CSS、Prisma 和 PostgreSQL。

## 启动

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 数据库

配置 `.env` 中的 `DATABASE_URL` 后执行：

```bash
npm run prisma:migrate
npm run prisma:seed
```

当前前台页面使用 `lib/data.ts` 的本地种子数据兜底，数据库未连接时仍可展示官网内容。`POST /api/leads` 会尝试写入 Prisma `Lead` 表；未配置数据库时仍返回成功，便于前期页面联调。

## 已实现

- 首页、关于、产品中心、产品分类、产品详情
- 知识中心、知识分类、文章详情
- 解决方案、案例、资料下载、视频中心、服务、FAQ、联系、搜索
- 后台管理入口和产品、文章、方案、案例、资料、视频、FAQ、线索、设置页面
- `sitemap.ts`、`robots.ts`、canonical metadata、Open Graph
- Organization、Product、FAQPage、Article、Breadcrumb、VideoObject、HowTo JSON-LD 组件
- Prisma schema 和 seed 脚本

## 后续接入点

- 将 `lib/data.ts` 替换为 Prisma 查询
- 接入 Auth.js 或服务端 session 保护 `/admin` 和 `/api/admin`
- 配置 SMTP / 飞书 / 企业微信 Webhook
- 上传接口接入 OSS / COS / S3，并增加文件类型与大小限制

## 上线到 bostarcoating.com

推荐先部署到 Vercel，并把正式环境变量设置为：

```text
NEXT_PUBLIC_SITE_URL=https://www.bostarcoating.com
```

在 Vercel 项目中添加两个域名：

```text
www.bostarcoating.com
bostarcoating.com
```

域名服务商 DNS 解析建议：

```text
主机记录 @     类型 A      记录值 76.76.21.21
主机记录 www   类型 CNAME  记录值 cname.vercel-dns.com
```

如果部署到自有服务器，则把 `@` 的 A 记录指向服务器公网 IP，并把 `www` 设置为 CNAME 到 `bostarcoating.com`，或同样设置 A 记录到服务器 IP。
