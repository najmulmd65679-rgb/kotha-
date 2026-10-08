export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  id: string; // internal id
  publicId: string; // 7-digit unique public ID (e.g. 7842915)
  name: string;
  avatar: string;
  email: string;
  age: number;
  gender: Gender;
  location: string;
  countryCode: string;
  spendingLevel: number; // Wealth level
  spendingXp: number;
  receivingLevel: number; // Charm level
  receivingDiamonds: number;
  coins: number; // virtual coins to spend
  diamonds: number; // virtual earnings
  isStreamer: boolean;
  isBanned?: boolean;
  onboardingCompleted: boolean;
  bio?: string;
  followersCount: number;
  followingCount: number;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  cost: number; // coins
  animationType: 'rose' | 'heart' | 'car' | 'dragon' | 'rocket';
  color: string;
}

export interface LiveMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  text: string;
  isSystem?: boolean;
  isGiftAlert?: boolean;
  giftIcon?: string;
  giftName?: string;
  timestamp: string;
}

export interface LiveRoom {
  id: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
  streamerLevel: number;
  title: string;
  tags: string[];
  coverImage: string;
  viewerCount: number;
  country: string;
  countryCode: string;
  diamondsEarned: number;
  isSelfStreaming?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'gift' | 'system' | 'follow' | 'live';
  avatar?: string;
}

export interface UserReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedByUserId: string;
  reason: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
