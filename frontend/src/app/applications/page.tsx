'use client';

import { useEffect, useState } from 'react';
import { listApplications } from '@/lib/api';
import type { CreditApplication } from '@/types/application';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [items, setItems] = useState<CreditApplication[]>([]);
  const [status, setStatus] = useState('all');
  const [channel, setChannel] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    const load = async () => {
      const filters: any = {};
      if (status !== 'all') filters.status = status;
      if (channel !== 'all') filters.channel = channel;
      if (q) filters.q = q;
      const data = await listApplications(filters);
      setItems(Array.isArray(data) ? data : []);
    };
    load();
  }, [status, channel, q]);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Solicitudes</h1>
      <div className="mt-4 flex flex-wrap gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Todos los estados</option>
          <option value="DRAFT">Borrador</option>
          <option value="NOT_VIABLE">No viable</option>
          <option value="PENDING_VALIDATION">Pendiente validación</option>
          <option value="FINALIZED">Finalizada</option>
          <option value="ABANDONED">Abandonada</option>
        </select>
        <select
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">Todos los canales</option>
          <option value="self-service">Autogestionado</option>
          <option value="advisor">Asistido</option>
        </select>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar..."
          className="border rounded p-2"
        />
      </div>
      <ul className="mt-6 space-y-4">
        {items.length === 0 && (
          <li className="text-slate-600">No hay solicitudes.</li>
        )}
        {items.map((app) => (
          <li key={app.id} className="border rounded p-4">
            <Link
              href={`/applications/${app.id}`}
              className="text-lg font-medium text-sky-700"
            >
              {app.firstName} {app.lastName}
            </Link>
            <p className="text-sm text-slate-600">
              {app.documentNumber} — {app.status} — {app.channel}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
