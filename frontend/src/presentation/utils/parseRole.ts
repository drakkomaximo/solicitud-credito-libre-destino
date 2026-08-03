export function parseRole(token: string | null): 'admin' | 'application' | 'client' | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsed = JSON.parse(decoded) as { role?: string; exp?: number };
    if (parsed.exp && parsed.exp * 1000 < Date.now()) return null;
    const { role } = parsed;
    if (role === 'admin' || role === 'application' || role === 'client') return role;
    return null;
  } catch {
    return null;
  }
}
