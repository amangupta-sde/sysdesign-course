import Link from "next/link";
import { ProgressTable } from "./progress-table";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-6 pt-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Master <span className="text-[var(--accent)]">System Design</span> Interviews
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-[var(--text-muted)]">
          A structured, beginner-friendly course to go from zero to designing systems like
          Twitter, Uber, and Netflix — the same way top engineers at Google and Meta do it.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/what-is-system-design"
            className="rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white transition hover:bg-[var(--accent-dim)]"
          >
            Start Learning →
          </Link>
        </div>
      </section>

      {/* Progress */}
      <ProgressTable />

      {/* Curriculum */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Curriculum</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {modules.map((m, i) => (
            <Link
              key={i}
              href={m.href}
              className={`group rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 transition hover:border-[var(--accent)]/40 hover:bg-[var(--bg-hover)] ${
                m.href === "#" ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="mb-2 text-2xl">{m.icon}</div>
              <h3 className="font-semibold group-hover:text-[var(--accent)]">{m.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{m.desc}</p>
              {m.href === "#" && (
                <span className="mt-2 inline-block rounded-full bg-[var(--bg-hover)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                  Coming soon
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
        <h2 className="text-2xl font-bold">Why System Design?</h2>
        <div className="grid gap-6 text-sm text-[var(--text-muted)] sm:grid-cols-3">
          <div>
            <p className="mb-1 text-3xl">💰</p>
            <p className="font-medium text-[var(--text)]">Higher Offers</p>
            <p>Strong SD performance = senior-level offers with higher comp.</p>
          </div>
          <div>
            <p className="mb-1 text-3xl">🧠</p>
            <p className="font-medium text-[var(--text)]">Real Engineering</p>
            <p>Unlike leetcode, these skills apply directly to your daily work.</p>
          </div>
          <div>
            <p className="mb-1 text-3xl">🎯</p>
            <p className="font-medium text-[var(--text)]">Required Round</p>
            <p>Every FAANG-level interview has a dedicated system design round.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

const modules = [
  { icon: "🏗️", title: "What is System Design?", desc: "Understand the fundamentals — what it is, why it matters, and the building blocks.", href: "/what-is-system-design" },
  { icon: "🗺️", title: "Interview Framework", desc: "The 7-step framework to structure any system design interview in 40 minutes.", href: "/interview-framework" },
  { icon: "🌐", title: "DNS", desc: "How the internet translates domain names to IP addresses — the first step of every request.", href: "/dns" },
  { icon: "🔗", title: "URL Shortener", desc: "Design TinyURL — the classic warm-up problem covering all fundamentals.", href: "#" },
  { icon: "📸", title: "Instagram", desc: "Photo sharing at scale — feed generation, storage, and CDN.", href: "#" },
  { icon: "💬", title: "Chat System", desc: "Real-time messaging with WebSockets, message ordering, and presence.", href: "#" },
];
