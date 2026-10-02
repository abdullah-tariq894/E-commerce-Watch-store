import React, { useState } from 'react';
import { Check, AlertCircle, Send, Key, Info } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { api } from '../../../services/api';

export const EmailSettingsSection: React.FC = () => {
  const { settings, refreshData } = useStore();
  const [ownerEmail, setOwnerEmail] = useState(
    settings.email.ownerEmail || 'perfecttime246@gmail.com'
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        email: {
          ...settings.email,
          ownerEmail,
        },
        footer: {
          ...settings.footer,
          email: ownerEmail,
        },
      });
      await refreshData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to update email address');
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await api.testEmail();
      if (res.success) {
        setTestResult({
          success: true,
          message: `Test email successfully dispatched to ${ownerEmail}! Please check your Gmail Inbox.`,
        });
      } else {
        setTestResult({
          success: false,
          message:
            res.error ||
            'Gmail App Password is not yet set in .env. Orders are saved safely; follow the 4-step setup below to activate live email alerts.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error triggering test email.',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="pb-4 border-b border-neutral-800">
        <h1 className="text-2xl font-display font-bold text-neutral-100 uppercase tracking-tight">
          Email Notification System
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Automated order alerts dispatched directly to the store owner's Gmail whenever a customer places an order.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Owner email address saved!</span>
        </div>
      )}

      {/* Owner Email Address Form */}
      <form onSubmit={handleSave} className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 font-semibold uppercase mb-1.5">
            Owner Gmail Notification Address <span className="text-amber-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              required
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 text-sm focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase rounded-lg transition-all cursor-pointer"
            >
              Update
            </button>
          </div>
          <p className="text-[11px] text-neutral-500 mt-1.5">
            Every customer order notification email is sent to this address with subject: <code className="text-amber-400/90">"You Got a New Order from Website!"</code>
          </p>
        </div>
      </form>

      {/* Test Email Button & Diagnostic Results */}
      <div className="bg-neutral-900/60 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-sm text-neutral-200 uppercase">
              Test Email Delivery
            </h3>
            <p className="text-neutral-400 text-[11px] mt-0.5">
              Sends a sample order notification to verify your SMTP authentication.
            </p>
          </div>
          <button
            onClick={handleTestEmail}
            disabled={testing}
            className="flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold uppercase rounded-lg border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 text-amber-500 ${testing ? 'animate-pulse' : ''}`} />
            <span>{testing ? 'Sending Test Email...' : 'Send Test Notification'}</span>
          </button>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}
          >
            {testResult.success ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold">
                {testResult.success ? 'Email Notification Sent!' : 'SMTP Notice'}
              </div>
              <div className="text-[11px] mt-0.5 leading-relaxed">{testResult.message}</div>
            </div>
          </div>
        )}
      </div>

      {/* Gmail App Password Step-by-Step Guide */}
      <div className="bg-neutral-900/40 p-6 rounded-2xl border border-neutral-800 space-y-4 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
          <Key className="w-4 h-4" />
          <span>How to Activate Gmail Order Notifications (4 Easy Steps)</span>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-neutral-300 leading-relaxed text-[11px]">
          <li>
            Open Google Account Security for <strong className="text-neutral-100">{ownerEmail}</strong>:{' '}
            <a
              href="https://myaccount.google.com/apppasswords"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-mono"
            >
              https://myaccount.google.com/apppasswords
            </a>
          </li>
          <li>
            Ensure <strong>2-Step Verification</strong> is enabled on your Gmail account.
          </li>
          <li>
            Under <em>"App passwords"</em>, create a new password named <strong>"Perfect Time Watches"</strong>.
          </li>
          <li>
            Google will generate a 16-character code (e.g. <code className="text-amber-300">abcd efgh ijkl mnop</code>). Copy it and paste into your project's <code className="text-amber-400">.env</code> file under <code className="text-amber-400">GMAIL_APP_PASSWORD</code>.
          </li>
        </ol>
        <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Note:</strong> Customer orders are <em>always safely recorded in the database</em> even if your Gmail password has not been entered yet.
          </span>
        </div>
      </div>
    </div>
  );
};
