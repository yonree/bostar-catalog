'use client';

import { useState } from 'react';
import { CmsManager } from '@/components/admin/CmsManager';

export function MediaLibraryManager() {
  const [reloadKey, setReloadKey] = useState(0);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('file');
    if (!(file instanceof File) || !file.size) {
      setMessage('请选择要上传的图片。');
      return;
    }

    setUploading(true);
    setMessage('');
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    setUploading(false);
    setMessage(result.message || (response.ok ? '上传成功。' : '上传失败。'));

    if (response.ok) {
      form.reset();
      setReloadKey((value) => value + 1);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="rounded border border-line bg-dark-soft p-5">
        <h2 className="text-xl font-black">上传图片</h2>
        <form onSubmit={upload} className="mt-4 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-white-soft">
            图片文件
            <input
              name="file"
              type="file"
              accept="image/*"
              className="w-full rounded border border-line bg-white px-3 py-3 font-normal text-ink file:mr-3 file:rounded file:border-0 file:bg-primary-light file:px-3 file:py-2 file:font-semibold file:text-primary"
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-white-soft">
              标题
              <input
                name="title"
                className="w-full rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-white-soft">
              Alt 文本
              <input
                name="alt"
                className="w-full rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-white-soft">
            描述
            <textarea
              name="description"
              rows={3}
              className="w-full rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
          </label>
          <button
            disabled={uploading}
        className="w-fit rounded bg-primary px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {uploading ? '上传中...' : '上传到媒体库'}
          </button>
        </form>
        {message ? <p className="mt-4 text-sm text-primary">{message}</p> : null}
      </div>

      <CmsManager
        title="媒体资源"
        endpoint="/api/admin/media"
        reloadKey={reloadKey}
        columns={[
          { key: 'filename', label: '文件名' },
          { key: 'url', label: 'URL' },
          { key: 'mimeType', label: '类型' },
          { key: 'size', label: '大小' },
        ]}
        fields={[
          { name: 'filename', label: '文件名', required: true },
          { name: 'url', label: '文件 URL', required: true, type: 'media' },
          { name: 'mimeType', label: 'MIME 类型' },
          { name: 'size', label: '大小（字节）', type: 'number' },
          { name: 'alt', label: 'Alt 文本' },
          { name: 'title', label: '标题' },
          { name: 'description', label: '描述', type: 'textarea' },
        ]}
      />
    </div>
  );
}
