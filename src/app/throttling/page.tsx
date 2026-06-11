import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Throttling & Rate Limiting | SysDesign Course" };

export default function ThrottlingPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Throttling & Rate Limiting</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The defensive mechanism that keeps systems alive under pressure — from DDoS attacks to viral traffic spikes to runaway costs.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is Throttling?">
        <p>
          Throttling controls the <strong>rate</strong> at which requests reach a target system,
          ensuring it isn&apos;t overwhelmed. A <strong>rate limiter</strong> sits between source and
          target, enforcing the rules.
        </p>
        <Callout>
          Throttling is fundamentally a <strong>defensive measure</strong> — protecting your system
          from going down due to excessive load, whether from attackers, viral traffic, or your own
          internal systems.
        </Callout>
      </Section>

      {/* 2 */}
      <Section num={2} title="The Three Strategies">
        <p>When too many requests come in, the rate limiter can do one of three things:</p>
        <div className="space-y-3">
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-sm font-semibold text-blue-400">1. Slow Down (Buffer)</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Buffer incoming requests and drip them to the target at an acceptable rate.
              Acts as a shock absorber. Example: Message queues (Kafka, SQS, RabbitMQ).
            </p>
            <p className="mt-1 text-xs text-blue-400/70">Best for: Async workloads where requests can wait.</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-semibold text-red-400">2. Reject</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Exceed capacity? Reject the surplus with an explicit error (HTTP 429 — Too Many Requests).
              No buffering — extras are dropped and clients are told.
            </p>
            <p className="mt-1 text-xs text-red-400/70">Best for: Synchronous APIs where clients need to know to retry.</p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm font-semibold text-yellow-400">3. Ignore (Silent Drop)</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Drop the request but return a fake 200 OK. The client thinks it succeeded.
              Used against attackers — if you return 429, they know the attack works and refine it.
            </p>
            <p className="mt-1 text-xs text-yellow-400/70">Best for: Fooling attackers who adapt based on error responses.</p>
          </div>
        </div>
      </Section>

      {/* 3 */}
      <Section num={3} title="Why We Need Throttling">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Prevent System Abuse", desc: "One rogue user could flood your API and bring down the service for everyone." },
            { title: "Handle Only What You Can", desc: "Celebrity tweets about your site → 1000x traffic. Sacrifice some users to keep running for others." },
            { title: "Control Costs", desc: "Each request = compute + memory + bandwidth. Without limits on expensive operations (ML inference, vendor APIs), bills explode." },
            { title: "Prevent Cascading Failures", desc: "One overwhelmed DB → app server fails → gateway fails → total outage. Throttling stops the chain reaction at the source." },
          ].map((r, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{r.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{r.desc}</p>
            </div>
          ))}
        </div>
        <Callout>
          <strong>Cascading failures</strong> are the #1 reason for total outages in distributed systems.
          Throttling at the source is the most effective prevention.
        </Callout>
      </Section>

      {/* 4 */}
      <Section num={4} title="Five Real Use Cases">
        <h3 className="text-base font-semibold text-blue-400">External Rate Limiters (public-facing)</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">1. Prevent DDoS Attacks</p>
            <CodeBlock>{`[Attacker] ──► [Rate Limiter] ──┐ DROP excess
[Users]    ──►                  └── Allow legit ──► [API Server]

Rules: Limit per-IP/sec, per-token, detect anomalous patterns.`}</CodeBlock>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">2. Gracefully Handle Viral Traffic</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              All users are real, but volume exceeds capacity. Let some through, drop others.
              <strong> Partial degradation &gt; total outage</strong>. Users see &quot;slow&quot; not &quot;down.&quot;
            </p>
          </div>
        </div>

        <h3 className="pt-4 text-base font-semibold text-green-400">Internal Rate Limiters (within your systems)</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">3. Multi-Tier Pricing / Quotas</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Free: 200 build-min/month. Basic ($5): 1000 min. Premium ($50): unlimited.
              Rate limiter checks quota in DB before allowing the operation.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">4. Protect Against Vendor Costs</p>
            <CodeBlock>{`[Worker] ──► [Internal Rate Limiter] ──► [Expensive Vendor API]
                    │                         ($5 per call)
                    └── Reject if budget exceeded`}</CodeBlock>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">5. Protect Unprotected Internal Systems</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Deleting 1M DB rows in one query = table locks → DB unresponsive. Instead: delete 1K rows/min
              via a rate limiter in front of the delete operation. Same pattern for any bulk operation.
            </p>
          </div>
        </div>

        <Tip>
          Internal rate limiting is what differentiates a thoughtful system from one that
          &quot;works until it doesn&apos;t.&quot; It&apos;s often more valuable than external throttling.
        </Tip>
      </Section>

      {/* 5 */}
      <Section num={5} title="Throttling Algorithms">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Algorithm</th>
                <th className="pb-3 pr-3 font-medium">How It Works</th>
                <th className="pb-3 font-medium">Best For</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {algorithms.map((a, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--accent)]">{a.name}</td>
                  <td className="py-2 pr-3">{a.how}</td>
                  <td className="py-2">{a.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="pt-4 text-base font-semibold">Deep Dive: The Key Algorithms</h3>

        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Token Bucket</p>
            <CodeBlock>{`Bucket holds tokens (max = burst size)
Tokens refill at fixed rate (e.g., 10/sec)
Each request consumes 1 token
No tokens left → request rejected

Allows bursts up to bucket size, then smooths to refill rate.
Used by: AWS API Gateway, Stripe`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Fixed Window</p>
            <CodeBlock>{`Count requests in fixed time windows (e.g., per minute)
Window 03:00-03:01 → allow 100 requests
Window 03:01-03:02 → counter resets

Problem: boundary burst — 100 requests at 03:00:59
         + 100 requests at 03:01:00 = 200 in 2 seconds!`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Sliding Window</p>
            <CodeBlock>{`Track exact timestamp of each request
Window slides with current time (not fixed boundaries)
Count = requests in [now - 1min, now]

Solves the boundary burst problem.
Tradeoff: more memory (store each timestamp).

Optimization: Sliding Window Counter (hybrid)
  - Keep counts per sub-window (e.g., per second)
  - Weighted sum approximates the sliding window
  - Uses 86% less memory than pure sliding window`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* 6 */}
      <Section num={6} title="Throttling Types (from the Grokking book)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 font-medium">Behavior</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Hard Throttling", "Requests CANNOT exceed the limit. Period."],
                ["Soft Throttling", "Can exceed by a configured percentage (e.g., limit 100 + 10% = allows up to 110)."],
                ["Elastic / Dynamic", "Exceeds allowed IF system has spare resources. Adapts to current capacity."],
              ].map(([type, behavior], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--accent)]">{type}</td>
                  <td className="py-2">{behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 7 */}
      <Section num={7} title="Rate Limiting: By IP or By User?">
        <p>The Grokking book discusses this tradeoff:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Approach</th>
                <th className="pb-3 pr-3 font-medium">Pros</th>
                <th className="pb-3 font-medium">Cons</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">By IP</td>
                <td className="py-2 pr-3">Simple, works without auth</td>
                <td className="py-2">Shared IPs (offices, cafes) cause collateral damage. IPv6 makes it trivial to get new IPs.</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">By User</td>
                <td className="py-2 pr-3">Precise, fair per-user limits</td>
                <td className="py-2">Requires auth. Can&apos;t limit login endpoint itself. Attacker can lock out real users.</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">Hybrid ✅</td>
                <td className="py-2 pr-3">Best coverage — both per-IP AND per-user</td>
                <td className="py-2">More cache entries, more memory. Worth it for production systems.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title="Architecture — Where Rate Limiters Live">
        <CodeBlock>{`                          ┌─────────────────┐
[Clients] ──► [External Rate Limiter] ─┤  API Server     │
                          └────────┬────────┘
                                   │
                    ┌──────────────────────────┐
                    │  Internal Rate Limiter   │
                    │  (quotas, pricing tiers) │
                    └──────────────────────────┘
                                   │
                            ┌──────┴──────┐
                            │   Workers   │
                            └──────┬──────┘
                                   │
                    ┌──────────────────────────┐
                    │  Internal Rate Limiter   │
                    │  (vendor cost control)   │
                    └──────────────────────────┘
                                   │
                          ┌────────┴────────┐
                          │ Expensive APIs  │
                          │ Database bulk   │
                          └─────────────────┘

Rate limiters appear at MULTIPLE layers,
each protecting different concerns.`}</CodeBlock>
      </Section>

      {/* 9 */}
      <Section num={9} title="Implementation: Distributed Rate Limiting">
        <p>At scale, rate limiters need distributed storage (not in-memory on one server):</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Approach</th>
                <th className="pb-3 font-medium">How</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Redis / Memcached", "Centralized counters. All API servers read/write to shared Redis. Fast, atomic operations."],
                ["Write-back cache", "Update counters in cache only; flush to persistent storage at intervals. Minimum latency added."],
                ["Consistent Hashing", "Distribute rate limit data across multiple Redis instances for fault tolerance."],
              ].map(([approach, how], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{approach}</td>
                  <td className="py-2">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          The Grokking book estimates: 1M users × 12 bytes each = <strong>32MB</strong> to track all
          active rate limits. Easily fits in one Redis instance. Add 4 bytes for locks = 36MB total.
        </Tip>
      </Section>

      {/* 10 */}
      <Section num={10} title="Interview Questions">
        <div className="space-y-3">
          {interviewQs.map((q, i) => (
            <details key={i} className="group rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:text-[var(--accent)]">
                Q: {q.question}
              </summary>
              <div className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)] leading-relaxed">
                {q.answer}
              </div>
            </details>
          ))}
        </div>
      </Section>

      <LessonStatus slug="throttling" />
      <div className="flex justify-between pt-4">
        <Link href="/api-gateway" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">← API Gateways</Link>
        <Link href="/" className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-dim)]">Back to Home</Link>
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

const algorithms = [
  { name: "Token Bucket", how: "Tokens refill at fixed rate; each request consumes one. Bucket has max capacity.", best: "Bursty traffic with smoothing" },
  { name: "Leaky Bucket", how: "Requests queue up; processed at constant rate regardless of input rate.", best: "Smooth, predictable output" },
  { name: "Fixed Window", how: "Count requests in fixed time windows (e.g., per minute). Resets at boundary.", best: "Simple, low memory" },
  { name: "Sliding Window Log", how: "Track exact timestamp of each request. Window slides with current time.", best: "Precise, no boundary burst" },
  { name: "Sliding Window Counter", how: "Hybrid: keep counts per sub-window, weighted sum approximates sliding.", best: "Balance of accuracy + efficiency" },
];

const interviewQs = [
  { question: "Design a rate limiter for a distributed system.", answer: "Use Redis as centralized counter store. Each request: INCR key (userID+window) atomically. If count > limit → reject (429). Key expires after window duration. For sliding window: use Redis sorted sets with timestamps. Shard across Redis instances via consistent hashing for scale." },
  { question: "Fixed window vs sliding window — what's the tradeoff?", answer: "Fixed window: simple (one counter per window), low memory, but allows boundary bursts (2x traffic at window edges). Sliding window: no boundary burst (tracks exact timestamps), but requires more memory. Sliding window counter is the practical compromise — 86% less memory than pure sliding, still avoids boundary bursts." },
  { question: "Where should the rate limiter sit?", answer: "Multiple layers: 1) API Gateway (per-user, per-key limits for external traffic). 2) Between services (protect downstream from chatty upstream). 3) Before expensive operations (vendor APIs, heavy DB queries). Each protects a different concern." },
  { question: "What happens when the rate limiter itself goes down?", answer: "Two strategies: 1) Fail-open — allow all traffic (risky but keeps service running). 2) Fail-closed — block all traffic (safe but causes outage). Most production systems fail-open with alerting, then fix the limiter. Use Redis replicas for HA." },
  { question: "How does rate limiting relate to the api_dev_key in system design APIs?", answer: "Every API in Grokking uses api_dev_key. The key identifies the caller and maps to a quota (e.g., free tier: 100 req/hour, paid: 10K/hour). Rate limiter checks: key → lookup quota → compare with current usage → allow or reject with 429." },
  { question: "Why return 200 OK instead of 429 for some requests?", answer: "Against attackers: returning 429 confirms the attack is working and lets them refine it. Returning 200 OK while silently dropping the request fools the attacker into thinking they're succeeding. Used for DDoS mitigation and anti-scraping." },
];
