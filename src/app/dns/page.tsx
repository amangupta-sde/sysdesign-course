import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "DNS — How the Internet Finds Anything | SysDesign Course" };

export default function DNSPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">DNS — The Internet&apos;s Phone Book</h1>
        <p className="text-lg text-[var(--text-muted)]">
          How typing &quot;google.com&quot; becomes a connection to a specific machine, in under 50ms.
        </p>
      </header>

      {/* 1 - The Problem */}
      <Section num={1} title="The Fundamental Problem">
        <p>
          Every machine on the internet is identified by an <strong>IP address</strong> — a numeric
          address like <Code>17.53.21.253</Code>. Computers can only talk to each other using IPs.
        </p>
        <p>
          But humans can&apos;t remember IPs for every website. We remember names like{" "}
          <Code>google.com</Code>, <Code>youtube.com</Code>. So when you type a URL in your browser,
          something needs to <strong>convert that name into an IP</strong> before any connection can happen.
        </p>
        <Callout>
          <strong>DNS (Domain Name System)</strong> resolution is this translation:<br />
          <span className="font-mono text-[var(--accent)]">domain name → IP address</span>
        </Callout>
        <p>
          Once your browser has the IP, it opens a TCP connection to that machine and starts the
          HTTP request/response cycle. Without DNS, you&apos;d have to memorize numbers for every website.
        </p>
      </Section>

      {/* 2 - What's behind google.com */}
      <Section num={2} title="What's Actually Behind google.com?">
        <p>When you visit google.com, here&apos;s what&apos;s really happening:</p>
        <CodeBlock>{`You type: www.google.com
                    ↓
        DNS resolves to: 17.53.21.253
                    ↓
        That IP belongs to: Google's Load Balancer
                    ↓
        LB forwards to: one of many frontend servers
                    ↓
        Server returns: the HTML page you see`}</CodeBlock>
        <p>
          Google has thousands of frontend servers behind a load balancer. The load balancer has
          the public IP. Your browser never connects to a frontend server directly — it connects
          to the load balancer&apos;s IP.
        </p>
        <Callout>
          The real question: <strong>How does your browser know www.google.com → 17.53.21.253?</strong><br />
          This mapping has to be stored somewhere, and someone has to serve it.
        </Callout>
      </Section>

      {/* 3 - DNS Records */}
      <Section num={3} title="DNS Records & Zones">
        <p>A <strong>DNS record</strong> is a key-value mapping for a domain:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Record Type</th>
                <th className="pb-3 pr-4 font-medium">Maps</th>
                <th className="pb-3 font-medium text-[var(--text-muted)]">Example</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">A</td>
                <td className="py-2 pr-4">domain → IPv4 address</td>
                <td className="py-2 font-mono text-xs">www.google.com → 17.53.21.253</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">CNAME</td>
                <td className="py-2 pr-4">domain → another domain (alias)</td>
                <td className="py-2 font-mono text-xs">bar.google.com → lb.google.com</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">MX</td>
                <td className="py-2 pr-4">mail server for the domain</td>
                <td className="py-2 text-xs">Used for email routing</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-mono text-[var(--accent)]">TXT</td>
                <td className="py-2 pr-4">arbitrary text</td>
                <td className="py-2 text-xs">Verification, SPF, DKIM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="pt-4 text-base font-semibold">DNS Zone</h3>
        <p>
          A <strong>zone</strong> is a logical grouping of all DNS records for a single domain.
          For example, the <Code>google.com</Code> zone contains records for www, mail, maps, etc.
        </p>
        <Tip>
          In AWS Route 53, what you create is called a <strong>Hosted Zone</strong> — that&apos;s exactly this concept.
        </Tip>
      </Section>

      {/* 4 - Authoritative Name Servers */}
      <Section num={4} title="Authoritative Name Servers">
        <p>
          A zone is just data — it needs to live on a <strong>server</strong> that can answer queries about it.
        </p>
        <p>
          <strong>Authoritative name servers</strong> host zones. Their job is simple:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Receive a query for a domain in a zone they own</li>
          <li>Look up the record</li>
          <li>Return the value</li>
        </ol>
        <ExampleBox title="When you buy a domain on GoDaddy">
          <ul className="list-disc space-y-1 pl-4 text-xs">
            <li>Default name servers are GoDaddy&apos;s own (e.g., <Code>ns##.domaincontrol.com</Code>)</li>
            <li>You can change them — e.g., point to AWS Route 53 name servers</li>
            <li>Whatever name servers you configure is what the internet uses to find your zone</li>
          </ul>
        </ExampleBox>
      </Section>

      {/* 5 - Why not centralized */}
      <Section num={5} title="Why Not One Giant Phonebook?">
        <p>
          Why can&apos;t we just have one server with every domain → IP mapping?
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <Card icon="📈" title="Not Scalable">Billions of entries, massive query volume</Card>
          <Card icon="💀" title="Not Fault Tolerant">If it dies, the entire internet dies</Card>
          <Card icon="✏️" title="Not Manageable">Too many writes, too much data for one machine</Card>
        </div>
        <Callout>
          So DNS uses a <strong>decentralized, hierarchical design</strong> where no single machine
          knows everything. This is a core system design pattern — you&apos;ll see it everywhere.
        </Callout>
      </Section>

      {/* 6 - The Resolver */}
      <Section num={6} title="The DNS Resolver">
        <p>
          The <strong>resolver</strong> is the component that performs the lookup on your behalf.
          Your browser doesn&apos;t do it directly.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Where It Runs</th>
                <th className="pb-3 font-medium">Example</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4">ISP level</td>
                <td className="py-2">Your ISP (ACT, Airtel) runs one</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4">Home router</td>
                <td className="py-2">Your WiFi router can act as one</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4">Public resolvers</td>
                <td className="py-2 font-mono">Google: 8.8.8.8 · Cloudflare: 1.1.1.1</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>What it does:</strong> If the IP is cached → return immediately. If not →
          perform the full resolution (next section), cache the result, then return it.
        </p>
      </Section>

      {/* 7 - Root Servers */}
      <Section num={7} title="Root Name Servers">
        <p>The resolution process starts at the <strong>top of the hierarchy</strong>: the root name servers.</p>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4 text-sm">
          <p className="font-medium text-[var(--text)]">Key Facts:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--text-muted)]">
            <li>Exactly <strong>13</strong> root name servers (a through m)</li>
            <li>Named <Code>a.root-servers.net</Code> ... <Code>m.root-servers.net</Code></li>
            <li>Owned by 12 different organizations (Verisign, USC, ICANN, etc.)</li>
            <li>Their IPs are <strong>hardcoded</strong> into every DNS resolver</li>
          </ul>
        </div>

        <h3 className="pt-4 text-base font-semibold">13 ≠ 13 Physical Machines</h3>
        <p>
          13 means 13 <em>IP addresses</em>. Each IP is advertised by <strong>hundreds of physical
          servers</strong> distributed worldwide using a technique called <strong>Anycast</strong>.
        </p>
        <Callout>
          <strong>Anycast:</strong> Multiple servers share the same IP. When a packet is sent to
          that IP, routing automatically delivers it to the <em>nearest</em> physical server. This
          makes root servers fast, distributed, and resilient.
        </Callout>
        <p>
          <strong>What root servers know:</strong> They don&apos;t know <Code>www.google.com</Code>.
          They know which servers handle each TLD — <Code>.com</Code>, <Code>.in</Code>, <Code>.edu</Code>, etc.
        </p>
      </Section>

      {/* 8 - TLD Servers */}
      <Section num={8} title="TLD Name Servers">
        <p>For every top-level domain, there&apos;s a set of TLD name servers:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>One set handles <Code>.com</Code></li>
          <li>Another handles <Code>.in</Code></li>
          <li>Another handles <Code>.edu</Code></li>
        </ul>
        <p>
          A TLD server knows: for each domain under its TLD, <strong>which authoritative name
          server owns that domain&apos;s zone</strong>.
        </p>
        <ExampleBox title="Query flow">
          <p className="text-xs">
            Asked for <Code>google.com</Code>, the .com TLD server replies:<br />
            <em>&quot;The authoritative name server for google.com is ns1.gns.com — here&apos;s its IP.&quot;</em>
          </p>
        </ExampleBox>
      </Section>

      {/* 9 - Full Flow */}
      <Section num={9} title="The Full Resolution Flow">
        <p className="font-medium text-[var(--text)]">Worst case — nothing cached:</p>
        <CodeBlock>{`You type: www.google.com

[Browser]
    ↓ asks
[DNS Resolver — your router / ISP / 8.8.8.8]
    │
    ├─ Step 1: Query Root Name Server
    │          → "Who handles .com?"
    │          ← "Here's the IP of the .com TLD server"
    │
    ├─ Step 2: Query .com TLD Server
    │          → "Who handles google.com?"
    │          ← "Authoritative server is ns1.gns.com (IP: x.x.x.x)"
    │
    └─ Step 3: Query ns1.gns.com (authoritative)
               → "What's the IP for www.google.com?"
               ← "17.53.21.253"

[Resolver caches the answer]

[Browser] opens TCP connection to 17.53.21.253
    → That's Google's Load Balancer
    → LB forwards to a frontend server
    → You get the HTML page`}</CodeBlock>
        <p>Each step narrows the search:</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-[var(--bg-hover)] px-3 py-1">Root → &quot;who handles .com?&quot;</span>
          <span className="rounded-full bg-[var(--bg-hover)] px-3 py-1">TLD → &quot;who handles google.com?&quot;</span>
          <span className="rounded-full bg-[var(--bg-hover)] px-3 py-1">Authoritative → &quot;IP for www.google.com?&quot;</span>
        </div>
      </Section>

      {/* 10 - Caching */}
      <Section num={10} title="Caching at Every Layer">
        <p>
          In reality, the worst-case 3-step flow <strong>almost never happens</strong>. Caching is everywhere:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Layer</th>
                <th className="pb-3 font-medium">What&apos;s Cached</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Browser cache", "Recently looked-up domains"],
                ["OS cache", "System-wide DNS cache"],
                ["Router cache", "Caches for everyone on the network"],
                ["ISP / Public resolver", "Caches at massive scale"],
              ].map(([layer, what], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{layer}</td>
                  <td className="py-2">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each cached entry has a <strong>TTL (time-to-live)</strong> controlling how long it stays
          valid. Popular domains like google.com are almost always cached at the resolver level.
        </p>
        <Tip>
          This is the same caching principle used in system design everywhere — the book&apos;s
          URL Shortener design uses the 80-20 rule: 20% of URLs get 80% of traffic, so caching
          the hot 20% absorbs most reads. DNS works the same way.
        </Tip>
      </Section>

      {/* 11 - Why DNS is beautiful */}
      <Section num={11} title="Why DNS is a System Design Masterpiece">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card icon="🌐" title="Decentralized">No single machine knows everything — work is split hierarchically</Card>
          <Card icon="🛡️" title="Resilient">Anycast + 13 root IPs across hundreds of machines = no SPOF</Card>
          <Card icon="⚡" title="Cacheable">Heavy caching at every layer keeps it fast and reduces load</Card>
          <Card icon="👤" title="Human-Friendly">Gave us readable names instead of memorizing 17.53.21.253</Card>
        </div>
        <Callout>
          DNS embodies every principle you&apos;ll use in system design interviews: hierarchical
          decomposition, caching, replication, decentralization, and graceful degradation.
        </Callout>
      </Section>

      {/* 12 - System Design Connection */}
      <Section num={12} title="How DNS Connects to System Design Interviews">
        <p>DNS appears in almost every system design problem:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Context</th>
                <th className="pb-3 font-medium">How DNS Is Used</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Load Balancing", "DNS can distribute traffic across servers (Round Robin DNS)"],
                ["CDN", "CDN providers use DNS to route users to the nearest edge server"],
                ["Failover", "DNS health checks can redirect traffic away from dead servers"],
                ["Web Crawlers", "Crawlers must resolve millions of domains — DNS becomes a bottleneck; local DNS cache is critical"],
                ["Geo-routing", "Route 53 latency-based routing sends users to the closest datacenter"],
              ].map(([ctx, how], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{ctx}</td>
                  <td className="py-2">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 13 - Quick Reference */}
      <Section num={13} title="Quick Reference — Key Terms">
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            {terms.map(([term, meaning], i) => (
              <div key={i} className="flex gap-2">
                <span className="shrink-0 font-mono font-medium text-[var(--accent)]">{term}</span>
                <span className="text-[var(--text-muted)]">— {meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 14 - Interview Questions */}
      <Section num={14} title="Interview Questions">
        <div className="space-y-3">
          {interviewQs.map((q, i) => (
            <details key={i} className="group rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:text-[var(--accent)]">
                Q: {q.question}
              </summary>
              <div className="border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--text-muted)]">
                {q.answer}
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* Status + Nav */}
      <LessonStatus slug="dns" />
      <div className="flex justify-between pt-4">
        <Link
          href="/interview-framework"
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]"
        >
          ← Interview Framework
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

/* -- Components -- */

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="flex items-center gap-3 text-xl font-bold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">
          {num}
        </span>
        {title}
      </h2>
      <div className="space-y-3 text-sm text-[var(--text-muted)] leading-relaxed">{children}</div>
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

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[var(--bg-hover)] px-1.5 py-0.5 text-xs text-[var(--accent)]">{children}</code>;
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

function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
      <p className="mb-1 text-lg">{icon}</p>
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      <p className="mt-1 text-xs text-[var(--text-muted)]">{children}</p>
    </div>
  );
}

/* -- Data -- */

const terms: string[][] = [
  ["DNS", "Domain Name System — translates names to IPs"],
  ["A record", "Maps domain → IPv4 address"],
  ["CNAME", "Maps domain → another domain (alias)"],
  ["Zone", "Logical grouping of all records for a domain"],
  ["Authoritative NS", "Server that hosts a zone and answers queries"],
  ["Resolver", "Performs the lookup process for clients"],
  ["Root NS", "Top of hierarchy; 13 logical servers (a–m)"],
  ["TLD NS", "Handles a TLD like .com or .in"],
  ["Anycast", "Multiple servers share one IP; nearest responds"],
  ["TTL", "Time-to-live; how long a record can be cached"],
];

const interviewQs = [
  {
    question: "Why can't browsers connect using domain names directly?",
    answer: "The internet's core protocol (IP) routes packets using numeric addresses. Routing tables, OS-level connect() calls, and BGP all work on IPs. DNS is an application-layer abstraction that resolves names to IPs before any network connection happens.",
  },
  {
    question: "Walk through the resolution of www.google.com from scratch.",
    answer: "1) Browser asks resolver. 2) Resolver → Root → 'use .com TLD'. 3) Resolver → .com TLD → 'authoritative is ns1.gns.com'. 4) Resolver → ns1.gns.com → 'IP is 17.53.21.253'. 5) Browser opens TCP to that IP.",
  },
  {
    question: "Why are there only 13 root name servers?",
    answer: "13 is the number of IP addresses (logical servers), not physical machines. Each IP is served by hundreds of machines worldwide via Anycast. The limit of 13 comes from the 512-byte UDP packet size constraint of early DNS — all 13 NS records plus glue records had to fit in one packet.",
  },
  {
    question: "After changing name servers from GoDaddy to AWS, how does the world know?",
    answer: "1) GoDaddy sends EPP update to Verisign (.com registry). 2) Verisign updates the .com TLD zone with new NS records. 3) Resolvers doing fresh lookups now get AWS name servers. 4) Old cached entries expire based on TTL (minutes to 48 hours).",
  },
  {
    question: "How is DNS used in system design for load balancing?",
    answer: "DNS-based load balancing returns different IPs for the same domain (Round Robin DNS). More advanced: Route 53 weighted routing distributes traffic by percentage, latency-based routing sends users to the nearest datacenter, and failover routing redirects if health checks fail.",
  },
];
