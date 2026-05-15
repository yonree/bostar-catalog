import type { Permission, RoleSlug } from '@/lib/constants';
import type { Salesperson } from './inquiry';

export interface Role {
  id: string;
  name: string;
  slug: RoleSlug;
  description?: string | null;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  roleId: string;
  language: string;
  status: string;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  role?: Role;
  salesperson?: Salesperson | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: RoleSlug;
  permissions: Permission[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
