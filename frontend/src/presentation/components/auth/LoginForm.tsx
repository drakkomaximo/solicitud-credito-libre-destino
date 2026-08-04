'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLoginForm } from './AdminLoginForm';
import { ClientLoginForm } from './ClientLoginForm';
import { FadeIn } from '@/presentation/components/common/FadeIn';
import { authMessages } from '@/presentation/messages/auth';

interface LoginFormProps {
  onAdminLogin: () => void;
  onClientLogin: () => void;
}

export function LoginForm({ onAdminLogin, onClientLogin }: LoginFormProps) {
  const [mode, setMode] = useState<'admin' | 'client'>('client');

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center p-6">
      <FadeIn className="w-full">
        <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          <h1 className="text-center text-3xl font-extrabold text-slate-900">{authMessages.chooseRole}</h1>
          <p className="mt-2 text-center text-slate-500">{authMessages.loginDescription}</p>

          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode('client')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                mode === 'client'
                  ? 'bg-white text-sky-700 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {authMessages.client}
            </button>
            <button
              type="button"
              onClick={() => setMode('admin')}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                mode === 'admin'
                  ? 'bg-white text-sky-700 shadow'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {authMessages.admin}
            </button>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'admin' ? 12 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          >
            {mode === 'admin' ? (
              <AdminLoginForm onAdminLogin={onAdminLogin} />
            ) : (
              <ClientLoginForm onClientLogin={onClientLogin} />
            )}
          </motion.div>
        </div>
      </FadeIn>
    </main>
  );
}
