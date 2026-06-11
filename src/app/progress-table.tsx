"use client";
import { useProgress, Status } from "./progress-context";
import Link from "next/link";

const lessons = [
  { slug: "what-is-system-design", title: "What is System Design?", href: "/what-is-system-design" },
  { slug: "interview-framework", title: "Interview Framework", href: "/interview-framework" },
  { slug: "dns", title: "DNS — The Internet's Phone Book", href: "/dns" },
  { slug: "http-protocols", title: "HTTP & Protocols", href: "/http-protocols" },
  { slug: "tcp-handshake", title: "TCP Handshake", href: "/tcp-handshake" },
  { slug: "rest-apis", title: "REST & REST over HTTP", href: "/rest-apis" },
  { slug: "monolith-vs-microservices", title: "Monolith vs Microservices", href: "/monolith-vs-microservices" },
  { slug: "cdn", title: "CDN — Content Delivery Networks", href: "/cdn" },
  { slug: "proxies", title: "Proxies — Forward & Reverse", href: "/proxies" },
  { slug: "url-shortener", title: "URL Shortener", href: "#" },
  { slug: "instagram", title: "Instagram", href: "#" },
  { slug: "chat-system", title: "Chat System", href: "#" },
  { slug: "twitter", title: "Twitter", href: "#" },
];

const statusConfig: Record<Status, { label: string; dot: string; text: string }> = {
  "not-started": { label: "Not Started", dot: "bg-zinc-600", text: "text-zinc-500" },
  "in-progress": { label: "In Progress", dot: "bg-yellow-400", text: "text-yellow-400" },
  complete: { label: "Complete", dot: "bg-green-400", text: "text-green-400" },
};

export function ProgressTable() {
  const { progress } = useProgress();

  const total = lessons.length;
  const completed = lessons.filter((l) => progress[l.slug] === "complete").length;
  const inProgress = lessons.filter((l) => progress[l.slug] === "in-progress").length;
  const pct = Math.round((completed / total) * 100);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Progress</h2>
        <span className="text-sm text-[var(--text-muted)]">
          {completed}/{total} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-hover)]">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-4 text-xs text-[var(--text-muted)]">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-green-400" /> {completed} Complete</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-yellow-400" /> {inProgress} In Progress</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-zinc-600" /> {total - completed - inProgress} Not Started</span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
        {lessons.map((l, i) => {
          const status = progress[l.slug] || "not-started";
          const cfg = statusConfig[status];
          return (
            <Link
              key={l.slug}
              href={l.href}
              className={`flex items-center justify-between border-b border-[var(--border)]/50 px-4 py-3 transition last:border-0 hover:bg-[var(--bg-hover)] ${
                l.href === "#" ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium">{l.title}</span>
              </div>
              <span className={`flex items-center gap-1.5 text-xs ${cfg.text}`}>
                <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
