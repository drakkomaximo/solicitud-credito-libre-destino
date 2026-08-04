import { authMessages } from '@/presentation/messages/auth';

interface RoleHeaderProps {
  role: 'admin' | 'application' | 'client';
  onLogout: () => void;
}

export function RoleHeader({ role, onLogout }: RoleHeaderProps) {
  const label = role === 'admin' ? authMessages.admin : authMessages.client;
  return (
    <header className="mb-6 w-full rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 font-bold">
            {label[0]}
          </span>
          <div>
            <p className="text-xs text-slate-500 sm:text-sm">{authMessages.loggedAs}</p>
            <p className="text-base font-semibold text-slate-900 sm:text-lg">{label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto sm:py-2"
        >
          {authMessages.logout}
        </button>
      </div>
    </header>
  );
}
