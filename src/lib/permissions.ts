import { ROLES, PERMISSIONS, type Permission, type RoleSlug } from './constants';
import type { AuthUser } from '@/types';

type PermissionSet = Permission[];

const ROLE_PERMISSIONS: Record<RoleSlug, PermissionSet> = {
  super_admin: Object.values(PERMISSIONS),
  boss: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.SALESPERSONS_READ,
    PERMISSIONS.INQUIRIES_READ,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.SETTINGS_READ,
  ],
  product_manager: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_WRITE,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.CATEGORIES_WRITE,
    PERMISSIONS.FAQS_WRITE,
    PERMISSIONS.DOCUMENTS_WRITE,
  ],
  designer: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.IMAGES_WRITE,
    PERMISSIONS.VIDEOS_WRITE,
  ],
  salesperson: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.INQUIRIES_READ,
    PERMISSIONS.INQUIRIES_WRITE,
  ],
  foreign_trade: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.INQUIRIES_READ,
    PERMISSIONS.INQUIRIES_WRITE,
    PERMISSIONS.FOREIGN_TRADE,
  ],
  after_sales: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.FAQS_WRITE,
    PERMISSIONS.DOCUMENTS_WRITE,
  ],
  dealer: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.CATEGORIES_READ,
    PERMISSIONS.INQUIRIES_READ,
  ],
};

export function getPermissionsForRole(role: RoleSlug): PermissionSet {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === ROLES.SUPER_ADMIN) return true;
  return user.permissions.includes(permission);
}
