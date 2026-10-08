import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, LiveRoom, LiveMessage, Gift, NotificationItem, UserReport, Gender } from '../types';
import { INITIAL_STREAMERS, INITIAL_GIFTS, INITIAL_NOTIFICATIONS } from '../mockData';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

interface AppContextType {
  currentUser: UserProfile;
  liveRooms: LiveRoom[];
  activeRoom: LiveRoom | null;
  gifts: Gift[];
  messages: Record<string, LiveMessage[]>;
  notifications: NotificationItem[];
  reports: UserReport[];
  blockedUserIds: string[];
  activeGiftAnimation: { gift: Gift; senderName: string; count: number } | null;
  isMobileFrame: boolean;
  activeTab: 'home' | 'ranking' | 'messages' | 'profile';
  showGuideModal: boolean;
  showAdminModal: boolean;
  showRechargeModal: boolean;
  showOnboardingModal: boolean;
  showLoginModal: boolean;
  isLoggedIn: boolean;
  isFirebaseConnected: boolean;
  viewMode: 'user_app' | 'admin_portal';

  // Actions
  setViewMode: (mode: 'user_app' | 'admin_portal') => void;
  setActiveTab: (tab: 'home' | 'ranking' | 'messages' | 'profile') => void;
  toggleMobileFrame: () => void;
  setShowGuideModal: (show: boolean) => void;
  setShowAdminModal: (show: boolean) => void;
  setShowRechargeModal: (show: boolean) => void;
  setShowOnboardingModal: (show: boolean) => void;
  setShowLoginModal: (show: boolean) => void;
  joinRoom: (room: LiveRoom) => void;
  leaveRoom: () => void;
  startLiveStream: (title: string, tags: string[]) => LiveRoom;
  endLiveStream: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (data: { age: number; gender: Gender; location: string; countryCode: string; avatar: string }) => void;
  sendChatMessage: (roomId: string, text: string) => void;
  sendGift: (roomId: string, giftId: string, count?: number) => boolean;
  rechargeCoins: (coins: number) => void;
  markNotificationRead: (id: string) => void;
  submitReport: (reportedUserId: string, reportedUserName: string, reason: string, details: string) => void;
  toggleBlockUser: (userId: string) => void;
  adminAddCoins: (userId: string, amount: number) => void;
  adminToggleBan: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate random 7-digit ID like Poppo Live (e.g. 7842915)
const generatePoppoId = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

const DEFAULT_USER: UserProfile = {
  id: 'u-user-main',
  publicId: '7842915',
  name: 'Najmul Streamer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  email: 'najmulmd65679@gmail.com',
  age: 22,
  gender: 'Male',
  location: 'Dhaka, Bangladesh',
  countryCode: 'BD',
  spendingLevel: 8,
  spendingXp: 8200,
  receivingLevel: 5,
  receivingDiamonds: 4300,
  coins: 5200,
  diamonds: 1850,
  isStreamer: true,
  onboardingCompleted: true,
  bio: '🌟 Official Kotha Live Creator! Follow for daily music and fun chats.',
  followersCount: 1420,
  followingCount: 48,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('poppo_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>(() => {
    const saved = localStorage.getItem('poppo_rooms');
    return saved ? JSON.parse(saved) : INITIAL_STREAMERS;
  });

  const [activeRoom, setActiveRoom] = useState<LiveRoom | null>(null);
  const [gifts] = useState<Gift[]>(INITIAL_GIFTS);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('poppo_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<UserReport[]>(() => {
    const saved = localStorage.getItem('poppo_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('poppo_blocked');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Record<string, LiveMessage[]>>({
    'room-1': [
      { id: 'm1', userId: 'u-bot1', userName: 'Rahim VIP', userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80', userLevel: 15, text: 'Hello Ayesha! Welcome to live stream 🎶', timestamp: '11:40' },
      { id: 'm2', userId: 'u-bot2', userName: 'Tanima', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', userLevel: 9, text: 'Sending gift hearts! ❤️', timestamp: '11:42' },
    ],
  });

  const [activeGiftAnimation, setActiveGiftAnimation] = useState<{ gift: Gift; senderName: string; count: number } | null>(null);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'ranking' | 'messages' | 'profile'>('home');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [showRechargeModal, setShowRechargeModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'user_app' | 'admin_portal'>(() => {
    return window.location.search.includes('app=admin') ? 'admin_portal' : 'user_app';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('poppo_is_logged_in') !== 'false';
  });

  // Sync user changes to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem('poppo_user', JSON.stringify(currentUser));
    if (currentUser?.id) {
      setDoc(doc(db, 'users', currentUser.id), currentUser, { merge: true }).catch(err => {
        console.warn('Firestore user save notice:', err.message);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('poppo_rooms', JSON.stringify(liveRooms));
  }, [liveRooms]);

  useEffect(() => {
    localStorage.setItem('poppo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('poppo_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('poppo_blocked', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setIsFirebaseConnected(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            setCurrentUser(docSnap.data() as UserProfile);
          } else {
            // New user from Google
            const newPoppoId = generatePoppoId();
            const newUserProfile: UserProfile = {
              id: user.uid,
              publicId: newPoppoId,
              name: user.displayName || 'Poppo Star',
              avatar: user.photoURL || DEFAULT_USER.avatar,
              email: user.email || '',
              age: 21,
              gender: 'Male',
              location: 'Dhaka, Bangladesh',
              countryCode: 'BD',
              spendingLevel: 1,
              spendingXp: 0,
              receivingLevel: 1,
              receivingDiamonds: 0,
              coins: 5000,
              diamonds: 0,
              isStreamer: false,
              onboardingCompleted: false, // Prompt onboarding
              bio: 'Hello! I just joined Kotha Live.',
              followersCount: 0,
              followingCount: 0,
            };

            await setDoc(userDocRef, newUserProfile);
            setCurrentUser(newUserProfile);
            setShowOnboardingModal(true);
          }
        } catch (err) {
          console.warn('Error fetching Firestore user:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore chat sync for active room
  useEffect(() => {
    if (!activeRoom) return;

    try {
      const msgsRef = collection(db, 'rooms', activeRoom.id, 'messages');
      const q = query(msgsRef, orderBy('timestamp', 'asc'), limit(50));

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const loadedMsgs: LiveMessage[] = [];
          snapshot.forEach(docSnap => {
            loadedMsgs.push(docSnap.data() as LiveMessage);
          });
          if (loadedMsgs.length > 0) {
            setMessages(prev => ({
              ...prev,
              [activeRoom.id]: loadedMsgs,
            }));
          }
        },
        error => {
          console.warn('Realtime chat fallback to local simulation:', error.message);
        }
      );

      return () => unsubscribe();
    } catch {
      // Fallback
    }
  }, [activeRoom]);

  // Simulated live viewers/chat activity
  useEffect(() => {
    if (!activeRoom) return;

    const interval = setInterval(() => {
      const sampleBotNames = ['King_Farhan', 'Mim_Akter', 'Alex_Dubai', 'Rina_Rose', 'Shohel_BD', 'Prince_Ali'];
      const sampleTexts = [
        'Awesome stream! 🔥',
        'Hello host! Great energy today 💖',
        'Singing is super soothing 🎵',
        'PK battle soon? ⚔️',
        'Greetings from Sylhet 🇧🇩',
        'Just tapped 500 likes on screen 👍👍',
      ];

      const randomName = sampleBotNames[Math.floor(Math.random() * sampleBotNames.length)];
      const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const randomLevel = Math.floor(Math.random() * 20) + 1;

      const newMsg: LiveMessage = {
        id: 'msg-' + Date.now(),
        userId: 'bot-' + Math.random(),
        userName: randomName,
        userAvatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
        userLevel: randomLevel,
        text: randomText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => ({
        ...prev,
        [activeRoom.id]: [...(prev[activeRoom.id] || []).slice(-40), newMsg],
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [activeRoom]);

  const toggleMobileFrame = () => setIsMobileFrame(prev => !prev);

  const joinRoom = (room: LiveRoom) => {
    setActiveRoom(room);
    const welcomeMsg: LiveMessage = {
      id: 'welcome-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userLevel: currentUser.spendingLevel,
      text: `joined the room 🎉`,
      isSystem: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [room.id]: [...(prev[room.id] || []), welcomeMsg],
    }));
  };

  const leaveRoom = () => {
    setActiveRoom(null);
  };

  const startLiveStream = (title: string, tags: string[]): LiveRoom => {
    const newRoom: LiveRoom = {
      id: 'my-room-' + Date.now(),
      streamerId: currentUser.id,
      streamerName: currentUser.name,
      streamerAvatar: currentUser.avatar,
      streamerLevel: currentUser.receivingLevel || 1,
      title: title || `${currentUser.name}'s Live Party ✨`,
      tags: tags.length ? tags : ['Live', 'Chat', 'Music'],
      coverImage: currentUser.avatar,
      viewerCount: 1,
      country: currentUser.location || 'Bangladesh',
      countryCode: currentUser.countryCode || 'BD',
      diamondsEarned: 0,
      isSelfStreaming: true,
    };

    setLiveRooms(prev => [newRoom, ...prev]);
    setActiveRoom(newRoom);

    // Save to Firestore rooms
    setDoc(doc(db, 'rooms', newRoom.id), newRoom).catch(e => console.warn(e));

    return newRoom;
  };

  const endLiveStream = () => {
    if (activeRoom && activeRoom.isSelfStreaming) {
      setLiveRooms(prev => prev.filter(r => r.id !== activeRoom.id));
    }
    setActiveRoom(null);
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
      localStorage.setItem('poppo_is_logged_in', 'true');
      setShowLoginModal(false);
    } catch (error: any) {
      console.warn('Google Popup sign-in notice (falling back gracefully):', error.message);
      // Fallback for iframe preview
      const newId = generatePoppoId();
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        publicId: newId,
        name: 'Najmul Hossain (Google)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        email: 'najmulmd65679@gmail.com',
        age: 22,
        gender: 'Male',
        location: 'Dhaka, Bangladesh',
        countryCode: 'BD',
        spendingLevel: 1,
        spendingXp: 0,
        receivingLevel: 1,
        receivingDiamonds: 0,
        coins: 5000,
        diamonds: 0,
        isStreamer: false,
        onboardingCompleted: false,
        bio: 'Verified Google Live Streamer!',
        followersCount: 0,
        followingCount: 0,
      };
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('poppo_is_logged_in', 'true');
      setShowLoginModal(false);
      setShowOnboardingModal(true);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignored
    }
    localStorage.removeItem('poppo_user');
    setIsLoggedIn(false);
    localStorage.setItem('poppo_is_logged_in', 'false');
    setCurrentUser({
      ...DEFAULT_USER,
      onboardingCompleted: false,
    });
    setShowLoginModal(true);
  };

  const completeOnboarding = (data: { age: number; gender: Gender; location: string; countryCode: string; avatar: string }) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        age: data.age,
        gender: data.gender,
        location: data.location,
        countryCode: data.countryCode,
        avatar: data.avatar || prev.avatar,
        onboardingCompleted: true,
        coins: prev.coins + 1000,
      };
      setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch(e => console.warn(e));
      return updated;
    });

    setShowOnboardingModal(false);

    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Profile Completed 🎉',
      message: 'You received +1,000 Coins bonus for completing your Age, Gender, and Location setup!',
      time: 'Just now',
      read: false,
      type: 'system',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const sendChatMessage = (roomId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: LiveMessage = {
      id: 'msg-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userLevel: currentUser.spendingLevel,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMsg],
    }));

    // Save to Firestore
    setDoc(doc(db, 'rooms', roomId, 'messages', newMsg.id), newMsg).catch(e => console.warn(e));
  };

  const sendGift = (roomId: string, giftId: string, count = 1): boolean => {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return false;

    const totalCost = gift.cost * count;
    if (currentUser.coins < totalCost) {
      setShowRechargeModal(true);
      return false;
    }

    const newCoins = currentUser.coins - totalCost;
    const newSpendingXp = currentUser.spendingXp + totalCost;
    const newSpendingLevel = Math.max(1, Math.floor(Math.sqrt(newSpendingXp / 100)) + 1);

    setCurrentUser(prev => {
      const updated = {
        ...prev,
        coins: newCoins,
        spendingXp: newSpendingXp,
        spendingLevel: newSpendingLevel,
      };
      setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch(e => console.warn(e));
      return updated;
    });

    const earnedDiamonds = Math.floor(totalCost * 0.7);

    setLiveRooms(prev =>
      prev.map(r => {
        if (r.id === roomId) {
          const newDiamonds = r.diamondsEarned + earnedDiamonds;
          const newRecLevel = Math.max(1, Math.floor(Math.sqrt(newDiamonds / 100)) + 1);
          return {
            ...r,
            diamondsEarned: newDiamonds,
            streamerLevel: newRecLevel,
          };
        }
        return r;
      })
    );

    if (activeRoom && activeRoom.id === roomId) {
      setActiveRoom(prev =>
        prev
          ? {
              ...prev,
              diamondsEarned: prev.diamondsEarned + earnedDiamonds,
              streamerLevel: Math.max(1, Math.floor(Math.sqrt((prev.diamondsEarned + earnedDiamonds) / 100)) + 1),
            }
          : null
      );
    }

    const giftMsg: LiveMessage = {
      id: 'gift-' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userLevel: newSpendingLevel,
      text: `sent ${gift.name} x${count}! ${gift.icon}`,
      isGiftAlert: true,
      giftIcon: gift.icon,
      giftName: gift.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), giftMsg],
    }));

    setDoc(doc(db, 'rooms', roomId, 'messages', giftMsg.id), giftMsg).catch(e => console.warn(e));

    setActiveGiftAnimation({ gift, senderName: currentUser.name, count });
    setTimeout(() => {
      setActiveGiftAnimation(null);
    }, 3200);

    return true;
  };

  const rechargeCoins = (coins: number) => {
    setCurrentUser(prev => {
      const updated = {
        ...prev,
        coins: prev.coins + coins,
      };
      setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch(e => console.warn(e));
      return updated;
    });

    setShowRechargeModal(false);

    const notif: NotificationItem = {
      id: 'recharge-' + Date.now(),
      title: 'Coins Recharge Successful 🪙',
      message: `Successfully added ${coins.toLocaleString()} coins to your wallet.`,
      time: 'Just now',
      read: false,
      type: 'gift',
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const submitReport = (reportedUserId: string, reportedUserName: string, reason: string, details: string) => {
    const report: UserReport = {
      id: 'rep-' + Date.now(),
      reportedUserId,
      reportedUserName,
      reportedByUserId: currentUser.id,
      reason,
      details,
      timestamp: new Date().toLocaleString(),
      status: 'pending',
    };
    setReports(prev => [report, ...prev]);

    setDoc(doc(db, 'reports', report.id), report).catch(e => console.warn(e));
  };

  const toggleBlockUser = (userId: string) => {
    setBlockedUserIds(prev => (prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]));
  };

  const adminAddCoins = (userId: string, amount: number) => {
    if (userId === currentUser.id) {
      setCurrentUser(prev => {
        const updated = { ...prev, coins: prev.coins + amount };
        setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch(e => console.warn(e));
        return updated;
      });
    }
  };

  const adminToggleBan = (userId: string) => {
    if (userId === currentUser.id) {
      setCurrentUser(prev => {
        const updated = { ...prev, isBanned: !prev.isBanned };
        setDoc(doc(db, 'users', updated.id), updated, { merge: true }).catch(e => console.warn(e));
        return updated;
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        liveRooms,
        activeRoom,
        gifts,
        messages,
        notifications,
        reports,
        blockedUserIds,
        activeGiftAnimation,
        isMobileFrame,
        activeTab,
        showGuideModal,
        showAdminModal,
        showRechargeModal,
        showOnboardingModal,
        showLoginModal,
        isLoggedIn,
        isFirebaseConnected,
        viewMode,
        setViewMode,
        setActiveTab,
        toggleMobileFrame,
        setShowGuideModal,
        setShowAdminModal,
        setShowRechargeModal,
        setShowOnboardingModal,
        setShowLoginModal,
        joinRoom,
        leaveRoom,
        startLiveStream,
        endLiveStream,
        loginWithGoogle,
        logout,
        completeOnboarding,
        sendChatMessage,
        sendGift,
        rechargeCoins,
        markNotificationRead,
        submitReport,
        toggleBlockUser,
        adminAddCoins,
        adminToggleBan,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
