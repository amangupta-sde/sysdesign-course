import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "What is System Design? | SysDesign Course" };

export default function WhatIsSystemDesign() {
  return (
    <article className="prose-custom space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Module 1</p>
        <h1 className="text-3xl font-bold sm:text-4xl">What is System Design?</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The invisible architecture that makes software work for millions of users.
        </p>
      </header>

      {/* Intro */}
      <Section title="The Simple Explanation">
        <p>
          Imagine you&apos;re building Instagram — not the UI, not the button colors — but the{" "}
          <strong>invisible machinery</strong> behind it.
        </p>
        <p>
          How do 2 billion users upload photos simultaneously? How does your feed load in
          under 200ms? How does nothing get lost even if a server catches fire?
        </p>
        <Callout>
          System Design is the art of answering: <em>&quot;How would you build this at scale?&quot;</em>
        </Callout>
        <p>
          It&apos;s about designing the <strong>architecture</strong> — the servers, databases,
          caches, queues, and networks — that make software work reliably for millions (or
          billions) of users.
        </p>
      </Section>

      {/* Why it matters */}
      <Section title="Why Does It Matter?">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium text-red-400">Without System Design</th>
                <th className="pb-3 font-medium text-green-400">With System Design</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["App crashes at 10K users", "Handles 10M+ users smoothly"],
                ["Single server = single point of failure", "Multiple servers, auto-failover"],
                ["5-second page load", "<200ms response time"],
                ["Data lost when server dies", "Data replicated across regions"],
                ["$50K/month server bills", "Efficient, cost-optimized infra"],
              ].map(([bad, good], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-3 pr-4">{bad}</td>
                  <td className="py-3">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* What it is NOT */}
      <Section title="What System Design is NOT">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-red-400">❌ It is NOT</p>
            <ul className="space-y-1 text-sm text-[var(--text-muted)]">
              <li>Writing code (that&apos;s implementation)</li>
              <li>Choosing a programming language</li>
              <li>Designing UIs or user flows</li>
              <li>A problem with one &quot;correct&quot; answer</li>
            </ul>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">✅ It IS</p>
            <ul className="space-y-1 text-sm text-[var(--text-muted)]">
              <li>Choosing the right building blocks</li>
              <li>Understanding tradeoffs at scale</li>
              <li>Thinking about what breaks</li>
              <li>Communicating your reasoning clearly</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Building blocks */}
      <Section title="The Building Blocks">
        <p className="text-[var(--text-muted)]">
          Every large system is composed of these fundamental components. You&apos;ll learn each one deeply.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {buildingBlocks.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <span className="text-xl">{b.icon}</span>
              <div>
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Analogy */}
      <Section title="Real-World Analogy: The Restaurant">
        <p className="mb-4 text-[var(--text-muted)]">
          Think of a restaurant. Every part maps to a system design concept:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">🍽️ Restaurant</th>
                <th className="pb-3 font-medium">💻 System Design</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Front door / Host", "Load Balancer — directs customers to available tables"],
                ["Waiters", "Application Servers — take requests, deliver responses"],
                ["Kitchen", "Backend Services — process and prepare data"],
                ["Recipe book", "Database — stores data permanently"],
                ["Quick snack counter", "Cache — fast access to popular items"],
                ["Reservation list", "Message Queue — handles requests in order"],
                ["Multiple branches", "Replication — copies for reliability"],
              ].map(([r, s], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-3 pr-4 font-medium text-[var(--text)]">{r}</td>
                  <td className="py-3">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          If only 1 waiter handles 500 customers, the restaurant fails. System design is
          about <strong>planning for scale</strong> before things break.
        </Callout>
      </Section>

      {/* Architecture diagram */}
      <Section title="How Systems Are Structured">
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-6 font-mono text-xs leading-relaxed text-[var(--text-muted)] sm:text-sm">
          <pre>{`  👤 Users / Clients
       │
       ▼
  ⚖️  Load Balancer         → Distributes traffic evenly
       │
       ▼
  🖥️  Application Servers   → Run your business logic
       │
  ┌────┴────┐
  ▼         ▼
⚡ Cache   🗄️ Database       → Fast reads / Persistent storage
(Redis)    (PostgreSQL/
            Cassandra)
       │
       ▼
  📨 Message Queue           → Async processing (emails, notifications)
  (Kafka / RabbitMQ)
       │
       ▼
  🌐 CDN                     → Serve static content globally`}</pre>
        </div>
      </Section>

      {/* Next */}
      <LessonStatus slug="what-is-system-design" />
      <div className="flex justify-end pt-4">
        <Link
          href="/interview-framework"
          className="rounded-lg bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-dim)]"
        >
          Next: Interview Framework →
        </Link>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="space-y-3 text-[var(--text-muted)] leading-relaxed">{children}</div>
    </section>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-[var(--accent)] bg-[var(--accent)]/5 px-5 py-4 text-sm text-[var(--text)]">
      {children}
    </div>
  );
}

const buildingBlocks = [
  { icon: "⚖️", name: "Load Balancers", desc: "Distribute traffic across servers" },
  { icon: "⚡", name: "Caches", desc: "Speed up reads with in-memory data" },
  { icon: "🗄️", name: "Databases", desc: "Store data permanently (SQL & NoSQL)" },
  { icon: "📨", name: "Message Queues", desc: "Handle async processing" },
  { icon: "🌐", name: "CDNs", desc: "Serve content close to users globally" },
  { icon: "🔀", name: "Sharding", desc: "Split data across multiple machines" },
  { icon: "📋", name: "Replication", desc: "Copy data for reliability & speed" },
  { icon: "🔐", name: "Rate Limiters", desc: "Protect against abuse & overload" },
];
