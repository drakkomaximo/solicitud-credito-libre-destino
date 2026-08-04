import Link from 'next/link';
import { FadeIn } from '@/presentation/components/common/FadeIn';
import { landingMessages } from '@/presentation/messages/landing';

const { ctaStart, ctaList } = landingMessages;

const primary = {
  path: '/applications/new',
  label: ctaStart,
  className:
    'inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700 sm:w-auto sm:px-8 sm:py-4 sm:text-lg',
};

const secondary = {
  path: '/applications',
  label: ctaList,
  className:
    'inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto sm:px-8 sm:py-4 sm:text-lg',
};

const actions = [primary, secondary];

export function LandingActions() {
  return (
    <FadeIn delay={0.15}>
      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        {actions.map((action) => (
          <Link key={action.path} href={action.path} className={action.className}>
            {action.label}
          </Link>
        ))}
      </div>
    </FadeIn>
  );
}
