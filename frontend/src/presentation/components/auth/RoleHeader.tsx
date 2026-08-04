import { authMessages } from '@/presentation/messages/auth';

interface RoleHeaderProps {
  role: 'admin' | 'application' | 'client';
  onLogout: () => void;
}

export function RoleHeader({ role, onLogout }: RoleHeaderProps) {
  const label = role === 'admin' ? authMessages.admin : authMessages.client;
  return (
    <header className="mx-auto mb-6 max-w-5xl rounded-2xl border border-slate-100 bg-white p-3 shadow-md sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700 font-bold sm:h-10 sm:w-10">
            {label[0]}
          </span>
          <span className="text-sm font-medium text-slate-700 sm:text-base">
            {authMessages.loggedAs}: <strong className="text-slate-900">{label}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          {authMessages.logout}
        </button>
      </div>
    </header>
  );
}
