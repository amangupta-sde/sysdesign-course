import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ProgressProvider } from "./progress-context";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "System Design Course",
  description: "Master system design interviews with a structured, beginner-friendly approach",
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/what-is-system-design", label: "What is System Design?" },
  { href: "/interview-framework", label: "Interview Framework" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        <ProgressProvider>
          <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-bold tracking-tight text-[var(--accent)]">
                ⚡ SysDesign
              </Link>
              <div className="flex gap-6 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[var(--text-muted)] transition hover:text-[var(--text)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
          <main className="mx-auto max-w-4xl px-6 py-12">{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
