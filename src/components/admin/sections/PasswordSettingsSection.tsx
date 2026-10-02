import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';

export const PasswordSettingsSection: React.FC = () => {
  const { changePassword } = useAdminAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setSuccess('Admin password successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(res.error || 'Failed to update password. Verify current password.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Security & Password
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Change the Master Admin Dashboard access password (Initial: Alian12345).
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Current Admin Password
          </label>
          <input
            type="password"
            required
            placeholder="Default initial: Alian12345"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            New Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter new strong password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            required
            placeholder="Re-type new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200"
          />
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Updating Password...' : 'Update Admin Password'}
          </button>
        </div>
      </form>
    </div>
  );
};
