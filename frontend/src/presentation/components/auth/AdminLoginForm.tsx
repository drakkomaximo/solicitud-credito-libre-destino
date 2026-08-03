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
    <form onSubmit={handleAdminLogin} className="mt-6 space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700">
          {authMessages.username}
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded border p-2"
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
          className="mt-1 w-full rounded border p-2"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {authMessages.login}
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
