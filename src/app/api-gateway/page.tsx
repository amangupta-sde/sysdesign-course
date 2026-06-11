import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "API Gateways | SysDesign Course" };

export default function APIGatewayPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">API Gateways</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The single front door to your microservices — handling auth, routing, rate limiting, and more before requests reach backends.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is an API Gateway?">
        <p>
          An API Gateway is a specialized server that sits between <strong>external clients</strong> and
          <strong> internal microservices</strong>. It acts as the single entry point for all client requests.
        </p>
        <CodeBlock>{`[Mobile / Desktop / Browser]
            │
            ▼
     ┌──────────────┐
     │  API Gateway │  ← Single entry point
     └──────────────┘
      │      │      │
      ▼      ▼      ▼
  [Users] [Posts] [Payments]  ← Internal microservices
      │      │      │
      ▼      ▼      ▼
   [DB 1]  [DB 2]  [DB 3]`}</CodeBlock>
        <Callout>
          Internal services should <strong>never</strong> talk directly to the external world.
          The gateway provides: abstraction, security, and a unified entry point.
        </Callout>
      </Section>

      {/* 2 */}
      <Section num={2} title="Core Responsibilities">
        <div className="space-y-3">
          {responsibilities.map((r, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">{i + 1}</span>
                <h4 className="text-sm font-semibold text-[var(--text)]">{r.title}</h4>
              </div>
              <p className="mt-2 text-xs text-[var(--text-muted)]">{r.desc}</p>
              {r.example && (
                <p className="mt-1 text-xs italic text-[var(--text-muted)]/70">{r.example}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* 3 */}
      <Section num={3} title="API Gateway vs Load Balancer">
        <p>Often confused — here&apos;s the key difference:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-3 font-medium">Aspect</th>
                <th className="pb-3 pr-3 font-medium text-purple-400">API Gateway</th>
                <th className="pb-3 font-medium text-blue-400">Load Balancer</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Primary job", "Route to different services by path/method", "Distribute to instances of SAME service"],
                ["Layer", "Layer 7 (application — understands HTTP)", "Layer 4 (transport) or Layer 7"],
                ["Auth", "✅ Handles authentication", "❌ No auth logic"],
                ["Rate limiting", "✅ Per-user/per-key throttling", "❌ or basic connection limits"],
                ["Transformation", "✅ Modify requests/responses", "❌ Passes through unchanged"],
                ["Example", "/users → User Service, /pay → Payment", "User Service: instance 1, 2, 3"],
              ].map(([aspect, gw, lb], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--text)]">{aspect}</td>
                  <td className="py-2 pr-3">{gw}</td>
                  <td className="py-2">{lb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          In practice, they often work together: API Gateway routes to the right <em>service</em>,
          then a load balancer distributes across <em>instances</em> of that service.
        </Tip>
      </Section>

      {/* 4 */}
      <Section num={4} title="The Full Request Flow">
        <CodeBlock>{`[Client types api.example.com/payments/charge]
    │
    ▼
① DNS Resolution
    → Resolves to nearest infrastructure IP
    │
    ▼
② CDN Check
    → Static content? Serve from edge (90% of traffic)
    → Dynamic API call? Pass through to gateway
    │
    ▼
③ API Gateway Receives Request
    → Authenticate: Is this user valid?
    → Authorize: Can they access /payments?
    → Validate: Is the request well-formed?
    → Rate limit: Have they exceeded quota?
    → Transform: Adapt request for backend
    → Route: /payments/* → Payment Service
    │
    ▼
④ Backend Service Processes
    → Payment Service runs business logic
    → Calls database, processes charge
    → Returns response
    │
    ▼
⑤ Response Returns
    → Service → Gateway (may transform response)
    → Gateway → Client`}</CodeBlock>
      </Section>

      {/* 5 */}
      <Section num={5} title="Advanced Gateway Capabilities (from the Fundamentals book)">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-3 font-medium">Capability</th>
                <th className="pb-2 font-medium">What It Does</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Response Aggregation", "Combine data from multiple services into one response (e.g., profile + orders + recs for a mobile screen)"],
                ["Protocol Translation", "Client sends HTTP; gateway converts to gRPC/WebSocket for backends"],
                ["Circuit Breaker", "If a service fails repeatedly, stop sending requests to it (prevent cascading failure)"],
                ["Service Discovery", "Integrate with Consul/Eureka to find healthy service instances dynamically"],
                ["Content-Based Routing", "Route by headers/body content (e.g., Content-Type: image → image service)"],
                ["SSL Termination", "Handle HTTPS at gateway; backends receive plain HTTP internally"],
                ["API Versioning", "Manage /v1/, /v2/ simultaneously without breaking existing clients"],
                ["Canary Deployments", "Route 5% of traffic to new version for testing before full rollout"],
                ["Multi-Tenancy", "Route different customers (tenants) to isolated backends based on auth token"],
              ].map(([cap, desc], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-3 font-medium text-[var(--accent)]">{cap}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 6 */}
      <Section num={6} title="AWS Reference Architecture">
        <CodeBlock>{`[Client]
   │
   ├──► [Route 53]        (DNS lookup)
   │
   ├──► [CloudFront]      (90% — static content from S3)
   │       └─► [S3]
   │
   └──► [AWS API Gateway]  (10% — dynamic API calls)
           │
           └─► [Lambda / ECS / EC2 microservices]`}</CodeBlock>
        <Tip>
          For startups: don&apos;t build gateways from scratch. AWS API Gateway, Kong, or even nginx
          gives you battle-tested infrastructure. Focus on your product, not reinventing plumbing.
        </Tip>
      </Section>

      {/* 7 */}
      <Section num={7} title="Advantages & Disadvantages">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">✅ Advantages</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Simplified client — one endpoint, one contract</li>
              <li>Centralized auth, rate limiting, logging</li>
              <li>Backend changes don&apos;t break clients</li>
              <li>Response aggregation (fewer client calls)</li>
              <li>Protocol translation (HTTP → gRPC)</li>
              <li>API versioning without service changes</li>
              <li>Better monitoring and visibility</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-red-400">❌ Disadvantages</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Single point of failure (needs HA design)</li>
              <li>Added latency (extra network hop)</li>
              <li>Complexity — config and maintenance overhead</li>
              <li>Can become a bottleneck under extreme load</li>
              <li>Vendor lock-in (if using managed service)</li>
              <li>Cost at high traffic volumes</li>
              <li>Gateway updates needed when APIs change</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title="The Evolution: Beyond Centralized Gateways">
        <p>Centralized gateways can become painful at scale. The industry is evolving:</p>
        <div className="space-y-3">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Phase 1: Extract responsibilities out</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              LB → dedicated load balancer. Auth → dedicated auth service. Rate limiting → separate service.
              Gateway becomes thinner.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Phase 2: Service Mesh + Sidecar Pattern</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Small proxy processes (sidecars) deployed alongside each service handle: LB, routing, rate limiting,
              mTLS, observability. Example: Istio + Envoy. Distributes responsibility instead of centralizing it.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-sm font-semibold text-[var(--text)]">Phase 3: The monolith comeback</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Many startups skip the gateway entirely. Single service + managed CDN + managed DNS.
              Right architecture depends on scale and team, not trends.
            </p>
          </div>
        </div>
        <Callout>
          <strong>War story:</strong> A team spent 20-25% of sprint time restarting their API Gateway
          every time a backend service changed its API contract. The fix: client libraries with versioned
          contracts in a shared Git file. Lesson: heavy gateways have real maintenance costs.
        </Callout>
      </Section>

      {/* 9 */}
      <Section num={9} title="Real-World Tools">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Tool</th>
                <th className="pb-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["AWS API Gateway", "Managed, serverless, integrates with Lambda. Pay per request."],
                ["Kong", "Open-source, plugin-based, runs on nginx. Very popular."],
                ["Apigee (Google)", "Enterprise API management, analytics, monetization."],
                ["nginx", "Can act as API gateway with config. Lightweight, fast."],
                ["Envoy", "Modern, used in service meshes (Istio). gRPC-native."],
                ["Traefik", "Auto-discovery focused, great with Docker/Kubernetes."],
                ["Tyk", "Open-source, Go-based, GraphQL support."],
              ].map(([tool, notes], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{tool}</td>
                  <td className="py-2">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--text-muted)]">
          <strong>Netflix</strong> is a prime example — uses its custom Zuul gateway to manage interactions
          between smart TVs, mobile apps, and hundreds of backend microservices.
        </p>
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

      <LessonStatus slug="api-gateway" />
      <div className="flex justify-between pt-4">
        <Link href="/proxies" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">← Proxies</Link>
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

const responsibilities = [
  { title: "Authentication & Authorization", desc: "Verify user identity and permissions. Done ONCE at gateway instead of duplicated in every service.", example: "Check JWT token → valid? → does this user have access to /payments?" },
  { title: "Request Routing", desc: "Inspect path/method/headers and route to the correct microservice.", example: "/users/* → User Service, /payments/* → Payment Service, /posts/* → Posts Service" },
  { title: "Rate Limiting", desc: "Throttle clients sending too many requests. Defends against floods and DDoS. Limits per-user, per-IP, or per-API-key.", example: "Free tier: 100 req/min. Premium: 10,000 req/min. Exceeded? → HTTP 429." },
  { title: "Request/Response Transformation", desc: "Adapt request format for each backend. Add metadata (request ID, user-agent). Clean internal fields from responses.", example: "Client sends flat JSON → gateway restructures for backend's expected schema." },
  { title: "Validation", desc: "Reject malformed requests at the edge before they waste backend resources.", example: "Missing required field? → immediate 400 Bad Request. Backend never touched." },
  { title: "Load Balancing", desc: "If a service has multiple instances, pick which one handles the request.", example: "Payment Service has 5 instances → round-robin or least-connections." },
  { title: "Response Aggregation", desc: "Combine data from multiple services into a single response for the client.", example: "Mobile home screen needs profile + orders + recommendations → one gateway call instead of three." },
];

const interviewQs = [
  { question: "What's the difference between an API Gateway and a Load Balancer?", answer: "API Gateway routes requests to DIFFERENT services based on path/content (Layer 7 application logic: auth, transform, rate limit). Load Balancer distributes requests across INSTANCES of the SAME service. They often work together: gateway picks the service, LB picks the instance." },
  { question: "Why not put auth logic in each microservice?", answer: "Duplication — every service reimplements the same auth logic. A gateway centralizes it: validate once, then pass authenticated context to backends. However, service-specific authorization (e.g., 'can this user edit THIS post?') often stays in the service." },
  { question: "How does an API Gateway handle service discovery?", answer: "Integrates with tools like Consul, Eureka, or Kubernetes DNS. When a service scales up/down, new instances register automatically. Gateway's routing table updates dynamically without manual config." },
  { question: "What is the circuit breaker pattern at the gateway?", answer: "If a backend service fails repeatedly, the gateway stops sending requests to it (circuit 'open'). After a timeout, it tries again (circuit 'half-open'). If successful, resumes normal traffic (circuit 'closed'). Prevents cascading failures across the system." },
  { question: "When would you NOT use an API Gateway?", answer: "1) Simple monolith with one service — gateway adds unnecessary complexity. 2) Internal service-to-service calls — use service mesh instead. 3) Very early-stage startup — just use nginx as a reverse proxy until you need gateway features." },
  { question: "How does Netflix use their API Gateway?", answer: "Netflix uses Zuul (custom gateway) to manage traffic from smart TVs, phones, and tablets to hundreds of microservices. It handles: auth, routing, canary deployments, rate limiting, and request aggregation — serving billions of requests per day." },
];
