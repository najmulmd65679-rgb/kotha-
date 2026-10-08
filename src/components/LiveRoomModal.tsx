import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { webrtcService } from '../services/webrtcSignalingService';
import { LiveRoomTopBar } from './live/LiveRoomTopBar';
import { FloatingGuestVideo } from './live/FloatingGuestVideo';
import { LiveChatStream } from './live/LiveChatStream';
import { LiveBottomBar } from './live/LiveBottomBar';
import { GiftBottomSheet } from './live/GiftBottomSheet';
import { GiftAnimationQueue } from './live/GiftAnimationQueue';
import { LiveGamesModal } from './live/LiveGamesModal';
import { LiveRoomMenuModal } from './live/LiveRoomMenuModal';
import { HostProfileModal } from './live/HostProfileModal';
import { ReportModal } from './ReportModal';
import { Wifi, Sparkles, Activity } from 'lucide-react';

interface FloatingHeart {
  id: number;
  x: number;
  color: string;
}

export const LiveRoomModal: React.FC = () => {
  const {
    activeRoom,
    leaveRoom,
    messages,
    sendChatMessage,
    activeGiftAnimation,
  } = useApp();

  // Dialog & Sheet States
  const [showGiftSheet, setShowGiftSheet] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showHostProfile, setShowHostProfile] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Interaction States
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(894);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Co-Host PiP state (Man in grey t-shirt matching reference image)
  const [showCoHostPip, setShowCoHostPip] = useState(true);

  // Self Camera & WebRTC States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [webrtcConnected, setWebrtcConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // WebRTC Signaling Initialization
  useEffect(() => {
    if (!activeRoom) return;

    if (activeRoom.isSelfStreaming) {
      // Host: initialize local camera and WebRTC broadcast offer
      startBroadcast();
    } else {
      // Viewer: connect to host stream via WebRTC signaling
      webrtcService
        .joinStreamAsViewer(activeRoom.id, remoteStream => {
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream;
            setWebrtcConnected(true);
          }
        })
        .catch(err => {
          console.warn('WebRTC viewer connect notice:', err.message);
        });
    }

    return () => {
      stopBroadcast();
      webrtcService.cleanup();
    };
  }, [activeRoom]);

  const startBroadcast = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);

      // Start WebRTC broadcast signaling with Firebase
      if (activeRoom) {
        await webrtcService.startBroadcasting(activeRoom.id, stream, () => {
          setWebrtcConnected(true);
        });
      }
    } catch (err: any) {
      console.warn('Broadcast camera notice:', err.message);
      setIsCameraActive(false);
    }
  };

  const stopBroadcast = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Screen Tap Floating Hearts Generator
  const handleTapScreen = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, form')) {
      return;
    }

    setLikesCount(prev => prev + 1);

    const colors = ['#ec4899', '#f43f5e', '#a855f7', '#3b82f6', '#eab308', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = Math.max(20, Math.min(rect.width - 40, e.clientX - rect.left));

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: xPos,
      color: randomColor,
    };

    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
  };

  useEffect(() => {
    if (floatingHearts.length > 0) {
      const timer = setTimeout(() => {
        setFloatingHearts(prev => prev.slice(1));
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [floatingHearts]);

  if (!activeRoom) return null;

  const roomMessages = messages[activeRoom.id] || [];

  // Streamer photo: if default room, use high-resolution female streamer matching reference image
  const displayCover =
    activeRoom.coverImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80';

  return (
    <div
      onClick={handleTapScreen}
      className="fixed inset-0 z-40 bg-black text-white flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* 1. FULL-SCREEN BACKGROUND LIVE VIDEO / STREAMER CANVAS (Matching reference photo) */}
      <div className="absolute inset-0 z-0 bg-neutral-950 overflow-hidden">
        {activeRoom.isSelfStreaming && isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        ) : (
          <div className="w-full h-full relative">
            <img
              src={displayCover}
              alt={activeRoom.streamerName}
              className="w-full h-full object-cover scale-100 transition-transform duration-700"
            />
            {/* Subtle natural lighting vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50" />
          </div>
        )}
      </div>

      {/* Floating Animated Hearts Layer */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className="absolute bottom-16 animate-float-heart text-2xl drop-shadow-md select-none"
            style={{
              left: `${heart.x}px`,
              color: heart.color,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* 2. TOP SECTION: TOP BAR (Host pill, follow, Top.10, Wish gift, Share, Report, 3.5 Star) */}
      <div className="relative z-30 flex flex-col pointer-events-auto">
        <LiveRoomTopBar
          room={activeRoom}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing(!isFollowing)}
          onOpenHostProfile={() => setShowHostProfile(true)}
          onOpenWishGift={() => setShowGiftSheet(true)}
          onShare={() => setShowMenuModal(true)}
          onReport={() => setShowReportModal(true)}
          onClose={leaveRoom}
        />
      </div>

      {/* 3. CO-HOST / GUEST FLOATING VIDEO (Matching man in grey t-shirt in reference image) */}
      {showCoHostPip && (
        <FloatingGuestVideo
          guestName="Co-Host Alex"
          streamUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
          onToggleGuest={() => setShowCoHostPip(false)}
        />
      )}

      {/* 4. STACKED GIFT COMBO BANNERS (Matching Cajan x157 & Kity s's x95 in reference image) */}
      <GiftAnimationQueue activeGift={activeGiftAnimation} />

      {/* 5. BOTTOM SECTION: MULTI-BADGE LIVE CHAT & CONTROLS */}
      <div className="relative z-30 p-2.5 flex flex-col justify-end space-y-2 bg-gradient-to-t from-black/95 via-black/50 to-transparent pt-6">
        {/* Chat stream with multi-badges */}
        <LiveChatStream
          messages={roomMessages}
          hostName={activeRoom.streamerName}
        />

        {/* Bottom Control Bar */}
        <LiveBottomBar
          onSendMessage={text => sendChatMessage(activeRoom.id, text)}
          onOpenGiftSheet={() => setShowGiftSheet(true)}
          onOpenGames={() => setShowGamesModal(true)}
          onOpenMenu={() => setShowMenuModal(true)}
          onTapLike={handleTapScreen}
          likesCount={likesCount}
        />
      </div>

      {/* MODALS & BOTTOM SHEETS */}
      {showGiftSheet && (
        <GiftBottomSheet
          roomId={activeRoom.id}
          onClose={() => setShowGiftSheet(false)}
        />
      )}

      {showGamesModal && (
        <LiveGamesModal onClose={() => setShowGamesModal(false)} />
      )}

      {showMenuModal && (
        <LiveRoomMenuModal
          room={activeRoom}
          onOpenReport={() => setShowReportModal(true)}
          onOpenHostProfile={() => setShowHostProfile(true)}
          onClose={() => setShowMenuModal(false)}
        />
      )}

      {showHostProfile && (
        <HostProfileModal
          room={activeRoom}
          isFollowing={isFollowing}
          onToggleFollow={() => setIsFollowing(!isFollowing)}
          onOpenGiftSheet={() => setShowGiftSheet(true)}
          onOpenReport={() => setShowReportModal(true)}
          onClose={() => setShowHostProfile(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          reportedUserId={activeRoom.streamerId}
          reportedUserName={activeRoom.streamerName}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
