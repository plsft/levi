import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-denim-800 mt-20">
      <div className="stitch-separator" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-denim-50">levi</span>
              <span className="red-tab">oss</span>
            </div>
            <p className="text-sm text-denim-400 leading-relaxed">
              The AppHost Framework for Cloudflare.
              <br />
              Aspire for Cloudflare.
            </p>
          </div>

          {/* Docs */}
          <div>
            <h4 className="text-sm font-semibold text-denim-200 mb-3 uppercase tracking-wider">
              Documentation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/getting-started"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/core-concepts"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  Core Concepts
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/cli"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  CLI Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/vinext"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  vinext Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-denim-200 mb-3 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/docs/workers"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  Workers
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/d1"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  D1 Databases
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/kv"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  KV Namespaces
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/r2"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  R2 Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-denim-200 mb-3 uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/plsft/levi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@flarefound/levi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  npm
                </a>
              </li>
              <li>
                <a
                  href="https://flarefound.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  Flarefound
                </a>
              </li>
              <li>
                <a
                  href="/llms.txt"
                  className="text-sm text-denim-400 hover:text-wash-400 transition-colors"
                >
                  llms.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-denim-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-denim-500">
            &copy; {new Date().getFullYear()}{" "}
            <a
              href="https://flarefound.com"
              className="hover:text-wash-400 transition-colors"
            >
              Flarefound
            </a>
            . MIT License.
          </p>
          <p className="text-xs text-denim-600">
            Built with <span className="text-wash-500">vinext</span> &middot;
            Deployed on{" "}
            <span className="text-wash-500">Cloudflare Workers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
