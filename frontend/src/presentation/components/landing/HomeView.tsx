import { LandingHero } from './LandingHero';
import { LandingActions } from './LandingActions';
import { LandingFeatureCards } from './LandingFeatureCards';

export function HomeView() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <section className="max-w-4xl text-center">
          <LandingHero />
          <LandingActions />
          <LandingFeatureCards />
        </section>
      </main>
    </div>
  );
}
