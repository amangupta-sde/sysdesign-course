import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "REST & REST over HTTP | SysDesign Course" };

export default function RESTPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">REST & REST over HTTP</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The specification that turned HTTP into the universal language for APIs — and when to use something else.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is REST?">
        <p>
          REST stands for <strong>Representational State Transfer</strong>. It&apos;s a
          <strong> specification</strong> for how clients and servers should communicate.
        </p>
        <Callout>
          REST is NOT a protocol, library, or framework. It&apos;s a set of constraints that,
          when followed, make your API predictable, cacheable, and scalable.
        </Callout>
        <p>Core idea: <strong>everything in your system is a resource</strong>.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">System</th>
                <th className="pb-3 font-medium">Resources</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Library", "student, book, loan"],
                ["E-commerce", "user, seller, item, order"],
                ["Chat app", "message, conversation, user"],
                ["URL shortener", "url, user"],
              ].map(([sys, res], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{sys}</td>
                  <td className="py-2 font-mono text-xs">{res}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 2 */}
      <Section num={2} title="What REST Cares About (and Doesn't)">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-green-400">✅ REST cares about</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>Format of communication (request/response)</li>
              <li>How resources are identified (URLs)</li>
              <li>What actions are taken (HTTP verbs)</li>
              <li>How clients request representations</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="mb-2 text-sm font-semibold text-red-400">❌ REST doesn&apos;t care about</p>
            <ul className="space-y-1 text-xs text-[var(--text-muted)]">
              <li>How you store data (SQL, Mongo, Cassandra)</li>
              <li>What tables or schemas you use</li>
              <li>How you index, cache, or process internally</li>
              <li>Your deployment or infrastructure choices</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 3 */}
      <Section num={3} title='The "Representation" Part'>
        <p>
          The <strong>R</strong> in REST is the most important word. The client can demand a
          particular <em>representation</em> of the data:
        </p>
        <CodeBlock>{`"Give me this user as JSON"    → Accept: application/json
"Give me this user as XML"     → Accept: application/xml
"Give me this user as CSV"     → Accept: text/csv`}</CodeBlock>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Type</th>
                <th className="pb-3 pr-4 font-medium">What It Is</th>
                <th className="pb-3 font-medium text-[var(--text-muted)]">Example</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--text)]">Internal</td>
                <td className="py-2 pr-4">How your DB stores it</td>
                <td className="py-2 text-xs">Rows, columns, BSON</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-4 font-medium text-[var(--text)]">External</td>
                <td className="py-2 pr-4">How the client receives it</td>
                <td className="py-2 text-xs">JSON, XML, CSV</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Tip>
          The two are independent. Same data, many representations. This decoupling is what
          makes REST APIs flexible and evolvable.
        </Tip>
      </Section>

      {/* 4 */}
      <Section num={4} title="Why REST and HTTP Fit Perfectly">
        <p>REST is protocol-independent. But HTTP gives you everything REST needs:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            ["URLs", "Perfect for identifying resources"],
            ["HTTP methods", "Perfect for specifying actions"],
            ["Headers", "Perfect for representations & metadata"],
            ["Status codes", "Perfect for response semantics"],
          ].map(([what, why], i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3">
              <span className="font-mono text-xs text-[var(--accent)]">{what}</span>
              <span className="text-xs text-[var(--text-muted)]">→ {why}</span>
            </div>
          ))}
        </div>
        <p>So REST is implemented almost universally over HTTP. They&apos;re treated as synonymous in practice.</p>
      </Section>

      {/* 5 */}
      <Section num={5} title="HTTP Verbs in REST — The Core Elegance">
        <p>The same URL means different things based on the HTTP method:</p>
        <CodeBlock>{`GET    /students/1   → Fetch student 1
POST   /students     → Create a new student
PUT    /students/1   → Replace student 1 entirely
PATCH  /students/1   → Update some fields of student 1
DELETE /students/1   → Delete student 1`}</CodeBlock>
        <Callout>
          <strong>One URL, multiple operations</strong> — based purely on the HTTP method.
          The URL identifies the resource. The verb specifies the action. This is the core elegance of REST.
        </Callout>

        <h3 className="pt-2 text-base font-semibold">The Wrong Way (Not REST)</h3>
        <CodeBlock>{`POST /getStudent     { "id": 1 }       ← action in URL
POST /updateStudent  { "id": 1, ... }   ← everything is POST
POST /deleteStudent  { "id": 1 }        ← URL describes action`}</CodeBlock>
        <p className="text-xs text-red-400">
          This uses HTTP but is NOT REST. The URL describes an action, not a resource.
        </p>
      </Section>

      {/* 6 */}
      <Section num={6} title="What You Get for Free with REST over HTTP">
        <p>REST piggybacks on HTTP&apos;s massive ecosystem:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Benefit</th>
                <th className="pb-3 font-medium">Examples</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Tooling", "curl, Postman, axios, requests — no custom clients needed"],
                ["Caching", "nginx, Varnish, CDNs (CloudFront, Cloudflare) — cache HTTP responses out of the box"],
                ["Load Balancing", "nginx, HAProxy, AWS ALB — built around HTTP routing"],
                ["Security", "TLS/SSL, Bearer tokens, OAuth, CORS — all standard"],
                ["Monitoring", "DataDog, distributed tracing — built around HTTP"],
                ["Compression", "gzip, brotli — auto-negotiated via Accept-Encoding"],
              ].map(([benefit, examples], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{benefit}</td>
                  <td className="py-2 text-xs">{examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          If you build a custom protocol, you must reinvent <em>every one</em> of these tools.
          This is why HTTP-based REST dominates public APIs.
        </Tip>
      </Section>

      {/* 7 */}
      <Section num={7} title="Downsides of REST over HTTP">
        <div className="space-y-3">
          {[
            { title: "Consumption is hard", desc: "Every consumer must: make HTTP request → receive raw JSON → manually parse into native objects → handle errors. No auto-generated classes." },
            { title: "Repetitive client code", desc: "Every team rewrites: serialization, error handling, timeouts, retries, auth. RPC frameworks abstract this away." },
            { title: "JSON is verbose", desc: "Repetitive keys in quotes, plain text, slow to parse. Protobuf (gRPC) produces 5-10x smaller messages." },
            { title: "TCP overhead", desc: "Every HTTP request needs a TCP handshake (unless keep-alive). For chatty services, this adds up." },
            { title: "Locked into TCP", desc: "HTTP runs on TCP only. If UDP would be better (real-time, gaming), you can't use REST." },
          ].map((d, i) => (
            <div key={i} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-medium text-red-400">{d.title}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">{d.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 8 */}
      <Section num={8} title="REST vs RPC — When to Use What">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium text-green-400">Use REST when...</th>
                <th className="pb-3 font-medium text-purple-400">Use RPC (gRPC) when...</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Building public APIs", "Building internal microservices"],
                ["Wide variety of clients", "All clients under your control"],
                ["Need browser/curl compatibility", "Need maximum performance"],
                ["Caching is important", "Ultra-low latency is critical"],
                ["Resources map naturally to CRUD", "Operations don't map to CRUD"],
                ["Standard HTTP tooling matters", "Native language objects preferred"],
              ].map(([rest, rpc], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4">{rest}</td>
                  <td className="py-2">{rpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          For most internet-facing applications, REST over HTTP is the right call.
          For internal high-performance service-to-service communication, gRPC often wins.
        </Callout>
      </Section>

      {/* 9 */}
      <Section num={9} title="How REST APIs Appear in System Design">
        <p>
          Every system design problem in the Grokking book defines REST APIs as Step 2
          of the framework. Here&apos;s how they look:
        </p>
        <CodeBlock>{`// URL Shortener
createURL(api_dev_key, original_url, custom_alias, expire_date)
deleteURL(api_dev_key, url_key)

// Twitter
postTweet(api_dev_key, tweet_data, media_ids[])
generateTimeline(user_id, page_token, count)

// YouTube
uploadVideo(api_dev_key, title, description, tags[], video_contents)
searchVideo(api_dev_key, query, max_results, page_token)
streamVideo(api_dev_key, video_id, offset, codec, resolution)`}</CodeBlock>
        <p>Key patterns across all designs:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-muted)]">
          <li><Code>api_dev_key</Code> — for rate limiting and quota management</li>
          <li><Code>page_token</Code> + <Code>count</Code> — pagination for list endpoints</li>
          <li>Return types are JSON objects with relevant data</li>
          <li>Error responses use HTTP status codes (401, 404, 429, 500)</li>
        </ul>
      </Section>

      {/* 10 */}
      <Section num={10} title="The Mental Model">
        <CodeBlock>{`┌─────────────────────────────────────────────┐
│                  REST                       │
│           (specification / philosophy)      │
│                                             │
│  "Resources identified by URLs.             │
│   Actions via verbs. Representations        │
│   via headers. Stateless."                  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │              HTTP                     │  │
│  │    (most common implementation)       │  │
│  │                                       │  │
│  │  URLs → resource identifiers          │  │
│  │  Verbs → GET/POST/PUT/DELETE          │  │
│  │  Headers → Content-Type, Accept       │  │
│  │  Status codes → 200, 404, 500         │  │
│  │                                       │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │            TCP                  │  │  │
│  │  │   (transport layer)             │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

REST = philosophy. HTTP = protocol. TCP = transport.`}</CodeBlock>
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
      <LessonStatus slug="rest-apis" />
      <div className="flex justify-between pt-4">
        <Link href="/tcp-handshake" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">
          ← TCP Handshake
        </Link>
        <Link href="/" className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--accent-dim)]">
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

/* -- Data -- */
const interviewQs = [
  { question: "What is REST?", answer: "A specification (not a protocol) for client-server communication. Everything is a resource, identified by URLs, acted on by HTTP verbs, with client-requested representations. It's stateless — each request carries all info needed to process it." },
  { question: "Why do system design APIs use api_dev_key?", answer: "For rate limiting and abuse prevention. Each key has a quota (e.g., 1000 requests/hour). Without it, a malicious user could exhaust all resources. It also enables per-customer throttling tiers." },
  { question: "Why REST over HTTP instead of a custom protocol?", answer: "HTTP gives you the entire ecosystem for free: caching (CDN), load balancing, monitoring, security (TLS), compression (gzip), and universal tooling (curl, Postman, browsers). A custom protocol means reinventing all of this." },
  { question: "When would you NOT use REST?", answer: "1) Internal microservices needing ultra-low latency → gRPC (binary, smaller payloads). 2) Real-time bi-directional communication → WebSockets. 3) Streaming server→client → SSE. 4) Operations that don't map to CRUD → RPC fits better." },
  { question: "What's the difference between PUT and PATCH?", answer: "PUT replaces the entire resource (you must send all fields). PATCH updates only the specified fields. PUT is idempotent. PATCH can be idempotent but isn't guaranteed to be." },
  { question: "How does pagination work in REST APIs?", answer: "Two common patterns: 1) Offset-based: page=2&limit=20 (simple but slow for large offsets). 2) Cursor-based: page_token=abc123 (better performance, used by Twitter/Facebook APIs). The token encodes position without revealing internals." },
];
