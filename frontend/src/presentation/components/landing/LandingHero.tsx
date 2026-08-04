import { FadeIn } from '@/presentation/components/common/FadeIn';
import { landingMessages } from '@/presentation/messages/landing';

export function LandingHero() {
  const { badge, title, description } = landingMessages;
  return (
    <>
      <FadeIn delay={0}>
        <span className="inline-block rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800">
          {badge}
        </span>
      </FadeIn>
      <FadeIn delay={0.05}>
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl">
          {description}
        </p>
      </FadeIn>
    </>
  );
}
