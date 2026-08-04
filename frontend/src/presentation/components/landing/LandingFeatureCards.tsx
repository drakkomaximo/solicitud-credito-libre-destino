import { FadeIn } from '@/presentation/components/common/FadeIn';
import { landingMessages } from '@/presentation/messages/landing';

export function LandingFeatureCards() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:mt-16 sm:grid-cols-3">
      {landingMessages.cards.map((card, i) => (
        <FadeIn key={card.title} delay={0.2 + i * 0.08}>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="mt-2 text-slate-600">{card.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
