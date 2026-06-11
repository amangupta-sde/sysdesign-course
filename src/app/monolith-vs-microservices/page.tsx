import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Monolith vs Microservices | SysDesign Course" };

export default function MonolithPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Monolith vs Microservices</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The most debated architecture decision — when each shines, when each fails, and what interviewers want to hear.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="Common Misconceptions">
        <div className="space-y-3">
          {[
            { myth: "A monolith is one giant machine running everything", truth: "A monolith can run multiple instances behind a load balancer. The defining trait is one codebase running as one application, not one machine." },
            { myth: "Microservices are tiny services everywhere", truth: "Nothing is necessarily 'micro'. A microservice is a single business unit with its own data. You might have only 3 if your business has 3 domains." },
            { myth: "Clients talk directly to microservices", truth: "Most architectures put a gateway in front. Clients → Gateway → appropriate microservice. Services have their own dedicated databases." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-medium text-red-400">❌ &quot;{m.myth}&quot;</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">✅ {m.truth}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 2 */}
      <Section num={2} title="What a Monolith Really Looks Like">
        <CodeBlock>{`            [Clients]
                │
                ▼
    ┌──────────────────────┐
    │    Load Balancer     │
    └──────────────────────┘
         │       │       │
         ▼       ▼       ▼
       ┌────┐ ┌────┐ ┌────┐
       │App │ │App │ │App │   ← Same codebase, multiple instances
       │    │ │    │ │    │     (auth + billing + chat + profiles)
       └────┘ └────┘ └────┘
                │
                ▼
         ┌─────────────┐
         │  Database   │      ← Usually one shared DB
         └─────────────┘`}</CodeBlock>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>One codebase containing all features</li>
          <li>Multiple instances for horizontal scaling</li>
          <li>Usually one shared database</li>
          <li>All function calls are <strong>in-process</strong> (fast)</li>
        </ul>
      </Section>

      {/* 3 */}
      <Section num={3} title="What Microservices Really Look Like">
        <CodeBlock>{`            [Clients]
                │
                ▼
         ┌──────────────┐
         │   Gateway    │
         └──────────────┘
         │      │      │
    ┌────┘      │      └────┐
    ▼           ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│Profile │ │  Chat  │ │Analytics│
│Service │ │Service │ │ Service │
└────────┘ └────────┘ └────────┘
    │          │           │
    ▼          ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐
│  DB 1  │ │  DB 2  │ │  DB 3  │   ← Each service owns its data
└────────┘ └────────┘ └────────┘`}</CodeBlock>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Each service owns one <strong>business domain</strong></li>
          <li>Each has its <strong>own database</strong></li>
          <li>Services communicate over the <strong>network</strong> (REST or gRPC)</li>
          <li>A gateway fronts all services for clients</li>
        </ul>
      </Section>

      {/* 4 */}
      <Section num={4} title="Monolith — Advantages & Disadvantages">
        <h3 className="text-base font-semibold text-green-400">✅ Advantages</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Great for small teams", "Less coordination — everyone in the same codebase"],
                ["Fewer moving parts", "One deployment, one pipeline, one environment"],
                ["Less code duplication", "Utilities, DB connections, test setup written once"],
                ["Faster execution", "All calls are in-process — no network, no serialization"],
                ["Simpler deployment", "One artifact, one build, easy to reason about"],
              ].map(([adv, why], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{adv}</td>
                  <td className="py-2">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="pt-4 text-base font-semibold text-red-400">❌ Disadvantages</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="text-[var(--text-muted)]">
              {[
                ["High onboarding cost", "New devs must understand the entire system first"],
                ["Risky deployments", "Any change → redeploy the whole app"],
                ["Testing is hard", "Everything coupled → hard to test in isolation"],
                ["Single point of failure", "One bug can crash the whole system"],
                ["Can't scale parts", "Must scale the entire app, not just the hot path"],
              ].map(([dis, impact], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{dis}</td>
                  <td className="py-2">{impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 5 */}
      <Section num={5} title="Microservices — Advantages & Disadvantages">
        <h3 className="text-base font-semibold text-green-400">✅ Advantages</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Scale specific parts", "Chat under load? Scale ONLY the chat service"],
                ["Easier onboarding", "New devs learn just their service's domain"],
                ["Parallel development", "Teams work independently — no blocking"],
                ["Fault isolation", "Analytics crashes? Chat keeps working"],
                ["Technology flexibility", "Each service can use the best tool for its job"],
                ["Targeted resources", "Know exactly which service needs more CPU/RAM"],
              ].map(([adv, why], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{adv}</td>
                  <td className="py-2">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="pt-4 text-base font-semibold text-red-400">❌ Disadvantages</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Hard to design correctly", "Bad boundaries → chatty inter-service calls, coupling"],
                ["Network overhead", "Every call between services goes over the network"],
                ["Operational complexity", "Many services to deploy, monitor, secure, version"],
                ["Distributed system problems", "Partial failures, eventual consistency, tracing"],
                ["Requires DevOps culture", "CI/CD, observability, service discovery needed"],
              ].map(([dis, impact], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{dis}</td>
                  <td className="py-2">{impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout>
          <strong>Red Flag — Bad Service Boundaries:</strong> If Service A only ever talks to
          Service B, they should probably be one service. You&apos;ve added network overhead with no benefit.
        </Callout>
      </Section>

      {/* 6 */}
      <Section num={6} title="Direct Comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Aspect</th>
                <th className="pb-3 pr-3 font-medium">Monolith</th>
                <th className="pb-3 font-medium">Microservices</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Codebase", "Single, unified", "Multiple, separate"],
                ["Deployment", "One artifact", "Many artifacts"],
                ["Inter-component calls", "Function calls (in-process)", "Network calls (RPC/REST)"],
                ["Performance", "Faster (no network)", "Slower (network overhead)"],
                ["Scaling", "Whole app together", "Each service independently"],
                ["Fault isolation", "Poor — one bug crashes all", "Good — failures contained"],
                ["Onboarding", "High (learn everything)", "Lower (learn one service)"],
                ["Team coordination", "Tight coupling needed", "Independent teams"],
                ["Operational burden", "Low", "High"],
                ["Best for", "Small teams, simple domains", "Large orgs, complex domains"],
              ].map(([aspect, mono, micro], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{aspect}</td>
                  <td className="py-2 pr-3">{mono}</td>
                  <td className="py-2">{micro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 7 */}
      <Section num={7} title="When to Choose What">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-blue-400">🏠 Choose Monolith</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Small, cohesive team</li>
              <li>Early-stage startup — speed &gt; scale</li>
              <li>Simple domain</li>
              <li>No DevOps expertise for distributed systems</li>
              <li>Performance matters more than flexibility</li>
              <li>Fast iteration without operational overhead</li>
            </ul>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-purple-400">🌐 Choose Microservices</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Large org with multiple independent teams</li>
              <li>Complex domain with clear bounded contexts</li>
              <li>Need to scale parts independently</li>
              <li>Strong DevOps/SRE practices</li>
              <li>Different parts have different resource needs</li>
              <li>Can tolerate operational complexity</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title='The "Monolith First" Pattern'>
        <p>It&apos;s not a binary choice. The smartest approach:</p>
        <CodeBlock>{`1. Start with a monolith
   → Speed and simplicity first

2. Pain points emerge
   → Scaling, team boundaries, deployment frequency

3. Identify the biggest pain
   → Which part is the bottleneck?

4. Carve out a microservice to solve THAT pain
   → Not everything — just the problem area

5. Repeat as needed
   → Gradual, evidence-driven decomposition`}</CodeBlock>
        <Tip>
          This is the &quot;monolith first&quot; approach (Martin Fowler). You only break into
          microservices when you have <em>clear evidence</em> that the monolith is the bottleneck.
          Premature microservices are a top cause of startup failure.
        </Tip>
      </Section>

      {/* 9 */}
      <Section num={9} title="How This Connects to System Design Interviews">
        <p>
          In the Grokking book, every large-scale design uses a microservice-like architecture:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li><strong>Twitter:</strong> Separate services for tweet storage, timeline generation, search, notifications</li>
          <li><strong>Instagram:</strong> Photo upload service, news feed service, notification service</li>
          <li><strong>Facebook Messenger:</strong> Chat server, notification server, presence service</li>
          <li><strong>Uber:</strong> Location service (QuadTree), matching service, notification service</li>
          <li><strong>YouTube:</strong> Upload service, encoding service, streaming service, metadata service</li>
        </ul>

        <Callout>
          <strong>Interview default:</strong> For large-scale systems (which 90% of interviews are),
          default to microservices. But always justify why: &quot;We split chat and analytics because
          they have different scaling needs and the teams can work independently.&quot;
        </Callout>
      </Section>

      {/* 10 */}
      <Section num={10} title="Real-World Examples">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Architecture</th>
                <th className="pb-3 font-medium text-[var(--text-muted)]">Note</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Stack Overflow", "Monolith", "Famously successful — proves monoliths scale"],
                ["Shopify", "Modular monolith", "Monolith with clear internal boundaries"],
                ["Basecamp", "Monolith", "By choice — simplicity over complexity"],
                ["Netflix", "Microservices", "Early adopter, hundreds of services"],
                ["Amazon", "Microservices", "Since 2002, two-pizza teams"],
                ["Uber", "Microservices", "Then re-consolidated some (over-split)"],
                ["Google", "Microservices", "Thousands of services"],
              ].map(([company, arch, note], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{company}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{arch}</td>
                  <td className="py-2 text-xs">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 11 */}
      <Section num={11} title="Interview Talking Points">
        <div className="space-y-3">
          {[
            { q: "Why microservices for this design?", a: "Independent scaling (chat service scales differently than profile service), fault isolation (one crash doesn't take everything down), parallel team development, and each service can optimize its own data store." },
            { q: "Why not microservices?", a: "For early-stage products or simple domains: adds operational complexity (deployment, monitoring, distributed tracing), network overhead between services, and requires strong DevOps culture." },
            { q: "How do you decide service boundaries?", a: "Follow business domains (Domain-Driven Design). Each service should be independently deployable, own its data, and have a clear API contract. Red flag: if two services always change together, they should be one." },
            { q: "How do microservices communicate?", a: "Synchronous: REST or gRPC for real-time requests. Asynchronous: message queues (Kafka, RabbitMQ) for event-driven communication. Use async when you don't need an immediate response." },
          ].map((item, i) => (
            <details key={i} className="group rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:text-[var(--accent)]">
                Q: {item.q}
              </summary>
              <div className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* Status + Nav */}
      <LessonStatus slug="monolith-vs-microservices" />
      <div className="flex justify-between pt-4">
        <Link href="/rest-apis" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">
          ← REST APIs
        </Link>
        <Link href="/" className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-dim)]">
          Back to Home
        </Link>
      </div>
    </article>
  );
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3 text-xl font-bold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">{num}</span>
        {title}
      </h2>
      <div className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">{children}</div>
    </section>
  );
}
function Callout({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border-l-4 border-[var(--accent)] bg-[var(--accent)]/5 px-5 py-4 text-sm text-[var(--text)]">{children}</div>;
}
function Tip({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-200/80">💡 <strong>Pro tip:</strong> {children}</div>;
}
function CodeBlock({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[#0d0d14] p-4 font-mono text-xs leading-relaxed text-[var(--text-muted)]"><pre>{children}</pre></div>;
}
