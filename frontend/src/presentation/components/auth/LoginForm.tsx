'use client';

import { useState } from 'react';
import { AdminLoginForm } from './AdminLoginForm';
import { ClientLoginForm } from './ClientLoginForm';
import { authMessages } from '@/presentation/messages/auth';

interface LoginFormProps {
  onAdminLogin: () => void;
  onClientLogin: () => void;
}

export function LoginForm({ onAdminLogin, onClientLogin }: LoginFormProps) {
  const [mode, setMode] = useState<'admin' | 'client'>('client');

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

      {mode === 'admin' ? (
        <AdminLoginForm onAdminLogin={onAdminLogin} />
      ) : (
        <ClientLoginForm onClientLogin={onClientLogin} />
      )}
    </main>
  );
}
