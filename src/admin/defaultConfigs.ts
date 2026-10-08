import { AdminRole, AdminPermission, WalletLevelConfig, CharmLevelConfig, RechargePackage } from './types';

// Role to permissions map
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  super_admin: [
    'dashboard:view',
    'users:view',
    'users:manage',
    'users:ban',
    'wallet:view',
    'wallet:adjust',
    'levels:configure',
    'gifts:manage',
    'recharge:manage',
    'withdrawals:view',
    'withdrawals:process',
    'live:view',
    'live:terminate',
    'reports:view',
    'reports:resolve',
    'notifications:send',
    'admins:manage',
    'audit:view',
  ],
  admin: [
    'dashboard:view',
    'users:view',
    'users:manage',
    'users:ban',
    'wallet:view',
    'levels:configure',
    'gifts:manage',
    'recharge:manage',
    'withdrawals:view',
    'live:view',
    'live:terminate',
    'reports:view',
    'reports:resolve',
    'notifications:send',
    'audit:view',
  ],
  finance_admin: [
    'dashboard:view',
    'wallet:view',
    'wallet:adjust',
    'withdrawals:view',
    'withdrawals:process',
    'recharge:manage',
    'audit:view',
  ],
  moderator: [
    'dashboard:view',
    'users:view',
    'users:ban',
    'live:view',
    'live:terminate',
    'reports:view',
    'reports:resolve',
    'audit:view',
  ],
  support_admin: [
    'dashboard:view',
    'users:view',
    'reports:view',
    'reports:resolve',
    'audit:view',
  ],
};

// Default Wallet Levels (Coin Spending)
export const DEFAULT_WALLET_LEVELS: WalletLevelConfig[] = [
  { level: 1, name: 'Bronze Citizen', requiredCoinsSpent: 0, badgeColor: '#cd7f32', icon: '🥉', perks: ['Basic Chat'] },
  { level: 5, name: 'Silver Explorer', requiredCoinsSpent: 2500, badgeColor: '#c0c0c0', icon: '🥈', perks: ['Silver Badge', 'Entrance Banner'] },
  { level: 10, name: 'Golden Knight', requiredCoinsSpent: 10000, badgeColor: '#ffd700', icon: '🥇', perks: ['Golden Chat Highlight', 'Special Sound Effect'] },
  { level: 20, name: 'Ruby Baron', requiredCoinsSpent: 40000, badgeColor: '#e0115f', icon: '💎', perks: ['Exclusive Gifts Access', 'VIP Customer Support'] },
  { level: 35, name: 'Diamond Monarch', requiredCoinsSpent: 122500, badgeColor: '#00c6ff', icon: '👑', perks: ['Custom Profile Frame', 'Animated Entrance Ride'] },
  { level: 50, name: 'Crown Emperor', requiredCoinsSpent: 250000, badgeColor: '#ff2a6d', icon: '🔥', perks: ['Global Broadcast Privileges', 'Personal Account Manager'] },
];

// Default Charm Levels (Diamonds Received)
export const DEFAULT_CHARM_LEVELS: CharmLevelConfig[] = [
  { level: 1, name: 'Rising Talent', requiredDiamondsEarned: 0, badgeColor: '#a855f7', icon: '✨', perks: ['Standard Stream'] },
  { level: 5, name: 'Sweet Voice', requiredDiamondsEarned: 2500, badgeColor: '#ec4899', icon: '💖', perks: ['Charm Badge', 'Room Spotlight'] },
  { level: 10, name: 'Stage Star', requiredDiamondsEarned: 10000, badgeColor: '#f59e0b', icon: '⭐', perks: ['PK Challenge Multiplier', 'Top 50 Ranking Eligible'] },
  { level: 20, name: 'Super Idol', requiredDiamondsEarned: 40000, badgeColor: '#06b6d4', icon: '🌟', perks: ['Featured Homepage Placement', 'Reduced Cashout Fee'] },
  { level: 35, name: 'Global Diva', requiredDiamondsEarned: 122500, badgeColor: '#8b5cf6', icon: '👑', perks: ['VIP Badge', 'Agency Contract Priority'] },
  { level: 50, name: 'Hall of Fame Legend', requiredDiamondsEarned: 250000, badgeColor: '#ef4444', icon: '🏆', perks: ['Custom Official Verification Badge', 'Official Merchandise Partner'] },
];

// Default Recharge Packages
export const DEFAULT_RECHARGE_PACKAGES: RechargePackage[] = [
  { id: 'pkg-1', name: 'Starter Bag', coins: 300, bonusCoins: 0, priceUsd: 0.99, isPopular: false, isActive: true, updatedAt: new Date().toISOString() },
  { id: 'pkg-2', name: 'Popular Value', coins: 1000, bonusCoins: 100, priceUsd: 2.99, isPopular: true, isActive: true, updatedAt: new Date().toISOString() },
  { id: 'pkg-3', name: 'Gifter Chest', coins: 3500, bonusCoins: 500, priceUsd: 9.99, isPopular: false, isActive: true, updatedAt: new Date().toISOString() },
  { id: 'pkg-4', name: 'High Roller Vault', coins: 8000, bonusCoins: 1500, priceUsd: 19.99, isPopular: false, isActive: true, updatedAt: new Date().toISOString() },
  { id: 'pkg-5', name: 'Emperor Trove', coins: 25000, bonusCoins: 5000, priceUsd: 49.99, isPopular: false, isActive: true, updatedAt: new Date().toISOString() },
  { id: 'pkg-6', name: 'Legend Treasury', coins: 60000, bonusCoins: 15000, priceUsd: 99.99, isPopular: false, isActive: true, updatedAt: new Date().toISOString() },
];
