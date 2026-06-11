import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Interview Framework | SysDesign Course" };

export default function InterviewFramework() {
  return (
    <article className="space-y-12">
      {/* Header */}
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Module 2</p>
        <h1 className="text-3xl font-bold sm:text-4xl">The 7-Step Interview Framework</h1>
        <p className="text-lg text-[var(--text-muted)]">
          A repeatable structure to tackle any system design problem in 35-40 minutes.
        </p>
      </header>

      {/* Why */}
      <Callout>
        System design interviews are open-ended with no single correct answer. Without a
        framework, candidates ramble, miss critical sections, and run out of time. This
        structure keeps you on track and shows the interviewer you think systematically.
      </Callout>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Overview</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="px-4 py-3 font-medium">Step</th>
                <th className="px-4 py-3 font-medium">What You Do</th>
                <th className="px-4 py-3 font-medium text-[var(--text-muted)]">Time</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((s, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="px-4 py-3 font-mono text-[var(--accent)]">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Step 1 */}
      <Step num={1} title="Requirements Clarification" time="3-5 min">
        <p>
          Ask questions to narrow scope. Design questions are open-ended — the right answer
          depends entirely on what you&apos;re building for.
        </p>
        <p>Split requirements into three buckets:</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card title="Functional" color="blue">
            What should the system <em>do</em>?
            <br />
            &quot;Can users upload photos?&quot;
            <br />
            &quot;Do we need real-time search?&quot;
          </Card>
          <Card title="Non-Functional" color="purple">
            How <em>well</em> should it work?
            <br />
            &quot;What latency is OK?&quot;
            <br />
            &quot;Availability vs consistency?&quot;
          </Card>
          <Card title="Extended" color="green">
            Nice-to-haves
            <br />
            &quot;Analytics?&quot;
            <br />
            &quot;API access for 3rd parties?&quot;
          </Card>
        </div>
        <ExampleBox title="Example: Designing Twitter">
          <ul className="list-disc space-y-1 pl-4">
            <li>Will users post tweets AND follow people?</li>
            <li>Should we design the timeline/feed?</li>
            <li>Will tweets contain photos and videos?</li>
            <li>Backend only or frontend too?</li>
            <li>Do we need search? Push notifications?</li>
            <li>Trending topics?</li>
          </ul>
        </ExampleBox>
        <Tip>
          Spend 3 minutes here minimum. Candidates who rush past requirements almost always
          design the wrong system.
        </Tip>
      </Step>

      {/* Step 2 */}
      <Step num={2} title="System Interface Definition (APIs)" time="2-3 min">
        <p>
          Define the exact APIs your system exposes. This is the &quot;contract&quot; — it
          confirms you understood the requirements and forces precision.
        </p>
        <CodeBlock>{`postTweet(user_id, tweet_data, tweet_location, timestamp, media_ids[])
→ Returns: tweet_id or error

generateTimeline(user_id, current_time, page_token, count=20)
→ Returns: list of tweet objects

markFavorite(user_id, tweet_id, timestamp)
→ Returns: success / failure`}</CodeBlock>
        <p>Key things to mention:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li><code className="text-[var(--accent)]">api_dev_key</code> — for authentication and rate limiting</li>
          <li>Pagination params (<code className="text-[var(--accent)]">page_token</code>, <code className="text-[var(--accent)]">count</code>) for list endpoints</li>
          <li>What errors look like (HTTP status codes)</li>
        </ul>
      </Step>

      {/* Step 3 */}
      <Step num={3} title="Back-of-Envelope Estimation" time="3-5 min">
        <p>
          Calculate the scale — traffic, storage, bandwidth, memory. These numbers drive
          every design decision downstream.
        </p>
        <p className="font-medium text-[var(--text)]">The formula pattern:</p>
        <CodeBlock>{`Users → DAU → Writes/sec → Reads/sec
           → Storage → Bandwidth → Cache needs`}</CodeBlock>
        <ExampleBox title="Example: URL Shortener">
          <div className="space-y-2 font-mono text-xs">
            <p>Given: 500M new URLs/month, Read:Write = 100:1</p>
            <p>Writes/sec: 500M ÷ (30 × 24 × 3600) ≈ <strong>200/s</strong></p>
            <p>Reads/sec: 200 × 100 = <strong>20,000/s</strong></p>
            <p>Storage (5yr): 500M × 60 months × 500 bytes = <strong>15 TB</strong></p>
            <p>Cache (80-20): 20% of daily reads × 500 bytes = <strong>170 GB</strong></p>
          </div>
        </ExampleBox>
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Numbers to memorize
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {quickMath.map((q, i) => (
              <div key={i}>
                <span className="text-[var(--text-muted)]">{q[0]}:</span>{" "}
                <span className="font-medium">{q[1]}</span>
              </div>
            ))}
          </div>
        </div>
        <Tip>
          Round aggressively. Say &quot;~200/s&quot; not &quot;192.9/s&quot;. Interviewers want
          order-of-magnitude thinking, not calculator precision.
        </Tip>
      </Step>

      {/* Step 4 */}
      <Step num={4} title="Data Model Definition" time="3-4 min">
        <p>
          Identify entities, their relationships, and choose the right database. This guides
          data flow and partitioning strategy.
        </p>
        <ExampleBox title="Example: Twitter Entities">
          <div className="font-mono text-xs">
            <p>User: UserID, Name, Email, DOB, CreatedAt, LastLogin</p>
            <p>Tweet: TweetID, Content, UserID, Location, Timestamp, LikeCount</p>
            <p>Follow: FollowerID, FolloweeID</p>
            <p>Like: UserID, TweetID, Timestamp</p>
          </div>
        </ExampleBox>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="mb-2 text-sm font-semibold text-blue-400">SQL (MySQL, PostgreSQL)</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>✓ ACID transactions needed</li>
              <li>✓ Complex queries with JOINs</li>
              <li>✓ Relational data, strict schema</li>
              <li>✗ Harder to scale horizontally</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">NoSQL (Cassandra, DynamoDB)</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>✓ Billions of rows, easy horizontal scale</li>
              <li>✓ Simple key-value lookups</li>
              <li>✓ Flexible schema</li>
              <li>✗ No joins, eventual consistency</li>
            </ul>
          </div>
        </div>
      </Step>

      {/* Step 5 */}
      <Step num={5} title="High-Level Design" time="5-8 min">
        <p>
          Draw a block diagram with 5-8 boxes representing core components. Show the data
          flow end-to-end.
        </p>
        <CodeBlock>{`  Clients
     │
     ▼
  Load Balancer
     │
  ┌──┴──┐
  ▼     ▼
App    App Server
Server    │
  │    ┌──┴──┐
  │    ▼     ▼
  └→ Cache  Database
           │
     Object Storage (S3)
     Message Queue (async tasks)`}</CodeBlock>
        <p>What to call out here:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Separate read/write paths if system is read-heavy or write-heavy</li>
          <li>Where media gets stored (blob storage, not the main DB)</li>
          <li>Where cache sits and why (between app servers and DB)</li>
          <li>Any async processing (queues for notifications, encoding, etc.)</li>
        </ul>
      </Step>

      {/* Step 6 */}
      <Step num={6} title="Detailed Design (Deep Dive)" time="10-12 min">
        <p>
          Go deep on 2-3 components based on the interviewer&apos;s interest. Present multiple
          approaches with tradeoffs.
        </p>
        <Callout>
          Structure: &quot;There are a few approaches... Approach A does X (pros/cons).
          Approach B does Y (pros/cons). I&apos;d pick B because [tied to our requirements].&quot;
        </Callout>
        <p className="font-medium text-[var(--text)]">Common deep-dive topics:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {deepDiveTopics.map((t, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <p className="text-sm font-medium">{t.topic}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{t.question}</p>
            </div>
          ))}
        </div>
        <ExampleBox title="Example Deep Dive: Data Partitioning for URL Shortener">
          <div className="space-y-2 text-xs">
            <p><strong>Option A — Range-based:</strong> URLs starting with &apos;A&apos; → Server 1, &apos;B&apos; → Server 2...</p>
            <p className="text-red-400">Problem: Extremely unbalanced. Letter &apos;E&apos; might have 10x more URLs.</p>
            <p><strong>Option B — Hash-based:</strong> hash(key) % N → maps to server number.</p>
            <p className="text-yellow-400">Better, but adding servers requires rehashing everything.</p>
            <p><strong>Option C — Consistent Hashing ✅:</strong> Hash ring with virtual nodes.</p>
            <p className="text-green-400">Adding/removing servers only affects neighbors. Best for dynamic scaling.</p>
          </div>
        </ExampleBox>
      </Step>

      {/* Step 7 */}
      <Step num={7} title="Bottlenecks & Tradeoffs" time="3-5 min">
        <p>
          Proactively identify failure modes. This shows engineering maturity — junior
          engineers design for the happy path; senior engineers design for failure.
        </p>
        <div className="space-y-3">
          {bottleneckQuestions.map((b, i) => (
            <div
              key={i}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <p className="text-sm font-medium text-[var(--text)]">❓ {b.question}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">→ {b.solution}</p>
            </div>
          ))}
        </div>
      </Step>

      {/* Mistakes */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Common Mistakes to Avoid</h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="px-4 py-3 font-medium text-red-400">❌ Mistake</th>
                <th className="px-4 py-3 font-medium text-green-400">✅ Instead</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {mistakes.map((m, i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="px-4 py-3">{m[0]}</td>
                  <td className="px-4 py-3">{m[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cheat sheet */}
      <section className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6">
        <h2 className="mb-4 text-lg font-bold text-[var(--accent)]">📋 Framework Cheat Sheet</h2>
        <div className="grid gap-2 font-mono text-sm">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[var(--accent)]">{i + 1}.</span>
              <span className="font-medium">{s.short}</span>
              <span className="text-[var(--text-muted)]">— {s.hint}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          Remember: There is no single correct answer. What matters is{" "}
          <strong className="text-[var(--text)]">tradeoffs, reasoning, and communication</strong>.
        </p>
      </section>

      {/* Nav */}
      <LessonStatus slug="interview-framework" />
      <div className="flex justify-between pt-4">
        <Link
          href="/what-is-system-design"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]"
        >
          ← Previous
        </Link>
        <Link
          href="/"
          className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-dim)]"
        >
          Back to Home
        </Link>
      </div>
    </article>
  );
}

/* -- Reusable components -- */

function Step({ num, title, time, children }: { num: number; title: string; time: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
          {num}
        </span>
        <h2 className="text-lg font-bold">{title}</h2>
        <span className="ml-auto rounded-full bg-[var(--bg-hover)] px-3 py-1 text-xs text-[var(--text-muted)]">
          {time}
        </span>
      </div>
      <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">{children}</div>
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

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-xs text-yellow-200/80">
      💡 <strong>Pro tip:</strong> {children}
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[#0d0d14] p-4 font-mono text-xs leading-relaxed text-[var(--text-muted)]">
      <pre>{children}</pre>
    </div>
  );
}

function ExampleBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-hover)] p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{title}</p>
      <div className="text-sm text-[var(--text-muted)]">{children}</div>
    </div>
  );
}

function Card({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  const borderClass = color === "blue" ? "border-blue-500/20" : color === "purple" ? "border-purple-500/20" : "border-green-500/20";
  return (
    <div className={`rounded-lg border ${borderClass} bg-[var(--bg-card)] p-4`}>
      <p className="mb-1 text-xs font-semibold text-[var(--text)]">{title}</p>
      <p className="text-xs text-[var(--text-muted)]">{children}</p>
    </div>
  );
}

/* -- Data -- */

const steps = [
  { title: "Requirements Clarification", time: "3-5 min", short: "REQUIREMENTS", hint: "What? How many? How fast?" },
  { title: "System Interface (APIs)", time: "2-3 min", short: "APIs", hint: "Define the contract" },
  { title: "Back-of-Envelope Estimation", time: "3-5 min", short: "ESTIMATION", hint: "QPS, Storage, Bandwidth" },
  { title: "Data Model Definition", time: "3-4 min", short: "DATA MODEL", hint: "Entities, Schema, DB choice" },
  { title: "High-Level Design", time: "5-8 min", short: "HIGH-LEVEL", hint: "Boxes & arrows (5-8 boxes)" },
  { title: "Detailed Design (Deep Dive)", time: "10-12 min", short: "DEEP DIVE", hint: "2-3 components in detail" },
  { title: "Bottlenecks & Tradeoffs", time: "3-5 min", short: "BOTTLENECKS", hint: "What breaks? How to fix?" },
];

const quickMath = [
  ["Secs/day", "86,400 (~100K)"],
  ["Secs/month", "~2.5M"],
  ["1M × 1KB", "1 GB"],
  ["1B × 1KB", "1 TB"],
  ["Server RAM", "64-256 GB"],
  ["Server disk", "1-4 TB"],
];

const deepDiveTopics = [
  { topic: "Data Partitioning", question: "How to shard across servers? Hash-based? Consistent hashing?" },
  { topic: "Caching Strategy", question: "What to cache? Eviction policy? Cache invalidation?" },
  { topic: "Database Choice", question: "SQL vs NoSQL? Read replicas? Write-ahead logs?" },
  { topic: "Consistency Model", question: "Strong vs eventual? What's acceptable here?" },
  { topic: "Unique ID Generation", question: "Auto-increment? UUID? Snowflake? Dedicated KGS?" },
  { topic: "Feed/Timeline", question: "Fan-out-on-write vs fan-out-on-read? Hybrid?" },
];

const bottleneckQuestions = [
  { question: "Is there a single point of failure?", solution: "Add redundancy — standby replicas, multi-AZ deployment" },
  { question: "Can we survive a server crash without data loss?", solution: "Replication across nodes/regions with automatic failover" },
  { question: "What if traffic spikes 10x?", solution: "Auto-scaling groups, rate limiting, circuit breakers" },
  { question: "How do we know something is broken?", solution: "Monitoring: p99 latency, error rates, alerts, dashboards" },
];

const mistakes = [
  ["Jumping straight to solution", "Spend 3-5 min clarifying requirements first"],
  ["Designing for 100 users", "Always estimate scale — it drives every decision"],
  ["One correct answer mentality", "Present options with tradeoffs, then pick one"],
  ["Ignoring failures", "Always discuss: 'What if X dies?'"],
  ["Staying silent while thinking", "Think out loud — they evaluate your process"],
  ["Shallow coverage of everything", "Go deep on 2-3 things, not shallow on 10"],
];
