'use client';

import { useState } from 'react';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';

interface AdminLoginFormProps {
  onAdminLogin: () => void;
}

export function AdminLoginForm({ onAdminLogin }: AdminLoginFormProps) {
  const { login } = useAuthActions();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login.execute({ username, password });
      onAdminLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : authMessages.loginError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdminLogin} className="mt-6 space-y-5">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700">
          {authMessages.username}
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder={authMessages.usernamePlaceholder}
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          {authMessages.password}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder={authMessages.passwordPlaceholder}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? authMessages.loggingIn : authMessages.login}
      </button>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
