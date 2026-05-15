'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; slug: string };
  status: string;
  language: string;
  lastLoginAt: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', roleId: '', status: 'active' });

  const fetchUsers = () => {
    fetch('/api/auth/users')
      .then((r) => r.json())
      .then((d) => { if (d.success) setUsers(d.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm({ name: '', email: '', password: '', roleId: '', status: 'active' });
    setShowModal(true);
  };

  const openEdit = (u: UserData) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email, password: '', roleId: u.role.id, status: u.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(editUser ? `/api/auth/users/${editUser.id}` : '/api/auth/users', {
        method: editUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchUsers();
      } else {
        alert(data.error?.message || '操作失败');
      }
    } catch {
      alert('操作失败');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (u: UserData) => {
    try {
      await fetch(`/api/auth/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: u.status === 'active' ? 'disabled' : 'active' }),
      });
      fetchUsers();
    } catch {
      alert('操作失败');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-neutral-800">用户管理</h2>
        <Button onClick={openCreate}>新增用户</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500">姓名</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden sm:table-cell">邮箱</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-neutral-500 hidden md:table-cell">角色</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-neutral-500">状态</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-neutral-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">加载中...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-neutral-400">暂无用户数据</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-neutral-800">{u.name}</p>
                    <p className="text-xs text-neutral-400">{u.language === 'en' ? 'English' : '中文'}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{u.role.name}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={u.status === 'active' ? 'success' : 'default'}>
                      {u.status === 'active' ? '启用' : '禁用'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm space-x-2">
                    <button onClick={() => openEdit(u)} className="text-brand-600 hover:text-brand-700">编辑</button>
                    <button onClick={() => handleToggleStatus(u)} className="text-neutral-500 hover:text-neutral-700">
                      {u.status === 'active' ? '禁用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">{editUser ? '编辑用户' : '新增用户'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">姓名</label>
                <input
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">邮箱</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  密码{editUser ? '（留空不修改）' : ''}
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editUser ? '留空则不修改密码' : ''}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave} loading={saving} className="flex-1">保存</Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">取消</Button>
              </div>
            </div>
          </div>
      </Modal>
    </div>
  );
}
