import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Consistent Hashing | SysDesign Course" };

export default function ConsistentHashingPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Consistent Hashing</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The algorithm that lets distributed systems scale without reshuffling everything — used by Cassandra, DynamoDB, Memcached, and CDNs.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="The Problem: Why Naive Hashing Breaks">
        <p>You have N servers. Each request gets a hash. Naive approach:</p>
        <CodeBlock>{`server = hash(request_id) mod N`}</CodeBlock>
        <p>With 4 servers, this distributes evenly. But what happens when you add a 5th?</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-3 font-medium">Request</th>
                <th className="pb-2 pr-3 font-medium">hash(R)</th>
                <th className="pb-2 pr-3 font-medium">mod 4</th>
                <th className="pb-2 pr-3 font-medium">mod 5</th>
                <th className="pb-2 font-medium text-red-400">Changed?</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["R1", "3", "S3", "S3", "No"],
                ["R2", "15", "S3", "S0", "YES"],
                ["R3", "12", "S0", "S2", "YES"],
                ["R4", "7", "S3", "S2", "YES"],
                ["R5", "22", "S2", "S2", "No"],
              ].map(([req, hash, old, newS, changed], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-1.5 pr-3 font-medium text-[var(--text)]">{req}</td>
                  <td className="py-1.5 pr-3 font-mono">{hash}</td>
                  <td className="py-1.5 pr-3">{old}</td>
                  <td className="py-1.5 pr-3">{newS}</td>
                  <td className={`py-1.5 ${changed === "YES" ? "text-red-400 font-medium" : "text-green-400"}`}>{changed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          Adding <strong>ONE server</strong> caused almost <strong>every mapping to change</strong>.
          N is baked into the formula — change N, reshuffle everything.
        </Callout>
      </Section>

      {/* 2 */}
      <Section num={2} title="Why This Is a Disaster">
        <p>In real systems, same user → same server → cached data (profile, session, etc.):</p>
        <CodeBlock>{`Before adding server:
  User U1 → always hits S3 → S3 has U1's cache → fast!

After adding server (N changes):
  U1 → now hits S0 → S0 has NO cache for U1
  EVERY server's cache becomes useless
  All users hit cold cache → DB hammered → latency explodes`}</CodeBlock>
        <p className="font-medium text-red-400 text-sm">
          This is why you can&apos;t just &quot;add a server&quot; to a high-scale system without consequences.
        </p>
      </Section>

      {/* 3 */}
      <Section num={3} title="What We Actually Want">
        <CodeBlock>{`Before (4 servers, 25% each):
[████ S0 ████][████ S1 ████][████ S2 ████][████ S3 ████]

IDEAL — adding S4 (only 20% disrupted):
Each existing server gives up 5% → new server gets 20%
Total remapping: ~20%

NAIVE MOD — adding S4 (nearly 100% disrupted):
Everything reshuffled. Total remapping: ~75-100%`}</CodeBlock>
        <Callout>
          We want to redistribute load evenly BUT with <strong>minimum disruption</strong> to
          existing mappings. This is exactly what consistent hashing achieves.
        </Callout>
      </Section>

      {/* 4 */}
      <Section num={4} title="The Hash Ring">
        <p>
          Instead of <Code>hash mod N</Code>, imagine a <strong>circular ring</strong> with positions 0 to M-1:
        </p>
        <CodeBlock>{`              0
         M-1  ●  1
       ●           ●
      ●      RING    ●
     ●                ●
      ●              ●
       ●           ●
         ●  ...  ●

Both SERVERS and REQUESTS are hashed onto this ring.`}</CodeBlock>
        <p className="font-medium text-[var(--text)]">The algorithm (3 steps):</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li><strong>Hash requests</strong> onto the ring (request ID → position)</li>
          <li><strong>Hash servers</strong> onto the same ring (server ID → position)</li>
          <li><strong>Assignment:</strong> Each request goes to the <strong>first server clockwise</strong> from its position</li>
        </ol>
        <Tip>
          That&apos;s the entire algorithm. Every request maps to its nearest clockwise server.
          Server count is NOT part of the formula — that&apos;s why it works.
        </Tip>
      </Section>

      {/* 5 */}
      <Section num={5} title="Adding a Server — Localized Change">
        <CodeBlock>{`Before (S1, S2, S3, S4 on ring):

      S1          S2
  ●───────────●───────────●
  │   arc A   │   arc B   │
  ●───────────●───────────●
      S4          S3

Add S5 between S3 and S4:

      S1          S2
  ●───────────●───────────●
  │   arc A   │   arc B   │
  ●──────●────●───────────●
     S4   S5      S3
           ↑
Only requests in this small arc move from S4 → S5.
ALL other servers: untouched. Their caches: still valid.`}</CodeBlock>
        <Callout>
          Adding a server only <strong>steals load from one neighbor</strong>. The rest stay put.
          Approximately <strong>1/N</strong> of requests remap — not 100%.
        </Callout>
      </Section>

      {/* 6 */}
      <Section num={6} title="Removing a Server — Same Localized Behavior">
        <CodeBlock>{`S1 crashes:
  → Only requests previously assigned to S1 are affected
  → They get reassigned to the next clockwise server
  → All other servers: untouched

Trade-off: Next server absorbs ALL of S1's load.
           (We fix this with virtual nodes — next section)`}</CodeBlock>
      </Section>

      {/* 7 */}
      <Section num={7} title="The Problem: Skewed Distribution">
        <p>With few servers, bad luck can cause uneven arcs:</p>
        <CodeBlock>{`Bad arrangement:
              S1
S2 ●          ●●●●●● S3 ●●● S4

Big empty arc → one server owns huge load.

And when S1 dies:
  S2 inherits ALL of S1's load
  S2 now handles ~50% of the cluster alone!`}</CodeBlock>
        <p>We need more points on the ring for smoother distribution.</p>
      </Section>

      {/* 8 */}
      <Section num={8} title="The Solution: Virtual Nodes">
        <p>
          The engineering insight that makes consistent hashing <strong>practical</strong>:
          don&apos;t hash each server to ONE point — hash it to MANY.
        </p>
        <CodeBlock>{`Physical server S1 → Virtual nodes: S1_0, S1_1, S1_2, ..., S1_K
Physical server S2 → Virtual nodes: S2_0, S2_1, S2_2, ..., S2_K

With K=3 and 4 servers:
  4 servers × 3 virtual nodes = 12 points on the ring
  Ring is much more densely populated
  Distribution is much smoother`}</CodeBlock>

        <h3 className="pt-2 text-base font-semibold">Why This Fixes Everything</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm font-semibold text-green-400">Even distribution</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              More points → Law of Large Numbers → smoother. With K=100, distribution is nearly perfect.
            </p>
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm font-semibold text-green-400">Even redistribution on failure</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              S1&apos;s K virtual nodes are scattered around the ring. When S1 dies, each has a DIFFERENT neighbor.
              Load spreads across multiple servers — not just one.
            </p>
          </div>
        </div>

        <CodeBlock>{`Without virtual nodes — S3 dies:
  [── S1 ──][── S2 ──][── S3 ──][── S4 ──]
  S3's load → ALL goes to S4 (huge skew!)

With virtual nodes — S3 dies:
  [S2|S4|S1|S3|S1|S4|S2|S3|S1|S4|S2|S3]
  S3's chunks spread across S1, S2, S4
  Each picks up a small, uniform share ✅`}</CodeBlock>

        <h3 className="pt-2 text-base font-semibold">How Many Virtual Nodes?</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-4 font-medium">K Value</th>
                <th className="pb-2 font-medium">Tradeoff</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50"><td className="py-2 pr-4 font-medium text-[var(--text)]">Low (3-10)</td><td className="py-2">Less memory, more skew risk</td></tr>
              <tr className="border-b border-[var(--border)]/50"><td className="py-2 pr-4 font-medium text-[var(--text)]">High (100-500)</td><td className="py-2">Smoother distribution, more memory for ring lookup</td></tr>
              <tr className="border-b border-[var(--border)]/50"><td className="py-2 pr-4 font-medium text-[var(--accent)]">Production typical</td><td className="py-2">100-500 per physical server</td></tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="Complete Comparison">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Aspect</th>
                <th className="pb-3 pr-3 font-medium text-red-400">Modulo Hashing</th>
                <th className="pb-3 font-medium text-green-400">Consistent Hashing</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Formula", "hash(R) mod N", "Nearest server clockwise on ring"],
                ["Add a server", "Re-maps ~all requests", "Re-maps only ~1/N of requests"],
                ["Remove a server", "Re-maps ~all requests", "Re-maps only ~1/N of requests"],
                ["Cache preservation", "Caches lose ~all value", "Caches mostly preserved"],
                ["Load distribution", "Even when stable", "Even (with virtual nodes)"],
                ["Complexity", "O(1) simple", "O(log N) ring lookup"],
                ["Use case", "Static server pools", "Dynamic, scalable systems"],
              ].map(([aspect, mod, consistent], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{aspect}</td>
                  <td className="py-2 pr-3">{mod}</td>
                  <td className="py-2">{consistent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 10 */}
      <Section num={10} title="Where It's Used (Real Systems)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">System</th>
                <th className="pb-3 font-medium">Use Case</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Cassandra", "Partitioning data across DB nodes"],
                ["DynamoDB", "Sharding keys across storage nodes"],
                ["Memcached", "Distributed caching across cache servers"],
                ["Redis Cluster", "Distributing keys across Redis nodes"],
                ["Riak", "Distributed key-value store"],
                ["CDNs", "Routing users to nearest edge servers"],
                ["Load Balancers", "Sticky session routing"],
                ["Discord", "Routing voice/chat sessions to nodes"],
              ].map(([sys, use], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{sys}</td>
                  <td className="py-2">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 11 */}
      <Section num={11} title="In System Design Interviews (from the books)">
        <p>Consistent hashing appears in nearly every Grokking design problem:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li><strong>URL Shortener:</strong> Hash-based partitioning of URLs → consistent hashing handles scaling</li>
          <li><strong>Instagram/Twitter:</strong> Data sharding across DB servers</li>
          <li><strong>Web Crawler:</strong> Distribution among crawling servers with fault tolerance</li>
          <li><strong>YouTube:</strong> Distribution among cache servers for video metadata</li>
          <li><strong>Rate Limiter:</strong> Sharding rate-limit data across Redis instances</li>
          <li><strong>Yelp/Uber:</strong> Distribution of QuadTree data across servers</li>
        </ul>
        <Callout>
          Whenever the book says &quot;this can be solved by using Consistent Hashing&quot; — it means:
          data is distributed on a ring with virtual nodes, so adding/removing nodes causes minimal disruption.
        </Callout>
      </Section>

      {/* 12 */}
      <Section num={12} title="The Mental Model">
        <CodeBlock>{`WITHOUT consistent hashing:        WITH consistent hashing:
──────────────────────────         ──────────────────────────

server = hash(req) mod N           1. Servers placed on ring (virtual nodes)
                                   2. Requests placed on same ring
ADD server →                       3. Each request → first server clockwise
  N changes → all remapped
  All caches die                   ADD server →
                                     Steals only its arc from neighbor
REMOVE server →                      Rest unaffected, caches preserved
  N changes → all remapped
  All caches die                   REMOVE server →
                                     Virtual nodes spread load across
                                     MANY neighbors (not just one)
                                     Most caches preserved`}</CodeBlock>
      </Section>

      {/* 13 */}
      <Section num={13} title="Interview Questions">
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

      <LessonStatus slug="consistent-hashing" />
      <div className="flex justify-between pt-4">
        <Link href="/throttling" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">← Throttling</Link>
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
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-xs text-[var(--accent)]">{children}</code>;
}
function CodeBlock({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[#0d0d14] p-4 font-mono text-xs leading-relaxed text-[var(--text-muted)]"><pre>{children}</pre></div>;
}

const interviewQs = [
  { question: "Why can't we just use hash mod N?", answer: "Because N (server count) is part of the formula. When you add/remove a server, N changes, and almost ALL request→server mappings change. This invalidates caches, overwhelms databases, and causes latency spikes. Consistent hashing removes N from the formula entirely." },
  { question: "What are virtual nodes and why do we need them?", answer: "Virtual nodes are multiple hash ring positions per physical server (typically 100-500). They solve two problems: 1) Uneven load distribution with few servers (more points = smoother). 2) When a server dies, its load is spread across MANY neighbors instead of one (prevents single-server overload)." },
  { question: "What's the time complexity of consistent hashing?", answer: "O(log N) for a lookup — binary search on the sorted ring positions to find the nearest clockwise server. With virtual nodes, the ring has K×N points total. Adding/removing a server: O(K log(K×N)) to insert/remove K virtual node positions." },
  { question: "How does Cassandra use consistent hashing?", answer: "Each Cassandra node is assigned token ranges on a ring. Data is partitioned by hashing the partition key → lands on the ring → assigned to the node owning that range. Replication: data also copied to the next R-1 nodes clockwise. Adding a node: takes over part of a neighbor's range with minimal data movement." },
  { question: "What happens to cached data when a node fails?", answer: "Only data assigned to the failed node is affected (~1/N of total). With virtual nodes, this data is redistributed across multiple remaining nodes (not dumped onto one). Other nodes' caches remain completely valid — unlike mod-N where everything invalidates." },
  { question: "When would you mention consistent hashing in an interview?", answer: "Whenever you need to: 1) Partition data across servers (sharding). 2) Distribute cache keys. 3) Route requests with sticky sessions. 4) Handle dynamic scaling (servers join/leave). Say: 'We'd use consistent hashing so adding capacity doesn't invalidate existing caches.'" },
];
