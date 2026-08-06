"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  {
    title: "Getting Started",
    links: [
      { href: "/getting-started", label: "Installation & Setup" },
      { href: "/docs/core-concepts", label: "Core Concepts" },
      { href: "/why-levi", label: "Why Levi?" },
    ],
  },
  {
    title: "Compute",
    links: [
      { href: "/docs/workers", label: "Workers" },
      { href: "/docs/durable-objects", label: "Durable Objects" },
      { href: "/docs/service-bindings", label: "Service Bindings" },
    ],
  },
  {
    title: "Storage & Data",
    links: [
      { href: "/docs/d1", label: "D1 Databases" },
      { href: "/docs/kv", label: "KV Namespaces" },
      { href: "/docs/r2", label: "R2 Buckets" },
      { href: "/docs/queues", label: "Queues" },
      { href: "/docs/vectorize", label: "Vectorize" },
      { href: "/docs/hyperdrive", label: "Hyperdrive" },
    ],
  },
  {
    title: "AI & Intelligence",
    links: [{ href: "/docs/ai", label: "Workers AI & Gateway" }],
  },
  {
    title: "Network",
    links: [
      { href: "/docs/domains", label: "Domains & SSL" },
      { href: "/docs/environments", label: "Environments" },
    ],
  },
  {
    title: "Edge",
    links: [{ href: "/docs/edge-rules", label: "Edge Rules & Snippets" }],
  },
  {
    title: "Platform",
    links: [
      { href: "/docs/platforms", label: "Workers for Platforms" },
      { href: "/docs/email", label: "Email" },
      { href: "/docs/bindings", label: "More Bindings" },
    ],
  },
  {
    title: "Frameworks",
    links: [
      { href: "/docs/vinext", label: "vinext" },
      { href: "/docs/tanstack", label: "TanStack SPA" },
    ],
  },
  {
    title: "Examples",
    links: [
      { href: "/examples", label: "Example Apps" },
      { href: "/examples/tanstack", label: "TanStack Invoice SaaS" },
    ],
  },
  {
    title: "Beta",
    links: [
      { href: "/docs/containers", label: "Containers" },
      { href: "/docs/pipelines", label: "Pipelines" },
    ],
  },
  {
    title: "Reference",
    links: [
      { href: "/docs/best-practices", label: "Best Practices" },
      { href: "/docs/cli", label: "CLI Commands" },
      { href: "/examples", label: "Examples" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      {sections.map((s) => (
        <div key={s.title}>
          <h4 className="text-xs font-bold text-denim-400 uppercase tracking-widest mb-2">
            {s.title}
          </h4>
          <ul className="space-y-0.5">
            {s.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`block px-3 py-1.5 text-sm rounded-md transition-colors border-l-2 ${
                    pathname === l.href
                      ? "text-wash-300 bg-denim-800/70 border-wash-500"
                      : "text-denim-300 hover:text-denim-100 hover:bg-denim-800/40 border-transparent"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
