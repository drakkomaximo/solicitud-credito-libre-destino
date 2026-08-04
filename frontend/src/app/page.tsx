import Link from "next/link";
import { FadeIn } from "@/presentation/components/common/FadeIn";
import { landingMessages } from "@/presentation/messages/landing";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
        <section className="max-w-4xl text-center">
          <FadeIn delay={0}>
            <span className="inline-block rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-800">
              100% digital
            </span>
          </FadeIn>
          <FadeIn delay={0.05}>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              {landingMessages.title}
            </h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="mt-6 text-xl leading-relaxed text-slate-600">
              {landingMessages.description}
            </p>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/applications/new"
                className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-200 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                {landingMessages.ctaStart}
              </Link>
              <Link
                href="/applications"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
              >
                {landingMessages.ctaList}
              </Link>
            </div>
          </FadeIn>

          <div className="mt-16 grid gap-6 text-left sm:grid-cols-3">
            {[
              { title: 'Rápido', desc: 'Conoce una oferta preliminar en minutos, sin filas ni papeleos.' },
              { title: 'Seguro', desc: 'Tus datos están protegidos y solo se usan con tu autorización.' },
              { title: 'Flexible', desc: 'Elige el monto, plazo y canal que mejor se ajusten a ti.' },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={0.2 + i * 0.08}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-slate-600">{card.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <h2 className="mt-16 text-2xl font-semibold text-slate-900">
              {landingMessages.requirementsTitle}
            </h2>
          </FadeIn>
          <ul className="mt-6 inline-block text-left text-slate-700 space-y-3">
            {landingMessages.requirements.map((req, i) => (
              <FadeIn key={req} delay={0.55 + i * 0.05}>
                <li className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold">✓</span>
                  {req}
                </li>
              </FadeIn>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
