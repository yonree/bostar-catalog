import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  const documents = await prisma.productDocument.findMany({
    where: { isDownloadable: true, permissionLevel: 'public' },
    include: { product: true },
    orderBy: { updatedAt: 'desc' },
  });

  const types = [...new Set(documents.map((d) => d.documentType))];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">资料下载</h1>
      <p className="text-sm text-neutral-500 mb-8">产品说明书、技术参数表、选型手册等</p>

      {documents.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1.5 text-sm rounded-full bg-brand-500 text-white">全部</span>
            {types.map((type) => (
              <span key={type} className="px-3 py-1.5 text-sm rounded-full bg-neutral-100 text-neutral-600">
                {type.replace(/_/g, ' ')}
              </span>
            ))}
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-neutral-100 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-800">{doc.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    {doc.product?.name} &bull; {doc.fileType?.toUpperCase()} &bull; {doc.fileSize ? `${(doc.fileSize / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                >
                  下载
                </a>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-neutral-400">
          <p className="text-lg">暂无公开下载资料</p>
          <p className="text-sm mt-1">资料正在整理中，请联系销售人员获取</p>
        </div>
      )}
    </div>
  );
}
