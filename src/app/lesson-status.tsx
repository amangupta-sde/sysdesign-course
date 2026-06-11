"use client";
import { useProgress, Status } from "./progress-context";

const options: { value: Status; label: string; icon: string; style: string }[] = [
  { value: "not-started", label: "Not Started", icon: "○", style: "border-zinc-600 text-zinc-400" },
  { value: "in-progress", label: "In Progress", icon: "◐", style: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  { value: "complete", label: "Complete", icon: "●", style: "border-green-500/50 text-green-400 bg-green-500/10" },
];

export function LessonStatus({ slug }: { slug: string }) {
  const { progress, setStatus } = useProgress();
  const current = progress[slug] || "not-started";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-3">
      <span className="mr-2 text-xs text-[var(--text-muted)]">Mark as:</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setStatus(slug, o.value)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${o.style} ${
            current === o.value ? "ring-2 ring-offset-1 ring-offset-[var(--bg)]" : "opacity-60 hover:opacity-100"
          }`}
        >
          {o.icon} {o.label}
        </button>
      ))}
    </div>
  );
}
