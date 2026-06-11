import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Data Partitioning & Sharding | SysDesign Course" };

export default function DataPartitioningPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Data Partitioning & Sharding</h1>
        <p className="text-lg text-[var(--text-muted)]">
          How to split billions of rows across machines so your database doesn&apos;t collapse — the most critical scaling technique in system design.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="Shard vs Partition — The Key Distinction">
        <p>People use these terms interchangeably, but they operate at different levels:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Concept</th>
                <th className="pb-3 pr-4 font-medium">Operates At</th>
                <th className="pb-3 font-medium">What It Is</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">Shard</td>
                <td className="py-2 pr-4">Server level (physical)</td>
                <td className="py-2">A separate DB server holding a slice of data</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">Partition</td>
                <td className="py-2 pr-4">Data level (logical)</td>
                <td className="py-2">Mutually exclusive subsets of data — no overlap</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout>
          <strong>Always partition first, then decide how to distribute partitions across shards.</strong><br />
          100GB dataset → split into 5 partitions (30/10/30/20/10 GB) → place partitions A,C on Shard 1
          and B,D,E on Shard 2. If partition B gets hot, move it to Shard 1. Logical partitioning gives
          the superpower of easy redistribution.
        </Callout>
      </Section>

      {/* 1b */}
      <Section num={2} title="How a Database Scales (Evolution)">
        <p>A database is just an EC2 server with MySQL installed, exposing port 3306. Here&apos;s how it evolves:</p>
        <CodeBlock>{`Stage 1 — Day Zero (single server)
  One DB, one process, local disk. ~100 writes/sec. Cheap.

Stage 2 — Vertical Scaling
  Traffic grows → add more CPU, RAM, disk to same server.
  DB process unchanged; only host capacity increases.

Stage 3 — Read Replica
  Reads grow heavy → add a follower (master-slave):
  All writes → master. All reads → replica.
  Master replicates data continuously.

Stage 4 — More Vertical Scaling
  Bigger instance → ~1000 writes/sec.
  Eventually hits hardware limits. Vertical is CAPPED.

Stage 5 — Horizontal Scaling (SHARDING)
  Add another DB server. Split data 50/50.
  Each shard handles ~750 writes/sec → total 1500/sec.
  Achieves throughput no single machine ever could.`}</CodeBlock>
        <Tip>
          Vertical scaling is easy but capped. Horizontal scaling (sharding) is required at scale.
          This is why every large system design in interviews involves sharding.
        </Tip>
      </Section>

      {/* 1c */}
      <Section num={3} title="The 2×2 Matrix">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Sharded?</th>
                <th className="pb-3 pr-3 font-medium">Partitioned?</th>
                <th className="pb-3 font-medium">What It Looks Like</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["No", "No", "Day-zero setup — single DB server, single dataset"],
                ["No", "Yes", "Multiple logical DBs on one MySQL server (e.g., airline_check_in + ticket_booking)"],
                ["Yes", "No", "Read replica — same data copied to another server"],
                ["Yes", "Yes", "Data split across multiple servers — handles heavy reads AND writes"],
              ].map(([s, p, looks], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{s}</td>
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{p}</td>
                  <td className="py-2">{looks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12 */}
      <Section num={4} title="Partitioning Methods">
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-blue-400">a. Horizontal Partitioning (Sharding)</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Divide <strong>rows</strong> across servers. Each shard has all columns but a subset of rows.
            </p>
            <CodeBlock>{`Table: Users (1 billion rows)

Shard 1: Users in USA       (rows 1-250M)
Shard 2: Users in Europe    (rows 250M-500M)
Shard 3: Users in Asia      (rows 500M-750M)
Shard 4: Users in Rest      (rows 750M-1B)

Each shard = same schema, different rows.`}</CodeBlock>
            <p className="mt-2 text-xs text-red-400">
              ⚠️ Problem: If partition key chosen poorly (e.g., geo but most users are in USA) → unbalanced shards.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-purple-400">b. Vertical Partitioning</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Divide <strong>columns</strong> across servers. Each shard has all rows but a subset of columns.
            </p>
            <CodeBlock>{`Table: Customers

Shard 1: name, email, address    (personal info)
Shard 2: order_history, payments (transactional)
Shard 3: profile_photo, bio     (media/heavy data)

Access patterns determine the split:
- Profile page → Shard 1
- Order history → Shard 2
- Rarely-accessed media → Shard 3 (cheaper storage)`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-green-400">c. Hybrid Partitioning</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Combine both: shard rows by geography, then split columns by access pattern within each shard.
              Used by large-scale systems with both geographic and functional separation needs.
            </p>
          </div>
        </div>
      </Section>

      {/* 11 */}
      <Section num={5} title="Sharding Techniques">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Technique</th>
                <th className="pb-3 pr-3 font-medium">How It Works</th>
                <th className="pb-3 pr-3 font-medium">Example</th>
                <th className="pb-3 font-medium">Tradeoff</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {shardingTechniques.map((t, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--accent)]">{t.name}</td>
                  <td className="py-2 pr-3">{t.how}</td>
                  <td className="py-2 pr-3">{t.example}</td>
                  <td className="py-2">{t.tradeoff}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 12 */}
      <Section num={6} title="Deep Dive: The Three Core Strategies">
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Range-Based Sharding</p>
            <CodeBlock>{`URLs starting with 'A' → Server 1
URLs starting with 'B' → Server 2
...

✅ Simple, predictable lookups
❌ Hot letters (e.g., 'S' for social media URLs) → skew
❌ Some servers overloaded, others idle`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Hash-Based Sharding</p>
            <CodeBlock>{`shard = hash(user_id) % num_shards

✅ Even distribution (hash is random)
❌ Adding/removing shards → rehash everything
❌ Solution: use Consistent Hashing (previous lesson)`}</CodeBlock>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--accent)]">Directory-Based Sharding</p>
            <CodeBlock>{`Lookup table: user_id → shard_id

user_123 → Shard 3
user_456 → Shard 1
user_789 → Shard 7

✅ Maximum flexibility — move users between shards easily
❌ Lookup table is a single point of failure
❌ Extra hop for every query (consult directory first)`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* 11 */}
      <Section num={7} title="How Sharding Appears in Grokking Designs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Problem</th>
                <th className="pb-3 pr-4 font-medium">Sharding Strategy</th>
                <th className="pb-3 font-medium text-[var(--text-muted)]">Why</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["URL Shortener", "Hash-based on short key", "Even distribution, simple lookup by key"],
                ["Instagram", "By PhotoID (not UserID)", "Avoids hot-user problem, uniform distribution"],
                ["Twitter", "TweetID = epoch + sequence", "Time-based ordering + hash-based distribution"],
                ["Facebook Messenger", "By UserID", "All user's messages on one shard for fast range queries"],
                ["YouTube", "By VideoID", "Avoids hot-user problem (popular creators)"],
                ["Yelp / Uber", "By LocationID (or region)", "Queries are geographic — co-locate nearby data"],
                ["Ticketmaster", "By ShowID", "All seats for a show on one shard (consistency for bookings)"],
              ].map(([problem, strategy, why], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{problem}</td>
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{strategy}</td>
                  <td className="py-2 text-xs">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          The book&apos;s pattern: shard by the entity you query most (PhotoID, TweetID, UserID).
          Never shard by UserID if users have wildly uneven data — use the content&apos;s own ID instead.
        </Tip>
      </Section>

      {/* 12 */}
      <Section num={8} title="Benefits of Data Partitioning">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Query Performance", desc: "Queries target specific shards — scan less data, faster results." },
            { title: "Scalability", desc: "Add new shards as data grows. No single-machine bottleneck." },
            { title: "Load Balancing", desc: "Workload distributed evenly. No single node overwhelmed." },
            { title: "Fault Isolation", desc: "One shard fails → other shards unaffected. Partial availability." },
            { title: "Parallel Processing", desc: "Multiple shards processed simultaneously by different servers." },
            { title: "Storage Efficiency", desc: "Hot data on fast SSDs, cold data on cheap HDDs. Per-shard optimization." },
            { title: "Faster Recovery", desc: "Restore one shard instead of entire DB. Reduced downtime." },
            { title: "Data Security", desc: "Sensitive columns in separate partition with stricter access controls." },
          ].map((b, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3">
              <p className="text-sm font-medium text-[var(--text)]">{b.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 11 */}
      <Section num={9} title="Common Problems">
        <div className="space-y-3">
          {[
            { title: "Data Skew", desc: "Uneven distribution — one shard gets 80% of traffic. Cause: poor partition key choice. Fix: consistent hashing with virtual nodes, or re-partition.", color: "red" },
            { title: "Cross-Partition Queries", desc: "Query needs data from multiple shards → scatter-gather → higher latency. Fix: denormalize, or choose partition key aligned with query patterns.", color: "red" },
            { title: "Joins Across Shards", desc: "Can't JOIN tables on different servers efficiently. Fix: denormalize data, or use application-level joins.", color: "red" },
            { title: "Partition Key Selection", desc: "Wrong key = all problems above. Must understand access patterns deeply before choosing.", color: "yellow" },
            { title: "Rebalancing / Migration", desc: "Adding shards means moving data. Time-consuming, risky. Consistent hashing minimizes this.", color: "yellow" },
            { title: "Operational Complexity", desc: "Backups, monitoring, patching across all shards. More machines = more things to manage.", color: "yellow" },
          ].map((p, i) => (
            <div key={i} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`text-sm font-semibold text-${p.color}-400`}>{p.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 12 */}
      <Section num={10} title="Choosing a Partition Key — Decision Framework">
        <CodeBlock>{`Ask yourself:

1. What's my most common query?
   → Partition by the field in that query's WHERE clause.

2. Will this distribute data evenly?
   → If not, use hash of that field (or consistent hashing).

3. Do I need range queries on this field?
   → Range-based sharding preserves order (good for time-series).
   → Hash-based destroys order (bad for "get all tweets from last hour").

4. Will one entity get disproportionate traffic?
   → Don't shard by UserID if celebrity users exist.
   → Shard by content ID (TweetID, PhotoID) instead.

5. Do I need cross-shard queries often?
   → If yes, maybe your shard key is wrong.
   → Or denormalize to avoid cross-shard joins.`}</CodeBlock>
      </Section>

      {/* 11 */}
      <Section num={11} title="Planning for Growth (from the books)">
        <p>The Grokking book recommends:</p>
        <Callout>
          Start with a <strong>large number of logical partitions</strong> mapped to fewer physical servers.
          As data grows, move logical partitions to new servers. Only update the config file that maps
          logical → physical. No data restructuring needed.
        </Callout>
        <CodeBlock>{`Initial:
  Logical partitions 1-100 → Physical Server A
  Logical partitions 101-200 → Physical Server B

After growth:
  Logical partitions 1-50 → Physical Server A
  Logical partitions 51-100 → Physical Server C  (new!)
  Logical partitions 101-200 → Physical Server B

Only the config/directory changed — no rehashing.`}</CodeBlock>
      </Section>

      {/* 12 */}
      <Section num={12} title="Interview Questions">
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

      <LessonStatus slug="data-partitioning" />
      <div className="flex justify-between pt-4">
        <Link href="/consistent-hashing" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">← Consistent Hashing</Link>
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

const shardingTechniques = [
  { name: "Range-based", how: "Divide by value ranges of partition key", example: "Orders by date: Jan shard, Feb shard...", tradeoff: "Simple but can skew if ranges are uneven" },
  { name: "Hash-based", how: "Hash the key → determines shard", example: "hash(user_id) % N → shard number", tradeoff: "Even distribution but loses ordering" },
  { name: "Directory-based", how: "Lookup table maps each key to a shard", example: "player_name → shard_id in a directory", tradeoff: "Flexible but directory is a SPOF" },
  { name: "Geographic", how: "Partition by physical location", example: "US users → US datacenter shard", tradeoff: "Low latency per region, complex for global queries" },
  { name: "Dynamic", how: "Auto-split/merge shards based on load", example: "IoT: more devices → more shards auto-created", tradeoff: "Self-healing but complex implementation" },
  { name: "Hybrid", how: "Combine multiple strategies", example: "Geo + hash within each region", tradeoff: "Best performance, highest complexity" },
];

const interviewQs = [
  { question: "Why partition by PhotoID instead of UserID for Instagram?", answer: "UserID partitioning causes hot spots — celebrity users have millions of photos, creating massive shards. PhotoID is uniformly distributed (random/sequential IDs), so shards are balanced. To find a user's photos: query all shards in parallel, merge results. The scatter-gather cost is acceptable vs. the skew problem." },
  { question: "Range-based vs hash-based — when to use each?", answer: "Range-based: when you need range queries (e.g., 'all orders from last month' — data is co-located by date). Hash-based: when you need even distribution and only do point lookups (e.g., 'get user by ID'). Hash destroys ordering; range preserves it." },
  { question: "How do you handle cross-shard queries?", answer: "1) Query all relevant shards in parallel, merge at application layer. 2) Denormalize — store redundant data so queries stay within one shard. 3) Choose partition key aligned with most common query patterns. 4) Use a scatter-gather service that fans out queries and aggregates results." },
  { question: "What's the relationship between sharding and consistent hashing?", answer: "Consistent hashing is a TECHNIQUE for implementing hash-based sharding that handles dynamic scaling gracefully. Instead of hash % N (which reshuffles everything when N changes), consistent hashing uses a ring where adding/removing nodes only affects ~1/N of data." },
  { question: "How to handle hot partitions?", answer: "1) Re-partition with a better key. 2) Add more replicas for the hot partition specifically. 3) Use consistent hashing with virtual nodes to spread hot-key traffic. 4) Add a cache layer in front of the hot partition. 5) Rate-limit queries to the hot shard." },
  { question: "How does the Grokking book plan for future growth?", answer: "Start with many logical partitions on few physical servers. As data grows, move logical partitions to new physical servers — just update the config/directory. No data restructuring. This is why directory-based or consistent hashing approaches are preferred for growing systems." },
];
