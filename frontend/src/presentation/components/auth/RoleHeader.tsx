import { authMessages } from '@/presentation/messages/auth';

interface RoleHeaderProps {
  role: 'admin' | 'application' | 'client';
  onLogout: () => void;
}

export function RoleHeader({ role, onLogout }: RoleHeaderProps) {
  const label = role === 'admin' ? authMessages.admin : authMessages.client;
  return (
    <header className="mx-auto max-w-5xl p-4 mb-4 flex items-center justify-between bg-white shadow rounded">
      <span className="font-medium text-slate-700">
        {authMessages.loggedAs}: <strong>{label}</strong>
      </span>
      <button
        type="button"
        onClick={onLogout}
        className="rounded border px-3 py-1 text-sm hover:bg-slate-100"
      >
        {authMessages.logout}
      </button>
    </header>
  );
}
