import Link from "next/link";
import { DocLayout } from "../../components/DocLayout";

const categories = [
  {
    title: "Getting Started",
    description: "Set up Levi and learn the fundamentals",
    cards: [
      {
        href: "/getting-started",
        title: "Installation & Setup",
        desc: "Install the CLI, scaffold a project, and deploy in under 5 minutes.",
      },
      {
        href: "/docs/core-concepts",
        title: "Core Concepts",
        desc: "Understand the App Graph, resources, bindings, and the build pipeline.",
      },
      {
        href: "/why-levi",
        title: "Why Levi?",
        desc: "How Levi compares to Aspire, SST, Alchemy, Terraform, and plain wrangler.",
      },
    ],
  },
  {
    title: "Compute",
    description: "Workers, Durable Objects, and inter-service communication",
    cards: [
      {
        href: "/docs/workers",
        title: "Workers",
        desc: "Define and configure Cloudflare Workers with TypeScript-first APIs.",
      },
      {
        href: "/docs/durable-objects",
        title: "Durable Objects",
        desc: "Stateful, single-threaded actors that persist data at the edge.",
      },
      {
        href: "/docs/service-bindings",
        title: "Service Bindings",
        desc: "Zero-latency, in-process RPC between workers via .asService().",
      },
    ],
  },
  {
    title: "Storage & Data",
    description: "Databases, key-value stores, object storage, and queues",
    cards: [
      {
        href: "/docs/d1",
        title: "D1 Databases",
        desc: "SQLite at the edge with automatic migrations and branching.",
      },
      {
        href: "/docs/kv",
        title: "KV Namespaces",
        desc: "Globally distributed key-value storage for read-heavy workloads.",
      },
      {
        href: "/docs/r2",
        title: "R2 Buckets",
        desc: "S3-compatible object storage with zero egress fees.",
      },
      {
        href: "/docs/queues",
        title: "Queues",
        desc: "Reliable message queues for asynchronous processing pipelines.",
      },
      {
        href: "/docs/vectorize",
        title: "Vectorize",
        desc: "Vector database for embeddings, similarity search, and RAG pipelines.",
      },
      {
        href: "/docs/hyperdrive",
        title: "Hyperdrive",
        desc: "Connection pooling and caching for existing PostgreSQL databases.",
      },
    ],
  },
  {
    title: "AI & Intelligence",
    description: "Machine learning inference and AI gateway",
    cards: [
      {
        href: "/docs/ai",
        title: "Workers AI & Gateway",
        desc: "Run ML models at the edge and route through AI Gateway for observability.",
      },
    ],
  },
  {
    title: "Network",
    description: "Domains, SSL, and environment management",
    cards: [
      {
        href: "/docs/domains",
        title: "Domains & SSL",
        desc: "Custom domains with automatic SSL certificate provisioning.",
      },
      {
        href: "/docs/environments",
        title: "Environments",
        desc: "Staging, production, and preview environments with config isolation.",
      },
    ],
  },
  {
    title: "Edge",
    description: "Zone-level rules and edge code — no Terraform required",
    cards: [
      {
        href: "/docs/edge-rules",
        title: "Edge Rules & Snippets",
        desc: "Redirects, cache rules, WAF, HTTP rate limiting, header transforms, and Snippets — declared in levi.app.ts.",
      },
    ],
  },
  {
    title: "Platform",
    description: "Multi-tenant SaaS, email, and account-level bindings",
    cards: [
      {
        href: "/docs/platforms",
        title: "Workers for Platforms",
        desc: "Dispatch namespaces and outbound workers for running tenant code at scale.",
      },
      {
        href: "/docs/email",
        title: "Email",
        desc: "send_email bindings with Email Routing provisioning and address verification.",
      },
      {
        href: "/docs/bindings",
        title: "More Bindings",
        desc: "Analytics Engine, Browser Rendering, rate limiters, Secrets Store, and tail workers.",
      },
    ],
  },
  {
    title: "Beta",
    description: "Newer Cloudflare primitives with first-class support",
    cards: [
      {
        href: "/docs/containers",
        title: "Containers",
        desc: "Run Docker images alongside Workers, backed by Durable Objects.",
      },
      {
        href: "/docs/pipelines",
        title: "Pipelines",
        desc: "Ingest, transform, and deliver data streams to R2.",
      },
    ],
  },
  {
    title: "Frameworks",
    description: "First-class framework integrations",
    cards: [
      {
        href: "/docs/vinext",
        title: "vinext (Recommended)",
        desc: "Vite-native, SSR-ready React framework built for Cloudflare Workers.",
      },
      {
        href: "/docs/tanstack",
        title: "TanStack SPA",
        desc: "Vite + React + TanStack Query + TanStack Router. Pure client-side SPA.",
      },
    ],
  },
  {
    title: "Reference",
    description: "CLI commands, best practices, and examples",
    cards: [
      {
        href: "/docs/best-practices",
        title: "Best Practices",
        desc: "Platform limits, pricing traps, architecture patterns, and deployment gotchas.",
      },
      {
        href: "/docs/cli",
        title: "CLI Commands",
        desc: "Complete reference for all 9 levi CLI commands with flags and output.",
      },
      {
        href: "/examples",
        title: "Examples",
        desc: "Full-stack application templates and real-world usage patterns.",
      },
    ],
  },
];

export default function DocsIndex() {
  return (
    <DocLayout>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold text-denim-50">Documentation</h1>
          <span className="red-tab">beta</span>
        </div>
        <p className="text-denim-200 text-lg leading-relaxed max-w-2xl">
          Everything you need to declare, build, and deploy your entire
          Cloudflare application topology in TypeScript. Levi is{" "}
          <strong>Aspire for Cloudflare</strong> — define resources in code
          and let the framework handle the rest.
        </p>
      </div>

      <div className="stitch-separator mb-10" />

      {/* Quick links */}
      <div className="denim-pocket p-5 mb-10">
        <h2 className="text-sm font-bold text-denim-300 uppercase tracking-widest mb-3"
            style={{ marginTop: 0, borderBottom: "none", paddingBottom: 0 }}>
          Quick Start
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/getting-started"
            className="px-4 py-2 text-sm bg-wash-600/20 border border-dashed border-wash-500 rounded-md text-wash-300 hover:bg-wash-600/30 transition-colors"
          >
            npx @flarefound/levi init
          </Link>
          <Link
            href="/docs/core-concepts"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            Read Core Concepts
          </Link>
          <Link
            href="/docs/cli"
            className="px-4 py-2 text-sm bg-denim-800/50 border border-dashed border-denim-600 rounded-md text-denim-200 hover:bg-denim-800/70 transition-colors"
          >
            CLI Reference
          </Link>
        </div>
      </div>

      {/* Category sections */}
      {categories.map((cat) => (
        <section key={cat.title} className="mb-12">
          <h2 className="text-xl font-bold text-denim-50 mb-1">
            {cat.title}
          </h2>
          <p className="text-sm text-denim-400 mb-5">{cat.description}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block stitch-border rounded-lg p-5 bg-denim-900/50 hover:bg-denim-800/60 transition-all hover:border-wash-400"
              >
                <h3 className="text-base font-semibold text-denim-100 group-hover:text-wash-300 transition-colors mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-denim-300 leading-relaxed">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <div className="stitch-separator mb-8" />

      {/* Footer note */}
      <div className="text-sm text-denim-400 leading-relaxed">
        <p>
          Levi is open source.{" "}
          <a
            href="https://github.com/plsft/levi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wash-400 hover:text-wash-300"
          >
            Star on GitHub
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/plsft/levi/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-wash-400 hover:text-wash-300"
          >
            file an issue
          </a>{" "}
          if you find a bug or want a feature. The docs pages are generated
          from the same codebase as the framework itself — pull requests
          welcome.
        </p>
      </div>
    </DocLayout>
  );
}
