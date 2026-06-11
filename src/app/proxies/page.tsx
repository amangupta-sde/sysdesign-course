import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "Proxies — Forward & Reverse | SysDesign Course" };

export default function ProxiesPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Proxies — Forward & Reverse</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The middlemen of the internet — hiding clients, hiding servers, and enabling everything from load balancing to corporate firewalls.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is a Proxy?">
        <p>
          A proxy is a machine that sits <strong>between two systems</strong> and mediates communication.
          The most common intention: <strong>abstract out complexity</strong>.
        </p>
        <Callout>
          <strong>Forward Proxy</strong> → abstracts the <em>client</em> side (hides who&apos;s asking)<br />
          <strong>Reverse Proxy</strong> → abstracts the <em>server</em> side (hides who&apos;s answering)
        </Callout>
        <Tip>
          Mental trick: The proxy always hides the side it sits <em>with</em>. Forward proxy sits
          with clients (hides clients). Reverse proxy sits with servers (hides servers).
        </Tip>
      </Section>

      {/* 2 */}
      <Section num={2} title="Forward Proxy">
        <CodeBlock>{`[Client A] ──┐
[Client B] ──┼──► [Forward Proxy] ──► [Internet / External Service]
[Client C] ──┘

External service sees ONLY the proxy's IP, not individual clients.`}</CodeBlock>

        <h3 className="pt-2 text-base font-semibold">Benefits</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">1. Security / Identity Protection</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              External systems only see the proxy&apos;s IP. Client identities are hidden.
            </p>
            <p className="mt-2 text-xs text-yellow-200/80">
              ⚠️ Real story: A student scraping LinkedIn from a college caused LinkedIn to block the
              college&apos;s proxy IP — making LinkedIn inaccessible to the <em>entire college</em>.
              Everyone shared one proxy identity.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">2. Policy Enforcement</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              All traffic flows through one point → enforce rules centrally: block torrents, social media,
              adult content. Example: TikTok blocked in India at ISP level = national-scale forward proxy.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">3. Caching</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Frequently accessed content cached locally. Faster for everyone, saves bandwidth.
              Works even if original site is briefly unreachable.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">4. Collapsed Forwarding</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Multiple clients requesting the same resource → proxy combines into one request to origin,
              returns result to all. Reduces duplicate traffic significantly.
            </p>
          </div>
        </div>

        <h3 className="pt-4 text-base font-semibold">Common Environments</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li>Educational institutions (colleges, universities)</li>
          <li>Corporate networks (workplace internet)</li>
          <li>National-level filtering (country firewalls via ISPs)</li>
        </ul>
      </Section>

      {/* 3 */}
      <Section num={3} title="Reverse Proxy">
        <CodeBlock>{`[User A] ──┐                        ┌── [Server 1]
[User B] ──┼──► [Reverse Proxy] ────┼── [Server 2]
[User C] ──┘                        └── [Server 3]

Users connect to the reverse proxy.
Proxy decides which backend handles each request.
Users never know how many servers exist behind it.`}</CodeBlock>

        <h3 className="pt-2 text-base font-semibold">Benefits</h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">1. Load Balancing</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Distributes requests across backends: round-robin, least-connections, weighted, IP-hash.
              Examples: nginx, HAProxy, AWS ALB.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">2. Routing (API Gateway)</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Route by path: <Code>/auth/*</Code> → Auth service, <Code>/payments/*</Code> → Payment service.
              Examples: Kong, AWS API Gateway, nginx.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">3. Caching</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Static/frequent responses cached at proxy. Origin doesn&apos;t handle every request.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">4. Abstraction / Elasticity</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Scale up to 100 servers or down to 5 — users don&apos;t notice. Replace dying servers transparently.
              The proxy is the single stable entry point.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">5. Additional Capabilities</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              SSL/TLS termination · Compression (gzip, brotli) · Rate limiting · DDoS mitigation ·
              Auth at the edge · Request/response transformation · Canary deployments
            </p>
          </div>
        </div>
      </Section>

      {/* 4 */}
      <Section num={4} title="Forward vs Reverse — Side-by-Side">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Aspect</th>
                <th className="pb-3 pr-3 font-medium text-blue-400">Forward Proxy</th>
                <th className="pb-3 font-medium text-purple-400">Reverse Proxy</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Who it represents", "Clients", "Servers"],
                ["What it hides", "Client identity", "Backend architecture"],
                ["Invisible to whom?", "External services", "Clients"],
                ["Where it sits", "Edge of client's network", "In front of servers"],
                ["Common use cases", "Filtering, anonymity, caching", "Load balancing, routing, security"],
                ["Example tools", "Squid, VPNs, corporate firewalls", "nginx, HAProxy, Kong, AWS ALB"],
              ].map(([aspect, fwd, rev], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{aspect}</td>
                  <td className="py-2 pr-3">{fwd}</td>
                  <td className="py-2">{rev}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock>{`FORWARD PROXY (wraps clients)        REVERSE PROXY (wraps servers)
┌─────────────────────┐              ┌─────────────────────┐
│ [Client A]          │              │  → [Server 1]       │
│ [Client B] → Proxy ─┼─→ Service   Client → Proxy ──┼─→ [Server 2]       │
│ [Client C]          │              │  → [Server 3]       │
└─────────────────────┘              └─────────────────────┘
"Service sees only proxy"            "Client sees only proxy"`}</CodeBlock>
      </Section>

      {/* 5 */}
      <Section num={5} title="Proxy Types (from the books)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Open Proxy", "Accessible by any internet user (not just a closed network)"],
                ["Anonymous Proxy", "Reveals itself as a proxy but hides client's IP address"],
                ["Transparent Proxy", "Identifies itself and shows client IP via HTTP headers (used for caching)"],
                ["Reverse Proxy", "Sits in front of servers; retrieves resources on behalf of client"],
                ["Database Proxy", "Specialized reverse proxy for DB connections (connection pooling, caching)"],
              ].map(([type, desc], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{type}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6 */}
      <Section num={6} title="Database Proxies — A Specialized Reverse Proxy">
        <p>Sits between application servers and database servers. Examples: ProxySQL, PgBouncer, Amazon RDS Proxy.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Caching", desc: "Identical queries served from proxy cache — DB never touched for repeated reads." },
            { title: "Connection Pooling", desc: "Apps open many connections to proxy; proxy maintains a smaller pool to actual DB. Critical at scale — DBs have connection limits." },
            { title: "Topology Abstraction", desc: "DB might be sharded, have replicas, or be migrating. App just sends a query; proxy routes it." },
            { title: "Failover", desc: "If DB crashes, proxy auto-routes to replica. App never knows there was a failure." },
          ].map((d, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-medium text-[var(--text)]">{d.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 7 */}
      <Section num={7} title="10 Uses of Proxy Servers (from the Fundamentals book)">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-3 font-medium">#</th>
                <th className="pb-2 pr-3 font-medium">Use</th>
                <th className="pb-2 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Performance", "Cache frequently accessed content → faster response, less bandwidth"],
                ["Security", "Filter malicious content, enforce access control, block threats"],
                ["Anonymity", "Mask client IP, bypass geo-restrictions, avoid tracking"],
                ["Load Balancing", "Distribute requests across servers (reverse proxy)"],
                ["Content Filtering", "Block specific sites/content per policy (education/corporate)"],
                ["Content Adaptation", "Modify content for client (compress, reformat for mobile)"],
                ["Logging & Auditing", "Record all traffic for troubleshooting and compliance"],
                ["SSL Termination", "Handle TLS at proxy, offload crypto from backends"],
                ["App-Level Gateway", "Auth, protocol translation, request transformation"],
                ["Collapsed Forwarding", "Combine duplicate requests into one origin call"],
              ].map(([use, detail], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 text-[var(--accent)]">{i + 1}</td>
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{use}</td>
                  <td className="py-2">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title="VPN vs Proxy">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Aspect</th>
                <th className="pb-3 pr-3 font-medium">VPN</th>
                <th className="pb-3 font-medium">Proxy</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Encryption", "End-to-end encryption for ALL data", "No encryption (unless HTTPS proxy)"],
                ["Traffic scope", "ALL internet traffic from device", "Only browser/specific app traffic"],
                ["Privacy", "High — encrypted tunnel", "Limited — IP masking only"],
                ["Performance", "Slower (encryption overhead)", "Faster (no crypto)"],
                ["Best for", "Security on public WiFi, sensitive data", "Bypassing geo-blocks, simple IP hiding"],
              ].map(([aspect, vpn, proxy], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{aspect}</td>
                  <td className="py-2 pr-3">{vpn}</td>
                  <td className="py-2">{proxy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="Real-World Tools">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="mb-2 text-sm font-semibold text-blue-400">Forward Proxies</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Squid — open-source caching proxy</li>
              <li>Zscaler, Cisco — corporate firewalls</li>
              <li>VPNs — hide identity from destination</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="mb-2 text-sm font-semibold text-purple-400">Reverse Proxies</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>nginx — most popular, fast, flexible</li>
              <li>HAProxy — high-performance LB</li>
              <li>Envoy — service mesh (Istio)</li>
              <li>Kong, AWS API Gateway — API gateways</li>
            </ul>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">Database Proxies</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>ProxySQL — MySQL</li>
              <li>PgBouncer — PostgreSQL</li>
              <li>Amazon RDS Proxy</li>
              <li>Vitess — sharded MySQL</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 10 */}
      <Section num={10} title="The Abstraction Pattern">
        <Callout>
          Whenever you see a proxy in system design, ask: <strong>&quot;What is this proxy hiding from whom?&quot;</strong> That tells you the type and purpose.
        </Callout>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Proxy Type</th>
                <th className="pb-3 pr-4 font-medium">What&apos;s Abstracted</th>
                <th className="pb-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Forward", "Clients", "External world sees one entity instead of many clients"],
                ["Reverse", "Servers", "Clients see one entity instead of many servers"],
                ["Database", "DB topology", "Apps see one DB instead of a complex sharded cluster"],
                ["CDN", "Origin server", "Users get content from nearest edge (distributed reverse proxy)"],
              ].map(([type, what, result], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{type}</td>
                  <td className="py-2 pr-4">{what}</td>
                  <td className="py-2">{result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          A CDN is essentially a <strong>geographically distributed reverse proxy</strong> for static content.
          Same principles — abstraction, caching, load distribution — just at global scale.
        </Tip>
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

      <LessonStatus slug="proxies" />
      <div className="flex justify-between pt-4">
        <Link href="/cdn" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">← CDN</Link>
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
  { question: "What's the difference between a forward and reverse proxy?", answer: "Forward proxy hides clients from external services (sits with clients). Reverse proxy hides servers from clients (sits with servers). Forward = client anonymity. Reverse = server abstraction, load balancing, security." },
  { question: "What is SSL termination and why use it?", answer: "Decrypting HTTPS at the reverse proxy instead of backend servers. Benefits: reduces CPU load on backends, centralizes certificate management, simplifies backend config. Backends receive plain HTTP internally." },
  { question: "What's the relationship between a CDN and a reverse proxy?", answer: "A CDN is a geographically distributed reverse proxy for static content. Same principles (abstraction, caching, load distribution) applied at global scale. CDN edges are reverse proxies placed near users worldwide." },
  { question: "What is collapsed forwarding?", answer: "When multiple clients request the same resource simultaneously, the proxy combines them into ONE request to origin, then returns the result to all clients. Massively reduces duplicate traffic to the backend." },
  { question: "Why do databases need proxies?", answer: "Connection pooling (DBs have limited connections), query caching (repeated queries served from proxy), topology abstraction (hide sharding/replicas from app), and automatic failover (transparent to application)." },
  { question: "Can one tool be both forward and reverse proxy?", answer: "Yes. nginx can be configured as either. The difference is configuration and placement, not the software. Squid is also used as both. The role depends on traffic direction and what's being abstracted." },
  { question: "How do reverse proxies improve security?", answer: "Hide backend IPs (attackers can't target directly), centralize SSL/TLS, rate limiting and DDoS protection, filter malicious requests before reaching backends, centralize authentication at the edge." },
];
