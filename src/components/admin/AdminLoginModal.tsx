import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { login } = useAdminAuth();
  const { navigateToHome } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(password);
      if (!res.success) {
        setError(res.error || 'Incorrect admin password.');
      }
    } catch {
      setError('Authentication failed. Please verify password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <button
        onClick={navigateToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer bg-transparent border-0"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Storefront</span>
      </button>

      <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 sm:p-10 shadow-2xl space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display font-bold text-xl sm:text-2xl text-neutral-100 uppercase tracking-tight">
            Master Admin Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Perfect Time Collection Management Console
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Enter password (Initial: Alian12345)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg pl-4 pr-11 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1.5">
              Default password: <code className="text-amber-400/80">Alian12345</code> (can be changed inside)
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
          </button>
        </form>

        <div className="pt-4 border-t border-neutral-800 text-center text-[11px] text-neutral-500">
          Protected Area • Only authorized store managers allowed
        </div>
      </div>
    </div>
  );
};
