'use client';

import { useState } from 'react';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';

interface LoginFormProps {
  onAdminLogin: () => void;
  onClientLogin: () => void;
}

export function LoginForm({ onAdminLogin, onClientLogin }: LoginFormProps) {
  const { login, clientLogin } = useAuthActions();
  const [mode, setMode] = useState<'admin' | 'client'>('client');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
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

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await clientLogin({ documentNumber, phone });
      onClientLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : authMessages.lookupError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold text-slate-900">{authMessages.chooseRole}</h1>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('client')}
          className={`rounded px-4 py-2 ${
            mode === 'client'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-200 text-slate-800'
          }`}
        >
          {authMessages.client}
        </button>
        <button
          type="button"
          onClick={() => setMode('admin')}
          className={`rounded px-4 py-2 ${
            mode === 'admin'
              ? 'bg-sky-600 text-white'
              : 'bg-slate-200 text-slate-800'
          }`}
        >
          {authMessages.admin}
        </button>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {mode === 'admin' ? (
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
        </form>
      ) : (
        <form onSubmit={handleClientLogin} className="mt-6 space-y-4">
          <div>
            <label htmlFor="document" className="block text-sm font-medium text-slate-700">
              {authMessages.documentNumber}
            </label>
            <input
              id="document"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              {authMessages.phone}
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded border p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {authMessages.lookup}
          </button>
        </form>
      )}
    </main>
  );
}
