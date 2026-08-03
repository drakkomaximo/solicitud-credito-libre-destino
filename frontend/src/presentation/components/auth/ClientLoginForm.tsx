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
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
