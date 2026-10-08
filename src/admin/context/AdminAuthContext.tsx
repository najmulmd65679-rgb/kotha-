import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminPermission, AuditLogItem } from '../types';
import { ROLE_PERMISSIONS } from '../defaultConfigs';
import { auth, googleProvider, db } from '../../firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  limit,
  query,
} from 'firebase/firestore';

interface AdminAuthContextType {
  currentAdmin: AdminUser | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<void>;
  logoutAdmin: () => Promise<void>;
  hasPermission: (perm: AdminPermission) => boolean;
  recordAuditLog: (
    action: string,
    targetEntity: AuditLogItem['targetEntity'],
    targetId: string,
    details: string,
    oldValue?: any,
    newValue?: any
  ) => Promise<void>;
  bootstrapSuperAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Initial project developer email
const SUPER_ADMIN_WHITELIST_EMAIL = 'najmulmd65679@gmail.com';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user);
      setAuthError(null);

      if (user) {
        const userEmail = (user.email || '').toLowerCase().trim();
        const isOwner = userEmail === SUPER_ADMIN_WHITELIST_EMAIL.toLowerCase();

        try {
          // Check if admin document exists in Firestore /admins/{uid}
          const adminRef = doc(db, 'admins', user.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists()) {
            const data = adminSnap.data() as AdminUser;
            if (data.isActive) {
              setCurrentAdmin(data);
              // Update last login
              await setDoc(adminRef, { lastLoginAt: new Date().toISOString() }, { merge: true });
            } else {
              setAuthError('Your admin account has been deactivated. Please contact Super Admin.');
              setCurrentAdmin(null);
            }
          } else if (isOwner) {
            // First time setup for primary owner: provision Super Admin
            const newSuperAdmin: AdminUser = {
              id: user.uid,
              email: user.email || SUPER_ADMIN_WHITELIST_EMAIL,
              name: user.displayName || 'Owner Super Admin',
              role: 'super_admin',
              permissions: ROLE_PERMISSIONS['super_admin'],
              isActive: true,
              avatar: user.photoURL || undefined,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            await setDoc(adminRef, newSuperAdmin, { merge: true });
            setCurrentAdmin(newSuperAdmin);
            setAuthError(null);
          } else {
            // Regular user who is NOT in the admin directory
            setCurrentAdmin(null);
            setAuthError('Access Denied: You are not authorized to access the Admin Panel. Regular users cannot log in here.');
          }
        } catch (err: any) {
          console.error('Admin verification error:', err);
          if (isOwner) {
            // Self-heal for project owner: assign super admin privileges
            const fallbackAdmin: AdminUser = {
              id: user.uid,
              email: user.email || SUPER_ADMIN_WHITELIST_EMAIL,
              name: user.displayName || 'Owner Super Admin',
              role: 'super_admin',
              permissions: ROLE_PERMISSIONS['super_admin'],
              isActive: true,
              avatar: user.photoURL || undefined,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            setCurrentAdmin(fallbackAdmin);
            setAuthError(null);
            setDoc(doc(db, 'admins', user.uid), fallbackAdmin, { merge: true }).catch(console.warn);
          } else {
            setAuthError('Verification error: ' + (err.message || 'Failed to verify admin status.'));
            setCurrentAdmin(null);
          }
        }
      } else {
        setCurrentAdmin(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Admin popup login error:', err);
      setAuthError(err.message || 'Authentication failed. Please check popup permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAdmin = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setCurrentAdmin(null);
      setFirebaseUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (perm: AdminPermission): boolean => {
    if (!currentAdmin || !currentAdmin.isActive) return false;
    if (currentAdmin.role === 'super_admin') return true;
    return currentAdmin.permissions.includes(perm);
  };

  const recordAuditLog = async (
    action: string,
    targetEntity: AuditLogItem['targetEntity'],
    targetId: string,
    details: string,
    oldValue?: any,
    newValue?: any
  ) => {
    if (!currentAdmin) return;
    try {
      const logId = 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      const auditItem: AuditLogItem = {
        id: logId,
        adminId: currentAdmin.id,
        adminEmail: currentAdmin.email,
        adminName: currentAdmin.name,
        adminRole: currentAdmin.role,
        action,
        targetEntity,
        targetId,
        oldValue: oldValue ? JSON.stringify(oldValue) : undefined,
        newValue: newValue ? JSON.stringify(newValue) : undefined,
        details,
        timestamp: new Date().toISOString(),
      };
      await setDoc(doc(db, 'audit_logs', logId), auditItem);
    } catch (err) {
      console.warn('Audit log write notice:', err);
    }
  };

  const bootstrapSuperAdmin = async () => {
    if (!firebaseUser) return;
    const newSuperAdmin: AdminUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || SUPER_ADMIN_WHITELIST_EMAIL,
      name: firebaseUser.displayName || 'Authorized Admin',
      role: 'super_admin',
      permissions: ROLE_PERMISSIONS['super_admin'],
      isActive: true,
      avatar: firebaseUser.photoURL || undefined,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'admins', firebaseUser.uid), newSuperAdmin);
    setCurrentAdmin(newSuperAdmin);
    setAuthError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        currentAdmin,
        firebaseUser,
        isLoading,
        authError,
        loginWithGoogle,
        logoutAdmin,
        hasPermission,
        recordAuditLog,
        bootstrapSuperAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return context;
};
