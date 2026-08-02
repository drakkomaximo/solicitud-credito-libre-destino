declare const process: { env: Record<string, string | undefined> };
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API = `${API_BASE}/api/v1`;

export async function createApplication(data: any) {
  const res = await fetch(`${API}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listApplications(filters?: { status?: string; channel?: string; q?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.channel) params.set('channel', filters.channel);
  if (filters?.q) params.set('q', filters.q);
  const res = await fetch(`${API}/applications?${params.toString()}`);
  return res.json();
}

export async function getApplication(id: string) {
  const res = await fetch(`${API}/applications/${id}`);
  return res.json();
}

export async function updateApplication(id: string, data: any) {
  const res = await fetch(`${API}/applications/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function simulateOffer(id: string) {
  const res = await fetch(`${API}/applications/${id}/simulate-offer`, { method: 'POST' });
  return res.json();
}

export async function finalizeApplication(id: string) {
  const res = await fetch(`${API}/applications/${id}/finalize`, { method: 'POST' });
  return res.json();
}

export async function abandonApplication(id: string, data: { reason: string }) {
  const res = await fetch(`${API}/applications/${id}/abandon`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getApplicationEvents(id: string) {
  const res = await fetch(`${API}/applications/${id}/events`);
  return res.json();
}
