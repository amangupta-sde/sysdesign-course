import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "HTTP & Protocols | SysDesign Course" };

export default function HTTPPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">HTTP & Protocols</h1>
        <p className="text-lg text-[var(--text-muted)]">
          How machines agree on a language — from raw TCP bytes to structured web communication.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="What Is a Protocol?">
        <p>
          When two machines communicate, they first establish a <strong>TCP connection</strong>.
          But TCP only delivers raw bytes — it doesn&apos;t tell machine B what machine A is asking for.
        </p>
        <p>
          For B to understand A, both must agree on a <strong>common language</strong> — a structured
          format for what bytes mean. That agreement is called a <strong>protocol</strong>.
        </p>
        <Callout>
          A protocol is just: <em>&quot;A common, agreed-upon format that two machines use to understand each other.&quot;</em>
        </Callout>

        <h3 className="pt-2 text-base font-semibold">Real-Life Analogy</h3>
        <p>
          If you send <Code>add 2 3\n</Code> and the receiver knows: &quot;first word = command,
          rest = arguments, respond with result + newline&quot; — you get back <Code>5\n</Code>.
          You&apos;ve just defined a protocol.
        </p>
        <Tip>
          This is essentially Redis&apos;s RESP protocol — when you <Code>SET key value</Code>,
          you&apos;re sending structured bytes over a TCP connection that Redis knows how to parse.
        </Tip>
      </Section>

      {/* 2 */}
      <Section num={2} title="HTTP Is Just a Protocol">
        <p>HTTP works the exact same way:</p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>Client initiates a <strong>TCP connection</strong> to the server</li>
          <li>Client sends a <strong>structured message</strong> describing what it wants</li>
          <li>Server interprets the message, processes it, sends back a <strong>structured response</strong></li>
        </ol>
        <p>
          The HTTP specification defines exactly how these messages look. It&apos;s the foundational
          protocol for transmitting data on the World Wide Web.
        </p>
      </Section>

      {/* 3 */}
      <Section num={3} title="Structure of an HTTP Request">
        <CodeBlock>{`<METHOD> <URL> <HTTP_VERSION>\\r\\n
<Header-Name>: <Header-Value>\\r\\n
<Header-Name>: <Header-Value>\\r\\n
\\r\\n
<body if any>`}</CodeBlock>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Part</th>
                <th className="pb-3 pr-4 font-medium">Example</th>
                <th className="pb-3 font-medium text-[var(--text-muted)]">Purpose</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Method", "GET, POST, PUT, DELETE", "What action to perform"],
                ["URL/Path", "/foo, /login", "Which resource on the server"],
                ["HTTP Version", "HTTP/1.1", "Which version of the protocol"],
                ["Headers", "Host: localhost", "Metadata about the request"],
                ["Empty line (\\r\\n)", "(blank line)", "Marks end of headers / start of body"],
                ["Body", "{\"user\":\"earth\"}", "Data for POST/PUT requests"],
              ].map(([part, example, purpose], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{part}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{example}</td>
                  <td className="py-2">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ExampleBox title="Real GET Request">
          <pre className="font-mono text-xs">{`GET / HTTP/1.1
Host: www.facebook.com
User-Agent: Mozilla/5.0 ...
Accept: text/html
\\r\\n`}</pre>
        </ExampleBox>
      </Section>

      {/* 4 */}
      <Section num={4} title="Important Headers">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Header</th>
                <th className="pb-3 font-medium">What It Does</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Content-Type", "Tells server how to parse the body (JSON, form data, plain text)"],
                ["Content-Length", "How many bytes the body is — TCP is a stream, so server needs to know when body ends"],
                ["Host", "Which domain this request is for (one IP can serve multiple domains)"],
                ["Authorization", "Credentials (Bearer token, Basic auth)"],
                ["User-Agent", "What client is making the request (browser, bot, curl)"],
                ["Accept", "What response format the client wants (text/html, application/json)"],
              ].map(([header, desc], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{header}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          <Code>Content-Length</Code> is critical for POST requests. TCP is a continuous byte stream —
          without it, the server doesn&apos;t know how many bytes constitute the body.
        </Tip>
      </Section>

      {/* 5 */}
      <Section num={5} title="The Full Request-Response Cycle">
        <p className="font-medium text-[var(--text)]">When you type www.facebook.com:</p>
        <CodeBlock>{`1. DNS resolution → browser gets Facebook's IP
2. TCP connection to that IP (port 443 for HTTPS)
3. TLS handshake (for HTTPS — encryption)
4. Browser composes HTTP request per the spec
5. Sends request bytes over the connection
6. Server parses request, runs business logic
7. Server sends HTTP response (status + headers + body)
8. Browser parses response, renders HTML`}</CodeBlock>
        <Callout>
          This happens every time you click a link — it&apos;s just bytes over a TCP connection
          in an agreed-upon format. There&apos;s no magic.
        </Callout>
      </Section>

      {/* 6 */}
      <Section num={6} title="HTTP Versions">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Version</th>
                <th className="pb-3 font-medium">Key Changes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["HTTP/1.0", "One request per TCP connection (slow — new connection every time)"],
                ["HTTP/1.1", "Persistent connections, pipelining (reuse the same connection)"],
                ["HTTP/2", "Binary framing, multiplexing (many requests on one connection), header compression"],
                ["HTTP/3", "Built on QUIC (UDP-based), faster connection setup, better on mobile/lossy networks"],
              ].map(([v, desc], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono font-medium text-[var(--accent)]">{v}</td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Each version is a different way of formatting messages — but the fundamental
          model (client requests, server responds) is the same.
        </p>
      </Section>

      {/* 7 */}
      <Section num={7} title="Custom Protocols">
        <p>
          HTTP isn&apos;t special — you can invent your own protocol. You just need:
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          <li>A <strong>specification</strong> — what messages look like</li>
          <li>A <strong>server</strong> that parses your spec</li>
          <li>A <strong>client</strong> that formats messages per your spec</li>
        </ol>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Protocol</th>
                <th className="pb-3 font-medium">Used By</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["RESP", "Redis — its own text protocol over TCP"],
                ["MySQL wire protocol", "MySQL — why you need MySQL drivers"],
                ["PostgreSQL protocol", "PostgreSQL — its own protocol"],
                ["gRPC", "Built on HTTP/2, used for service-to-service calls"],
              ].map(([proto, used], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-mono text-xs text-[var(--accent)]">{proto}</td>
                  <td className="py-2">{used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          HTTP wins for the web because it&apos;s a global standard every browser implements.
          Custom protocols require custom clients (drivers/SDKs).
        </Callout>
      </Section>

      {/* 8 - Real-time communication (from the book) */}
      <Section num={8} title="Beyond Request-Response: Real-Time Communication">
        <p>
          Standard HTTP is request-response: client asks, server replies. But what about
          real-time updates (chat messages, live scores, notifications)? The book covers
          four patterns used in system design:
        </p>

        <div className="space-y-4">
          {/* Polling */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h4 className="text-sm font-semibold text-[var(--text)]">1. Ajax Polling</h4>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Client repeatedly asks the server at regular intervals (e.g., every 0.5s).
              Simple but wasteful — most responses are empty.
            </p>
            <CodeBlock>{`Client: "Any new messages?" → Server: "No"
Client: "Any new messages?" → Server: "No"
Client: "Any new messages?" → Server: "Yes! Here's one"`}</CodeBlock>
            <p className="mt-2 text-xs text-red-400">Problem: Tons of empty responses, wasted bandwidth.</p>
          </div>

          {/* Long Polling */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h4 className="text-sm font-semibold text-[var(--text)]">2. HTTP Long Polling</h4>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Client sends request, server <strong>holds it open</strong> until data is available
              (or timeout). Once responded, client immediately sends a new request.
            </p>
            <CodeBlock>{`Client: "Any new messages?" → Server: ...(waits)...
                              → Server: "Yes! Here's one" (after 30s)
Client: "Any new messages?" → Server: ...(waits)...`}</CodeBlock>
            <p className="mt-2 text-xs text-green-400">
              Used in: Facebook Messenger design, Dropbox sync notifications.
            </p>
          </div>

          {/* WebSockets */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h4 className="text-sm font-semibold text-[var(--text)]">3. WebSockets</h4>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              <strong>Full-duplex</strong> communication over a single TCP connection. After an
              HTTP handshake upgrades the connection, both sides can send data at any time.
            </p>
            <CodeBlock>{`Client ←→ Server (persistent, bi-directional)

Either side can send at any time — no request needed.
Lowest latency, best for chat/gaming/live collab.`}</CodeBlock>
            <p className="mt-2 text-xs text-green-400">
              Used in: Chat systems, real-time collaboration, live dashboards.
            </p>
          </div>

          {/* SSE */}
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <h4 className="text-sm font-semibold text-[var(--text)]">4. Server-Sent Events (SSE)</h4>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Client opens a persistent connection; server pushes data whenever available.
              <strong> One-directional</strong> — server → client only.
            </p>
            <CodeBlock>{`Client opens connection → Server streams events as they happen

Client cannot send via this connection.
If client needs to send data, use a separate HTTP request.`}</CodeBlock>
            <p className="mt-2 text-xs text-green-400">
              Used in: News feeds, live score updates, stock tickers.
            </p>
          </div>
        </div>

        {/* Comparison */}
        <h3 className="pt-2 text-base font-semibold">When to Use What</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 pr-3 font-medium">Pattern</th>
                <th className="pb-2 pr-3 font-medium">Direction</th>
                <th className="pb-2 pr-3 font-medium">Latency</th>
                <th className="pb-2 font-medium">Use When</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">Polling</td>
                <td className="py-2 pr-3">Client → Server</td>
                <td className="py-2 pr-3 text-red-400">High</td>
                <td className="py-2">Simple use cases, acceptable delay</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">Long Polling</td>
                <td className="py-2 pr-3">Server → Client (per request)</td>
                <td className="py-2 pr-3 text-yellow-400">Medium</td>
                <td className="py-2">Notifications, infrequent updates</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">WebSockets</td>
                <td className="py-2 pr-3">Bi-directional</td>
                <td className="py-2 pr-3 text-green-400">Lowest</td>
                <td className="py-2">Chat, gaming, real-time collab</td>
              </tr>
              <tr className="border-b border-[var(--border)]/50">
                <td className="py-2 pr-3 font-medium text-[var(--text)]">SSE</td>
                <td className="py-2 pr-3">Server → Client only</td>
                <td className="py-2 pr-3 text-green-400">Low</td>
                <td className="py-2">Live feeds, streaming updates</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="How This Shows Up in System Design Interviews">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Problem</th>
                <th className="pb-3 font-medium">Protocol Choice</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Facebook Messenger / WhatsApp", "WebSockets for real-time messaging; Long Polling as fallback"],
                ["Dropbox / Google Drive", "Long Polling for sync notifications between devices"],
                ["Twitter / Instagram Feed", "SSE or Long Polling for new post notifications"],
                ["Uber driver location", "WebSockets for continuous location streaming"],
                ["URL Shortener", "Simple HTTP request-response (no real-time needed)"],
                ["Notification System", "Long Polling or Push Notifications (mobile)"],
              ].map(([problem, choice], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{problem}</td>
                  <td className="py-2">{choice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* 11 - Quick Reference */}
      <Section num={11} title="Quick Reference">
        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            {[
              ["HTTP", "Protocol for web traffic (request-response)"],
              ["TCP", "Reliable byte stream (HTTP runs on top of it)"],
              ["HTTPS", "HTTP + TLS encryption"],
              ["WebSocket", "Full-duplex persistent connection"],
              ["Long Polling", "Server holds request until data available"],
              ["SSE", "Server pushes events over persistent connection"],
              ["Content-Type", "Tells server how to parse the body"],
              ["Content-Length", "How many body bytes to read"],
              ["gRPC", "HTTP/2 based, binary, service-to-service"],
              ["QUIC", "UDP-based transport for HTTP/3"],
            ].map(([term, meaning], i) => (
              <div key={i} className="flex gap-2">
                <span className="shrink-0 font-mono font-medium text-[var(--accent)]">{term}</span>
                <span className="text-[var(--text-muted)]">— {meaning}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Status + Nav */}
      <LessonStatus slug="http-protocols" />
      <div className="flex justify-between pt-4">
        <Link href="/dns" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">
          ← DNS
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

function ExampleBox({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-hover)] p-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{title}</p><div className="text-sm text-[var(--text-muted)]">{children}</div></div>;
}

/* -- Data -- */

const interviewQs = [
  { question: "What's the relationship between TCP and HTTP?", answer: "TCP provides a reliable byte stream between two machines. HTTP sits on top of TCP, defining the structure of messages exchanged over that stream. TCP delivers the bytes; HTTP defines what those bytes mean." },
  { question: "Why is Content-Length needed for POST requests?", answer: "TCP is a continuous byte stream — there's no inherent 'end of message' marker. Without Content-Length, the server doesn't know how many bytes constitute the body. The header tells the server exactly how many bytes to read after the headers end." },
  { question: "Walk through what happens when you type www.facebook.com in your browser.", answer: "1) DNS resolves domain to IP. 2) Browser opens TCP connection to that IP on port 443. 3) TLS handshake for encryption. 4) Browser composes HTTP request per spec. 5) Server parses request, runs logic, builds response. 6) Server sends HTTP response. 7) Browser renders HTML." },
  { question: "When would you use WebSockets vs Long Polling?", answer: "WebSockets: when you need bi-directional, low-latency, persistent communication (chat, gaming, collaboration). Long Polling: when updates are infrequent and you don't need the client to push data (notifications, sync triggers). WebSockets have higher server cost (persistent connections) but lower latency." },
  { question: "Why can't you just use HTTP polling for a chat application?", answer: "Polling at high frequency (every 100ms) wastes bandwidth — most responses are empty. At low frequency (every 5s), latency is unacceptable for chat. WebSockets or Long Polling solve this by only transferring data when there IS data, with no wasted requests." },
  { question: "What is HTTP/2 multiplexing and why does it matter?", answer: "HTTP/1.1 processes requests sequentially on a connection (head-of-line blocking). HTTP/2 allows multiple requests/responses to be interleaved on a single connection via binary frames. This eliminates the need to open 6+ parallel connections per domain that browsers do with HTTP/1.1." },
];
