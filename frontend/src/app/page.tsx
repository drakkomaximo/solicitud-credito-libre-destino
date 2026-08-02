import Link from "next/link";
import { landingMessages } from "@/presentation/messages/landing";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 bg-gradient-to-b from-sky-50 to-white">
        <section className="max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            {landingMessages.title}
          </h1>
          <p className="mt-6 text-lg text-slate-700">
            {landingMessages.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/applications/new"
              className="rounded-lg bg-sky-600 px-6 py-3 text-white font-medium hover:bg-sky-700"
            >
              {landingMessages.ctaStart}
            </Link>
            <Link
              href="/applications"
              className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              {landingMessages.ctaList}
            </Link>
          </div>
          <h2 className="mt-12 text-xl font-semibold text-slate-900">
            {landingMessages.requirementsTitle}
          </h2>
          <ul className="mt-4 text-left inline-block text-slate-700 space-y-2">
            {landingMessages.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
