'use client';

import { useState } from 'react';
import { useAuthActions } from '@/presentation/hooks/useAuthActions';
import { authMessages } from '@/presentation/messages/auth';
import { normalizePhone } from '@/presentation/utils/normalizePhone';

interface ClientLoginFormProps {
  onClientLogin: () => void;
}

export function ClientLoginForm({ onClientLogin }: ClientLoginFormProps) {
  const { clientLogin } = useAuthActions();
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await clientLogin({ documentNumber, phone: normalizePhone(phone) });
      onClientLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : authMessages.lookupError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleClientLogin} className="mt-6 space-y-5">
      <div>
        <label htmlFor="document" className="block text-sm font-medium text-slate-700">
          {authMessages.documentNumber}
        </label>
        <input
          id="document"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder={authMessages.documentNumberPlaceholder}
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
          className="mt-1.5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          placeholder={authMessages.phonePlaceholder}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 disabled:opacity-60"
      >
        {loading ? authMessages.lookingUp : authMessages.lookup}
      </button>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
