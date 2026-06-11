import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "CDN — Content Delivery Networks | SysDesign Course" };

export default function CDNPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Content Delivery Networks (CDN)</h1>
        <p className="text-lg text-[var(--text-muted)]">
          A geographically distributed cache that makes content fast for everyone — no matter where they are.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is a CDN?">
        <p>
          A CDN is a globally distributed system of servers that stores and serves content
          (especially static content) <strong>close to users</strong>.
        </p>
        <Callout>
          <strong>Mental model:</strong> Take a normal cache, copy it across the world, and
          route users to the nearest copy. That&apos;s a CDN.
        </Callout>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card icon="⚡" title="Faster">Content served from the nearest server</Card>
          <Card icon="💰" title="Cheaper">Reduces load and bandwidth on origin</Card>
          <Card icon="🛡️" title="More Reliable">Redundancy across many locations</Card>
        </div>
      </Section>

      {/* 2 */}
      <Section num={2} title="The Problem CDNs Solve">
        <h3 className="text-base font-semibold">Problem 1: Geographic Latency</h3>
        <p>A single server can&apos;t be fast for users globally:</p>
        <CodeBlock>{`Server in India   → fast for Indians, slow for Americans
Server in USA     → fast for Americans, slow for Indians
Server in center  → moderate for everyone, fast for nobody

There's NO single location that makes everyone happy.`}</CodeBlock>

        <h3 className="pt-4 text-base font-semibold">Problem 2: Regional Regulations</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Movies licensed only for India can&apos;t be shown in the US</li>
          <li>GDPR requires data to stay in Europe</li>
          <li>A single server can&apos;t handle these regional differences</li>
        </ul>
      </Section>

      {/* 3 */}
      <Section num={3} title="The CDN Architecture">
        <CodeBlock>{`              ┌─────────────────┐
              │  Origin Server  │
              │  (master copy)  │
              └─────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   ┌────────┐    ┌────────┐    ┌────────┐
   │  CDN   │    │  CDN   │    │  CDN   │
   │ Mumbai │    │  USA   │    │ Tokyo  │
   └────────┘    └────────┘    └────────┘
        │             │             │
        ▼             ▼             ▼
  [Indian users] [US users]  [Japanese users]`}</CodeBlock>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Each edge is physically close to its users</li>
          <li>Holds a subset of content (whatever&apos;s relevant regionally)</li>
          <li>Users route to nearest edge <strong>automatically</strong> (via DNS or Anycast)</li>
          <li>Origin server is the source of truth — edges cache from it</li>
        </ul>
      </Section>

      {/* 4 */}
      <Section num={4} title="How a CDN Edge Server Works">
        <p>
          A CDN edge is just a regular server — IP address, file system, API. The &quot;magic&quot; is
          distribution and routing, not the individual servers.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="text-sm font-semibold text-green-400">Cache Hit ⚡</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Content is cached → serve immediately from local edge. ~30-50ms.
            </p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <p className="text-sm font-semibold text-yellow-400">Cache Miss 🔄</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Not cached → fetch from origin, cache it, then serve. ~300-500ms first time.
            </p>
          </div>
        </div>
      </Section>

      {/* 5 */}
      <Section num={5} title="Full Request Trace — Step by Step">
        <p className="font-medium text-[var(--text)]">
          User in Mumbai loads <Code>interviewready.io/images/hero.jpg</Code>:
        </p>

        <h3 className="pt-2 text-base font-semibold">Phase 1: DNS → Find Nearest Edge</h3>
        <CodeBlock>{`1. Browser parses URL → hostname: interviewready.io
2. DNS resolver walks the hierarchy (root → .io TLD → CDN's DNS)
3. CDN's DNS does geo-routing:
   - Sees query from India
   - Returns IP of Mumbai edge (13.226.45.78)
4. Browser now knows: interviewready.io → Mumbai edge`}</CodeBlock>

        <h3 className="pt-4 text-base font-semibold">Phase 2: Connect to Edge</h3>
        <CodeBlock>{`5. TCP handshake (Mumbai → Mumbai = ~10ms, not ~250ms to Virginia)
6. TLS handshake (edge has valid cert for the domain)
7. Browser sends: GET /images/hero.jpg HTTP/1.1`}</CodeBlock>

        <h3 className="pt-4 text-base font-semibold">Phase 3: Cache Lookup</h3>
        <CodeBlock>{`Path A — CACHE MISS (first request from Mumbai):
──────────────────────────────────────────────
8.  Edge checks cache → not found
9.  Edge connects to Virginia origin
10. Origin returns hero.jpg + Cache-Control: max-age=86400
11. Edge caches the file (24hr TTL)
12. Edge serves to user
    Response header: X-Cache: Miss from cloudfront
    Total time: ~300-500ms

Path B — CACHE HIT (subsequent requests):
──────────────────────────────────────────────
8.  Edge checks cache → FOUND, TTL valid
9.  Edge serves directly from local cache
    Response header: X-Cache: Hit from cloudfront
    Total time: ~30-50ms  ← 10x faster!`}</CodeBlock>

        <h3 className="pt-4 text-base font-semibold">Phase 4: Cache Validation (TTL expired)</h3>
        <CodeBlock>{`Edge sends conditional request:
  GET /images/hero.jpg
  If-None-Match: "abc123"    ← ETag from original response

Origin responds:
  304 Not Modified → Edge refreshes TTL, serves cached bytes
  200 OK (new file) → Edge replaces cache, serves new bytes

Saves bandwidth — file isn't re-downloaded if unchanged.`}</CodeBlock>

        <Tip>
          One cache miss benefits <strong>thousands of users</strong> in the region. A user in
          Pune (also routed to Mumbai edge) gets an instant cache hit from the earlier Mumbai request.
        </Tip>
      </Section>

      {/* 6 */}
      <Section num={6} title="What Goes on a CDN">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">✅ Static Content (CDN sweet spot)</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Images (JPG, PNG, WebP)</li>
              <li>Videos (MP4, streaming chunks)</li>
              <li>JavaScript &amp; CSS files</li>
              <li>Fonts, PDFs, installers</li>
              <li>Pre-rendered / static HTML pages</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-red-400">❌ NOT for CDN (typically)</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Personalized dashboards (per-user)</li>
              <li>Real-time data (live prices, chat)</li>
              <li>Database results that change constantly</li>
              <li>Authenticated API responses</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 7 */}
      <Section num={7} title="Performance Impact">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Metric</th>
                <th className="pb-3 pr-4 font-medium text-red-400">Without CDN</th>
                <th className="pb-3 font-medium text-green-400">With CDN</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Cross-continent latency", "200-500ms", "20-100ms"],
                ["Origin server load", "Every request hits origin", "Most served from edge"],
                ["Bandwidth costs", "High at origin", "Distributed/optimized"],
                ["User experience", "Inconsistent globally", "Consistently fast"],
                ["Reliability", "Single point of failure", "Redundant edges worldwide"],
              ].map(([metric, without, withCdn], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{metric}</td>
                  <td className="py-2 pr-4">{without}</td>
                  <td className="py-2 text-green-400">{withCdn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          Amazon and Google studies show even <strong>half a second of delay</strong> loses user trust.
          Speed directly impacts conversion and retention. CDNs make this difference.
        </Callout>
      </Section>

      {/* 8 */}
      <Section num={8} title="CDN Providers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Provider</th>
                <th className="pb-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Amazon CloudFront", "Tight S3 integration — upload to S3, globally available instantly"],
                ["Cloudflare", "Most popular; free tier; built-in DDoS protection"],
                ["Akamai", "Oldest & largest; enterprise-focused"],
                ["Google Cloud CDN", "Integrated with GCP"],
                ["Fastly", "Developer-friendly; used by GitHub, Stripe"],
              ].map(([provider, notes], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{provider}</td>
                  <td className="py-2">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="CDN in System Design Interviews">
        <p>
          CDNs appear in the Grokking book&apos;s designs wherever media or static content is involved:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Problem</th>
                <th className="pb-3 font-medium">How CDN Is Used</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["YouTube / Netflix", "Video chunks served from nearest edge. Less popular videos served from origin datacenter."],
                ["Instagram", "Photos pushed to CDN. Metadata (likes, comments) stays in DB."],
                ["Twitter", "Media attachments (images, videos) on CDN. Tweet text from app servers."],
                ["Dropbox", "Downloaded files served from nearest CDN edge for speed."],
                ["Any web app", "JS, CSS, fonts, images — all static assets go on CDN by default."],
              ].map(([problem, usage], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{problem}</td>
                  <td className="py-2">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          In interviews, when discussing media-heavy systems, always mention: &quot;Static content
          like images/videos would be served through a CDN for low-latency global delivery,
          reducing load on our origin servers.&quot;
        </Tip>
      </Section>

      {/* 10 */}
      <Section num={10} title="CDN + Caching Relationship">
        <p>
          The Grokking book discusses caching as a core building block. CDN is just <strong>caching
          applied globally</strong>:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Regular Cache</th>
                <th className="pb-3 font-medium">CDN</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Single location (with your servers)", "Distributed across the globe"],
                ["In-memory (Redis/Memcached)", "Disk + memory on edge servers"],
                ["Reduces DB load", "Reduces origin server load + network latency"],
                ["Same datacenter as app", "Close to end users physically"],
                ["LRU/LFU eviction", "TTL-based + LRU eviction at each edge"],
              ].map(([cache, cdn], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4">{cache}</td>
                  <td className="py-2">{cdn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 11 */}
      <Section num={11} title="Interview Questions">
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

      {/* Status + Nav */}
      <LessonStatus slug="cdn" />
      <div className="flex justify-between pt-4">
        <Link href="/monolith-vs-microservices" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">
          ← Monolith vs Microservices
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
function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-xs text-[var(--accent)]">{children}</code>;
}
function CodeBlock({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[#0d0d14] p-4 font-mono text-xs leading-relaxed text-[var(--text-muted)]"><pre>{children}</pre></div>;
}
function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4"><p className="mb-1 text-lg">{icon}</p><p className="text-sm font-medium text-[var(--text)]">{title}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{children}</p></div>;
}

const interviewQs = [
  { question: "What is a CDN?", answer: "A globally distributed system of servers that caches and serves content from locations close to users, reducing latency and offloading traffic from origin servers. Essentially a geographically distributed cache." },
  { question: "How does a user reach the nearest CDN edge?", answer: "Two mechanisms: 1) DNS-based routing — CDN's DNS returns the IP of the closest edge based on user location. 2) Anycast — many edges share the same IP; internet routing automatically delivers to the nearest one." },
  { question: "What happens on a cache miss?", answer: "Edge fetches content from origin, caches it locally (noting TTL from Cache-Control header), then serves it to the user. Subsequent requests from that region get instant cache hits." },
  { question: "What kind of content goes on a CDN?", answer: "Static content that doesn't change per user: images, videos, fonts, JS/CSS, PDFs. NOT: personalized dashboards, real-time data, or per-user API responses." },
  { question: "How does cache invalidation work on CDNs?", answer: "Three strategies: 1) TTL expiry — content refreshes after max-age. 2) Conditional revalidation — edge asks origin 'has this changed?' (If-None-Match/ETag). 3) Manual purge — developer triggers cache clear via CDN API." },
  { question: "What if the origin server goes down?", answer: "Users still get cached content from edges (stale but available). Only new/uncached content fails. This is a major reliability benefit — partial functionality during origin outages." },
  { question: "How is a CDN different from a regular cache like Redis?", answer: "A regular cache sits in one datacenter (reduces DB load). A CDN distributes caches globally (reduces both origin load AND network latency by being physically close to users). CDN = cache + geographic distribution." },
  { question: "When would you mention CDN in a system design interview?", answer: "Whenever the system serves media or static assets globally: YouTube (video chunks), Instagram (photos), any web app (JS/CSS/fonts). Say: 'Static content served via CDN for low-latency global delivery, reducing origin load.'" },
];
