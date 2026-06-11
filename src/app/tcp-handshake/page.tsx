import Link from "next/link";
import { LessonStatus } from "../lesson-status";

export const metadata = { title: "TCP Handshake | SysDesign Course" };

export default function TCPPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-medium text-[var(--accent)]">Fundamentals</p>
        <h1 className="text-3xl font-bold sm:text-4xl">TCP Handshake</h1>
        <p className="text-lg text-[var(--text-muted)]">
          The 3-packet handshake that happens before every HTTP request — and why it&apos;s one of the biggest sources of latency.
        </p>
      </header>

      {/* 1 */}
      <Section num={1} title="Why Does the TCP Handshake Exist?">
        <p>
          Before any HTTP data flows, the <strong>very first thing</strong> that happens is the TCP handshake.
          This applies to HTTP/1.1 and HTTP/2 (both run over TCP). HTTP/3 uses QUIC (UDP) and avoids it entirely.
        </p>
        <Callout>
          The TCP handshake is one of the most expensive things that slows down applications —
          especially when opening/closing many connections. Understanding it is critical for backend performance.
        </Callout>
      </Section>

      {/* 2 */}
      <Section num={2} title="The Core Problem TCP Solves">
        <p>When a client sends data to a server, packets travel over the unreliable internet:</p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Packets may arrive <strong>out of order</strong></li>
          <li>Packets may <strong>never arrive</strong></li>
          <li>Packets may arrive <strong>corrupted</strong></li>
        </ul>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Problem</th>
                <th className="pb-3 font-medium">Solution</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["How to know if a packet arrived?", "ACK — server sends acknowledgment. No ACK = retransmit."],
                ["How to identify each packet?", "Sequence numbers — every packet carries a unique number."],
                ["Packets arrive out of order?", "Sequence numbers — receiver reorders before passing to app."],
                ["How does server know the first seq number?", "Synchronize — both sides agree on starting numbers first."],
              ].map(([p, s], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{p}</td>
                  <td className="py-2">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout>
          This <strong>synchronization step</strong> — agreeing on starting sequence numbers — is exactly what the TCP handshake does.
        </Callout>
      </Section>

      {/* 3 */}
      <Section num={3} title="Why Random Starting Sequence Numbers?">
        <p>Why not both start at 0? Because predictable numbers enable attacks:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400">Replay attacks</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Attacker re-sends old captured packets</p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400">Session hijacking</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Attacker injects forged packets by guessing sequence</p>
          </div>
        </div>
        <p>Random ISNs (Initial Sequence Numbers) make it much harder for attackers to inject valid packets.</p>
      </Section>

      {/* 4 */}
      <Section num={4} title="The 3-Way Handshake">
        <p>Both sides need to: tell the other their starting sequence number, and acknowledge they received the other&apos;s.</p>
        <p className="text-xs text-[var(--text-muted)]">A naive version needs 4 messages. Engineers combined 2 of them → <strong>3-way handshake</strong>.</p>

        <CodeBlock>{`Client (ISN = 700)                     Server (ISN = 200)
    │                                          │
    │  1. SYN, seq=700  ─────────────────►     │
    │                                          │
    │  ◄───── 2. SYN-ACK, seq=200, ack=701    │
    │                                          │
    │  3. ACK, ack=201  ─────────────────►     │
    │                                          │
    │     ✅ Connection Established            │
    │                                          │
    │  4. GET / HTTP/1.1 (seq=701) ──────►     │
    │  ◄───── ACK 711 (got 10-byte GET)        │`}</CodeBlock>
      </Section>

      {/* 5 */}
      <Section num={5} title="The Three Steps Explained">
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">1</span>
              <h4 className="text-sm font-semibold">Client Sends SYN</h4>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Client picks random ISN (e.g., 700). Sends packet with SYN flag and <Code>seq=700</Code>.<br />
              <em>&quot;I want to start a connection. My sequence numbers begin at 700.&quot;</em>
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400">2</span>
              <h4 className="text-sm font-semibold">Server Responds with SYN-ACK</h4>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Server picks its own ISN (e.g., 200). Sends ONE packet with both SYN + ACK flags:<br />
              <Code>seq=200</Code> (server&apos;s ISN) + <Code>ack=701</Code> (acknowledging client&apos;s SYN).<br />
              <em>&quot;Got your SYN. My sequence numbers begin at 200.&quot;</em>
            </p>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-400">3</span>
              <h4 className="text-sm font-semibold">Client Sends Final ACK</h4>
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              Client sends <Code>ack=201</Code> (acknowledging server&apos;s SYN).<br />
              <em>&quot;Got your SYN. We&apos;re now synchronized. Let&apos;s go.&quot;</em>
            </p>
          </div>
        </div>
      </Section>

      {/* 6 */}
      <Section num={6} title='The "+1 Ghost Byte" Quirk'>
        <p>ACKs are always <Code>(received seq) + 1</Code>, even though SYN has no actual data:</p>
        <CodeBlock>{`Client sends: seq=700 (SYN, 0 bytes data)
Server ACKs:  701    ← not 700!

The SYN flag counts as a "phantom byte."

For real data:
  ACK = (received seq) + (data length)

Example: Client sends GET (seq=701, 10 bytes)
         Server ACKs: 711  (701 + 10)`}</CodeBlock>
      </Section>

      {/* 7 */}
      <Section num={7} title="Why 3-Way, Not 2-Way?">
        <p>Why not just:</p>
        <CodeBlock>{`1. Client → "My seq is 700"
2. Server → "OK, my seq is 200"  ← done?`}</CodeBlock>
        <p>
          Because the <strong>server doesn&apos;t know if its SYN reached the client</strong>.
          The 3rd ACK confirms it. Without it → <strong>half-open connections</strong> where
          server thinks it&apos;s connected but client never got its SYN.
        </p>
      </Section>

      {/* 8 */}
      <Section num={8} title="The Performance Cost">
        <p>The handshake takes <strong>~1 RTT</strong> before any data flows:</p>
        <CodeBlock>{`T=0ms    Client: SYN ──────────────────────►
T=50ms   ◄──────────── SYN-ACK (server)
T=100ms  ACK ──────────────────────────────►  [connection ready]
T=100ms  GET / HTTP/1.1 ──────────────────►   [actual request]
T=150ms  ◄──────────── 200 OK

~100ms wasted on handshake before any HTTP data is sent.`}</CodeBlock>

        <Callout>
          100 requests with new connections = <strong>100 × RTT extra latency</strong>.
          This is why connection reuse matters so much.
        </Callout>

        <h3 className="pt-2 text-base font-semibold">Solutions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Solution</th>
                <th className="pb-3 font-medium">How It Helps</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["HTTP/1.1 keep-alive", "Reuse connections across requests (1 handshake per server)"],
                ["HTTP/2 multiplexing", "Multiple requests over one connection simultaneously"],
                ["Connection pooling", "Pre-established connections ready to use (DB pools, etc.)"],
                ["HTTP/3 (QUIC)", "Merges connection + TLS into 1 RTT (or 0 RTT resumed). No TCP at all."],
              ].map(([sol, how], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{sol}</td>
                  <td className="py-2">{how}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 9 */}
      <Section num={9} title="Connection Termination (4-Way FIN)">
        <p>After data flows, TCP closes with a <strong>4-way FIN handshake</strong>:</p>
        <CodeBlock>{`Client → FIN    ("I'm done sending")
Server → ACK    ("Got it")
Server → FIN    ("I'm done too")
Client → ACK    ("Got it, goodbye")`}</CodeBlock>
        <p>
          Combined with opening: <strong>5+ extra packets per connection</strong> beyond actual data.
          This is why connection reuse is one of the first optimizations in any high-performance system.
        </p>
      </Section>

      {/* 10 */}
      <Section num={10} title="TCP vs QUIC (HTTP/3)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Feature</th>
                <th className="pb-3 pr-4 font-medium">TCP</th>
                <th className="pb-3 font-medium text-green-400">QUIC (HTTP/3)</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Connection setup", "1 RTT (handshake) + 1 RTT (TLS) = 2 RTT", "1 RTT combined (or 0 RTT resumed)"],
                ["Head-of-line blocking", "Yes (one lost packet blocks all)", "No (streams are independent)"],
                ["Transport", "TCP", "UDP"],
                ["Connection migration", "Breaks on IP change (mobile)", "Survives network switches"],
              ].map(([feature, tcp, quic], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{feature}</td>
                  <td className="py-2 pr-4">{tcp}</td>
                  <td className="py-2 text-green-400">{quic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tip>
          This is one of the biggest reasons the web is moving to HTTP/3 — eliminating the TCP
          handshake significantly speeds up real-world page loads, especially on mobile.
        </Tip>
      </Section>

      {/* 11 */}
      <Section num={11} title="System Design Relevance">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-3 pr-4 font-medium">Context</th>
                <th className="pb-3 font-medium">Why TCP Handshake Matters</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-muted)]">
              {[
                ["Database connections", "DB pools pre-establish TCP connections to avoid per-query handshake cost"],
                ["Microservices", "Service mesh / sidecar proxies maintain persistent connections between services"],
                ["CDN", "Edge servers near users reduce RTT, making handshakes cheaper"],
                ["Chat systems", "WebSockets do ONE handshake then keep the connection open indefinitely"],
                ["Load balancers", "L4 LBs work at TCP level; L7 LBs terminate TCP and re-establish to backend"],
                ["Web crawlers", "Millions of new connections = millions of handshakes; connection reuse is critical"],
              ].map(([ctx, why], i) => (
                <tr key={i} className="border-b border-[var(--border)]/50">
                  <td className="py-2 pr-4 font-medium text-[var(--text)]">{ctx}</td>
                  <td className="py-2">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Status + Nav */}
      <LessonStatus slug="tcp-handshake" />
      <div className="flex justify-between pt-4">
        <Link href="/http-protocols" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm transition hover:bg-[var(--bg-hover)]">
          ← HTTP & Protocols
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
