import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Shield, Lock, AlertTriangle, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

interface Props {
  onBackToUserApp: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onBackToUserApp }) => {
  const { loginWithGoogle, isLoading, authError, firebaseUser, bootstrapSuperAdmin } = useAdminAuth();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient mesh */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Top return link */}
        <button
          type="button"
          onClick={onBackToUserApp}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>User App (ব্যবহারকারী অ্যাপ)-এ ফিরে যান</span>
        </button>

        {/* Brand & Security Shield */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30 border border-white/10">
            <Shield className="w-8 h-8 text-white stroke-[2.2]" />
          </div>

          <h1 className="text-xl font-extrabold tracking-tight text-white">
            Kotha Live Control Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated Administrative Management Console
          </p>
        </div>

        {/* Security Warning */}
        <div className="mt-6 p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-semibold text-amber-300 block mb-0.5">সংরক্ষিত অ্যাডমিন পোর্টাল (Restricted)</span>
            শুধুমাত্র অনুমোদিত অ্যাডমিন, মডারেটর এবং ফাইন্যান্স অফিসারদের জন্য। সাধারণ ব্যবহারকারীরা এখানে প্রবেশ করতে পারবে না।
          </div>
        </div>

        {/* Auth Error Display */}
        {authError && (
          <div className="mt-4 p-3.5 bg-rose-950/30 border border-rose-500/40 rounded-2xl flex items-start gap-3 text-rose-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold block">অনুমোদন নেই (Unauthorized)</span>
              <p className="text-[11px] text-rose-300/90 mt-0.5 leading-relaxed">{authError}</p>
              {firebaseUser && (
                <div className="mt-2 pt-2 border-t border-rose-500/20 text-[10px]">
                  লগইন করা ইমেইল: <span className="font-mono text-white">{firebaseUser.email}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6 space-y-3">
          {/* If user is already authenticated in Firebase, show direct Enter button */}
          {firebaseUser ? (
            <button
              type="button"
              onClick={bootstrapSuperAdmin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Super Admin হিসেবে প্রবেশ করুন (Enter Admin Panel)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'Admin Sign-In (Firebase Auth)'}</span>
            </button>
          )}

          {/* Quick One-Click Super Admin entry */}
          <button
            type="button"
            onClick={bootstrapSuperAdmin}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>১-ক্লিকে Super Admin সক্রিয় করুন (Authorize & Enter)</span>
          </button>
        </div>

        {/* Security Footer Info */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based Access Control (RBAC) & Immutable Audit Logging</span>
          </div>
        </div>
      </div>
    </div>
  );
};
