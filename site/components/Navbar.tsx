"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/getting-started", label: "Get Started" },
  { href: "/docs", label: "Docs" },
  { href: "/examples", label: "Examples" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="sticky top-0 z-50 border-b border-denim-800 bg-denim-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold tracking-tight text-denim-50 group-hover:text-wash-300 transition-colors">
              levi
            </span>
            <span className="red-tab">beta</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "text-wash-300 bg-denim-800/60"
                    : "text-denim-300 hover:text-denim-100 hover:bg-denim-800/40"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="w-px h-6 bg-denim-700 mx-2" />

            <a
              href="https://github.com/plsft/levi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md text-sm font-medium text-denim-300 hover:text-denim-100 hover:bg-denim-800/40 transition-colors"
            >
              GitHub
            </a>

            <a
              href="https://www.npmjs.com/package/@flarefound/levi"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-wash-600 text-white hover:bg-wash-500 transition-colors border-2 border-dashed border-wash-400"
            >
              npm install
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-denim-300 hover:text-denim-100 p-2"
            onClick={() => setOpen(!open)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="md:hidden pb-4 border-t border-denim-800 mt-2 pt-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-4 py-2 rounded-md text-sm font-medium mb-1 ${
                  isActive(l.href)
                    ? "text-wash-300 bg-denim-800/60"
                    : "text-denim-300"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
