/**
 * WebRTC Signaling Service using Firebase Firestore
 * Facilitates P2P low-latency live video streaming & co-host guest broadcasting
 * using Google public STUN servers and real-time Firestore signaling channels.
 */

import { db } from '../firebase';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export class WebRTCSignalingService {
  private peerConnection: RTCPeerConnection | null = null;
  private unsubscribeListeners: (() => void)[] = [];

  /**
   * Host initializes live video broadcast and writes SDP offer to Firestore
   */
  async startBroadcasting(
    roomId: string,
    localStream: MediaStream,
    onViewerConnected?: (viewerId: string) => void
  ): Promise<RTCPeerConnection> {
    this.cleanup();

    this.peerConnection = new RTCPeerConnection(RTC_CONFIG);

    // Add local media tracks to peer connection
    localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, localStream);
    });

    // Reference to signaling document for this room
    const signalingDocRef = doc(db, 'rooms', roomId, 'signaling', 'channel');
    const hostCandidatesRef = collection(db, 'rooms', roomId, 'host_ice_candidates');

    // Collect ICE candidates and push to Firestore
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        addDoc(hostCandidatesRef, event.candidate.toJSON()).catch(e =>
          console.warn('ICE candidate publish notice:', e.message)
        );
      }
    };

    // Create SDP Offer
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    // Write offer to Firestore
    await setDoc(
      signalingDocRef,
      {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        status: 'broadcasting',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Listen for Answer from connected viewer/co-host
    const unsubAnswer = onSnapshot(signalingDocRef, async snapshot => {
      const data = snapshot.data();
      if (!this.peerConnection || !data?.answer) return;

      if (!this.peerConnection.currentRemoteDescription && data.answer.sdp) {
        const answer = new RTCSessionDescription(data.answer);
        await this.peerConnection.setRemoteDescription(answer);
        onViewerConnected?.('remote-peer');
      }
    });
    this.unsubscribeListeners.push(unsubAnswer);

    // Listen for remote ICE candidates
    const remoteCandidatesRef = collection(db, 'rooms', roomId, 'viewer_ice_candidates');
    const unsubCandidates = onSnapshot(remoteCandidatesRef, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && this.peerConnection) {
          const candidateData = change.doc.data();
          this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)).catch(e =>
            console.warn('Remote ICE candidate notice:', e.message)
          );
        }
      });
    });
    this.unsubscribeListeners.push(unsubCandidates);

    return this.peerConnection;
  }

  /**
   * Viewer connects to room and receives live video stream
   */
  async joinStreamAsViewer(
    roomId: string,
    onRemoteStream: (stream: MediaStream) => void
  ): Promise<RTCPeerConnection | null> {
    this.cleanup();

    const signalingDocRef = doc(db, 'rooms', roomId, 'signaling', 'channel');
    const signalingSnap = await getDoc(signalingDocRef);

    if (!signalingSnap.exists() || !signalingSnap.data()?.offer) {
      console.warn('No active WebRTC offer found for room, using simulated stream.');
      return null;
    }

    this.peerConnection = new RTCPeerConnection(RTC_CONFIG);

    const remoteStream = new MediaStream();
    this.peerConnection.ontrack = event => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      onRemoteStream(remoteStream);
    };

    // Send viewer ICE candidates
    const viewerCandidatesRef = collection(db, 'rooms', roomId, 'viewer_ice_candidates');
    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        addDoc(viewerCandidatesRef, event.candidate.toJSON()).catch(e =>
          console.warn('Viewer ICE candidate notice:', e.message)
        );
      }
    };

    // Set remote offer from host
    const offer = signalingSnap.data().offer;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create and send SDP answer
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    await setDoc(
      signalingDocRef,
      {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
        viewerJoinedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Listen for host ICE candidates
    const hostCandidatesRef = collection(db, 'rooms', roomId, 'host_ice_candidates');
    const unsubHostCandidates = onSnapshot(hostCandidatesRef, snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && this.peerConnection) {
          const candidateData = change.doc.data();
          this.peerConnection.addIceCandidate(new RTCIceCandidate(candidateData)).catch(e =>
            console.warn('Host ICE candidate notice:', e.message)
          );
        }
      });
    });
    this.unsubscribeListeners.push(unsubHostCandidates);

    return this.peerConnection;
  }

  /**
   * Cleanup peer connection, tracks and Firestore listeners
   */
  cleanup() {
    this.unsubscribeListeners.forEach(unsub => unsub());
    this.unsubscribeListeners = [];

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}

export const webrtcService = new WebRTCSignalingService();
