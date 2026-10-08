export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'moderator'
  | 'finance_admin'
  | 'support_admin';

export type AdminPermission =
  | 'dashboard:view'
  | 'users:view'
  | 'users:manage'
  | 'users:ban'
  | 'wallet:view'
  | 'wallet:adjust'
  | 'levels:configure'
  | 'gifts:manage'
  | 'recharge:manage'
  | 'withdrawals:view'
  | 'withdrawals:process'
  | 'live:view'
  | 'live:terminate'
  | 'reports:view'
  | 'reports:resolve'
  | 'notifications:send'
  | 'admins:manage'
  | 'audit:view';

export interface AdminUser {
  id: string; // Firebase Auth UID
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  adminRole: AdminRole;
  action: string;
  targetEntity: 'user' | 'gift' | 'withdrawal' | 'room' | 'level_config' | 'recharge_package' | 'admin' | 'announcement';
  targetId: string;
  oldValue?: string;
  newValue?: string;
  details: string;
  timestamp: string;
}

export interface WalletLevelConfig {
  level: number;
  name: string; // e.g. "Bronze VIP", "Silver VIP", "Gold King", "Crown Emperor"
  requiredCoinsSpent: number;
  badgeColor: string;
  icon: string;
  perks: string[];
}

export interface CharmLevelConfig {
  level: number;
  name: string; // e.g. "Rising Star", "Super Idol", "Global Diva"
  requiredDiamondsEarned: number;
  badgeColor: string;
  icon: string;
  perks: string[];
}

export interface RechargePackage {
  id: string;
  name: string;
  coins: number;
  bonusCoins: number;
  priceUsd: number;
  isPopular?: boolean;
  isActive: boolean;
  updatedAt: string;
}

export interface WithdrawalRecord {
  id: string;
  userId: string;
  userPublicId: string;
  userName: string;
  diamondsAmount: number;
  usdEquivalent: number;
  paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Binance';
  accountDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  processedByAdminId?: string;
  processedByAdminEmail?: string;
  processedAt?: string;
  transactionRef?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  message: string;
  targetAudience: 'all' | 'streamers' | 'vip';
  createdByAdminEmail: string;
  createdAt: string;
}
