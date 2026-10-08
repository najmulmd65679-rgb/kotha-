import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface Props {
  reportedUserId: string;
  reportedUserName: string;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ reportedUserId, reportedUserName, onClose }) => {
  const { submitReport, toggleBlockUser, blockedUserIds } = useApp();
  const [reason, setReason] = useState<string>('Inappropriate Content');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const isBlocked = blockedUserIds.includes(reportedUserId);

  const reasons = [
    'Inappropriate Content',
    'Harassment or Hate Speech',
    'Spam or Scam Promotion',
    'Underage Streamer',
    'Copyright Infringement',
    'Other Violations',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(reportedUserId, reportedUserName, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-5 text-white shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-base font-bold text-white">Report Submitted</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Thank you. Our 24/7 security moderators will review this stream promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="text-sm font-bold text-white">Report Host / User</h3>
                <p className="text-xs text-neutral-400">Host: {reportedUserName}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Reason for report:
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {reasons.map(r => (
                  <label
                    key={r}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer border transition-colors ${
                      reason === r
                        ? 'bg-red-500/10 border-red-500/40 text-red-300'
                        : 'bg-neutral-800/60 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-red-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Additional comments (optional):
              </label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                rows={2}
                placeholder="Explain what happened..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Block Option */}
            <div className="flex items-center justify-between p-2.5 bg-neutral-800/80 rounded-xl border border-neutral-700/60">
              <span className="text-xs text-neutral-300">Block this user entirely?</span>
              <button
                type="button"
                onClick={() => toggleBlockUser(reportedUserId)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  isBlocked ? 'bg-red-600 text-white' : 'bg-neutral-700 text-neutral-300 hover:text-white'
                }`}
              >
                {isBlocked ? 'Blocked' : 'Block User'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
