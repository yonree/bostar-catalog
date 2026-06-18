'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMarkdownPaste } from '@/lib/rich-paste';

type MediaItem = {
  id: string;
  filename: string;
  url: string;
  alt?: string | null;
  title?: string | null;
};

export type CmsField = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'checkbox' | 'select' | 'json' | 'number' | 'media';
  required?: boolean;
  options?: { label: string; value: string }[];
};

type CmsRecord = Record<string, unknown> & { id?: string };

export function CmsManager({
  title,
  endpoint,
  fields,
  columns,
  reloadKey = 0,
}: {
  title: string;
  endpoint: string;
  fields: CmsField[];
  columns: { key: string; label: string }[];
  reloadKey?: number;
}) {
  const [items, setItems] = useState<CmsRecord[]>([]);
  const [editing, setEditing] = useState<CmsRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [dynamicFields, setDynamicFields] = useState(fields);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<string | null>(null);

  const blankRecord = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [
          field.name,
          field.type === 'checkbox' ? false : field.type === 'number' ? 0 : '',
        ])
      ),
    [fields]
  );

  const [mediaValues, setMediaValues] = useState<Record<string, string>>(() =>
    getMediaFieldValues(fields, blankRecord)
  );

  const onMarkdownPaste = useMarkdownPaste();

  useEffect(() => {
    if (!editing) {
      setMediaValues(getMediaFieldValues(fields, blankRecord));
    }
  }, [blankRecord, editing, fields]);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch(endpoint, { cache: 'no-store' });
    const result = await response.json();
    setItems(
      result.items ||
        result.products ||
        result.articles ||
        result.downloads ||
        result.faqs ||
        result.leads ||
        []
    );

    if (result.categories) {
      setDynamicFields((currentFields) =>
        currentFields.map((field) =>
          field.name === 'categoryId'
            ? {
                ...field,
                options: result.categories.map((category: { id: string; name: string }) => ({
                  label: category.name,
                  value: category.id,
                })),
              }
            : field
        )
      );
    } else {
      setDynamicFields(fields);
    }

    setLoading(false);
  }, [endpoint, fields]);

  async function loadMedia() {
    setMediaLoading(true);
    const response = await fetch('/api/admin/media', { cache: 'no-store' });
    const result = await response.json();
    setMediaItems(result.items || []);
    setMediaLoading(false);
  }

  useEffect(() => {
    void load();
  }, [endpoint, load, reloadKey]);

  function startEditing(record: CmsRecord) {
    setEditing(record);
    setMediaValues(getMediaFieldValues(fields, record));
  }

  function resetEditing() {
    setEditing(null);
    setMediaValues(getMediaFieldValues(fields, blankRecord));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload: Record<string, unknown> = {};
    const editingId = editing?.id;

    for (const field of dynamicFields) {
      if (field.type === 'checkbox') {
        payload[field.name] = formData.get(field.name) === 'on';
      } else if (field.type === 'number') {
        payload[field.name] = formData.get(field.name) || '0';
      } else if (field.type === 'media') {
        payload[field.name] = mediaValues[field.name] || '';
      } else {
        payload[field.name] = formData.get(field.name);
      }
    }

    const target = editingId ? `${endpoint}/${editingId}` : endpoint;
    const response = await fetch(target, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setMessage(result.message || (response.ok ? '保存成功。' : '保存失败。'));

    if (response.ok) {
      if (editingId) {
        startEditing(result.item || { ...payload, id: editingId });
      } else {
        resetEditing();
      }
      await load();
    }
  }

  async function remove(id: string) {
    if (!window.confirm('确认删除这条记录？')) {
      return;
    }

    const response = await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
    const result = await response.json();
    setMessage(result.message || (response.ok ? '删除成功。' : '删除失败。'));

    if (response.ok) {
      await load();
    }
  }

  function openMediaPicker(fieldName: string) {
    setActiveMediaField(fieldName);
    void loadMedia();
  }

  function selectMedia(url: string) {
    if (!activeMediaField) {
      return;
    }

    setMediaValues((current) => ({
      ...current,
      [activeMediaField]: url,
    }));
    setActiveMediaField(null);
  }

  const current = editing || blankRecord;

  return (
    <div className="grid gap-6">
      <div className="rounded border border-line bg-dark-soft p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{editing?.id ? `编辑${title}` : `新增${title}`}</h2>
          {editing ? (
            <button
              type="button"
              onClick={resetEditing}
              className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
            >
              取消编辑
            </button>
          ) : null}
        </div>

        <form key={String(editing?.id || 'new')} onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {dynamicFields.map((field) => (
              <label
                key={field.name}
                className={
                  field.type === 'textarea' || field.type === 'json' || field.type === 'media'
                    ? 'flex flex-col gap-2 text-sm font-bold text-white-soft md:col-span-2'
                    : 'flex flex-col gap-2 text-sm font-bold text-white-soft'
                }
              >
                {field.label}
                {renderField({
                  field,
                  value: current[field.name],
                  mediaValue: mediaValues[field.name] || '',
                  onMediaChange: (nextValue) =>
                    setMediaValues((currentValues) => ({
                      ...currentValues,
                      [field.name]: nextValue,
                    })),
                  onOpenMediaPicker: () => openMediaPicker(field.name),
                  onMarkdownPaste,
                })}
              </label>
            ))}
          </div>

          <button
            type="submit"
                className="w-fit rounded bg-primary px-5 py-3 text-sm font-bold text-white"
          >
            保存
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-primary">{message}</p> : null}
      </div>

      <div className="overflow-x-auto rounded border border-line bg-dark-soft">
        <table className="w-full min-w-[760px] text-left text-sm text-white-soft">
          <thead className="bg-dark">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="p-4 font-bold">
                  {column.label}
                </th>
              ))}
              <th className="p-4 font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-4" colSpan={columns.length + 1}>
                  加载中...
                </td>
              </tr>
            ) : items.length ? (
              items.map((item) => (
                <tr key={String(item.id)} className="border-t border-line">
                  {columns.map((column) => (
                    <td key={column.key} className="p-4">
                      {formatValue(item[column.key])}
                    </td>
                  ))}
                  <td className="flex gap-2 p-4">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="rounded border border-line px-3 py-2 text-xs font-bold text-white-soft hover:bg-white/5"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => item.id && void remove(String(item.id))}
                      className="rounded border border-red-500/30 px-3 py-2 text-xs font-bold text-red-400"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan={columns.length + 1}>
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {activeMediaField ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 p-6">
          <div className="max-h-[80vh] w-full max-w-5xl overflow-hidden rounded border border-line bg-dark-soft shadow-xl">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-lg font-black">选择媒体资源</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void loadMedia()}
                  className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
                >
                  刷新
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaField(null)}
                  className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
                >
                  关闭
                </button>
              </div>
            </div>

            <div className="max-h-[calc(80vh-73px)] overflow-y-auto p-5">
              {mediaLoading ? (
                <p className="text-sm text-white-soft/40">媒体库加载中...</p>
              ) : mediaItems.length ? (
                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {mediaItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectMedia(item.url)}
                      className="overflow-hidden rounded border border-line bg-dark-soft text-left hover:border-primary"
                    >
                      <div className="relative aspect-[4/3] bg-dark">
                        <Image
                          src={item.url}
                          alt={item.alt || item.filename}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="grid gap-1 p-3">
                        <p className="truncate text-sm font-bold">{item.title || item.filename}</p>
                        <p className="truncate text-xs text-white-soft/40">{item.url}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  <p className="text-sm text-white-soft/40">
                    媒体库为空。先到”媒体”页面上传图片，再回来选择。
                  </p>
                  <a
                    href="/admin/media"
                    target="_blank"
                    rel="noreferrer"
                    className="w-fit rounded bg-primary px-4 py-2 text-sm font-bold text-white"
                  >
                    打开媒体库
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function renderField({
  field,
  value,
  mediaValue,
  onMediaChange,
  onOpenMediaPicker,
  onMarkdownPaste,
}: {
  field: CmsField;
  value: unknown;
  mediaValue: string;
  onMediaChange: (nextValue: string) => void;
  onOpenMediaPicker: () => void;
  onMarkdownPaste: (event: React.ClipboardEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
}) {
  const common =
    'w-full rounded border border-line bg-white px-3 py-3 font-normal text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10';

  if (field.type === 'textarea' || field.type === 'json') {
    return (
      <textarea
        name={field.name}
        required={field.required}
        rows={field.type === 'json' ? 5 : 4}
        className={common}
        defaultValue={formatInputValue(value)}
        onPaste={onMarkdownPaste}
      />
    );
  }

  if (field.type === 'checkbox') {
    return (
      <input
        name={field.name}
        type="checkbox"
        className="h-5 w-5"
        defaultChecked={Boolean(value)}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <input
        name={field.name}
        type="number"
        required={field.required}
        className={common}
        defaultValue={formatInputValue(value)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select
        name={field.name}
        required={field.required}
        className={common}
        defaultValue={String(value || '')}
      >
        <option value="">请选择</option>
        {(field.options || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'media') {
    return (
      <div className="grid gap-3">
        <input
          name={field.name}
          required={field.required}
          className={common}
          value={mediaValue}
          onChange={(event) => onMediaChange(event.target.value)}
          placeholder="/uploads/example.png 或 https://..."
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpenMediaPicker}
            className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
          >
            从媒体库选择
          </button>
          <button
            type="button"
            onClick={() => onMediaChange('')}
            className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
          >
            清空
          </button>
          <a
            href="/admin/media"
            target="_blank"
            rel="noreferrer"
            className="rounded border border-line px-3 py-2 text-sm font-bold text-white-soft hover:bg-white/5"
          >
            上传新图片
          </a>
        </div>
        {mediaValue ? (
          <div className="relative aspect-[16/9] max-w-md overflow-hidden rounded border border-line bg-dark">
            <Image src={mediaValue} alt={field.label} fill className="object-contain" unoptimized />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <input
      name={field.name}
      required={field.required}
      className={common}
      defaultValue={formatInputValue(value)}
      onPaste={onMarkdownPaste}
    />
  );
}

function formatInputValue(value: unknown) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return '-';
  }

  if (typeof value === 'boolean') {
    return value ? '是' : '否';
  }

  if (typeof value === 'object') {
    if ('name' in value && typeof value.name === 'string') {
      return value.name;
    }
    return JSON.stringify(value);
  }

  return String(value);
}

function getMediaFieldValues(fields: CmsField[], source: CmsRecord) {
  return Object.fromEntries(
    fields
      .filter((field) => field.type === 'media')
      .map((field) => [field.name, formatInputValue(source[field.name])])
  );
}
