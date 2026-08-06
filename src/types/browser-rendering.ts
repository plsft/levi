/**
 * Types for the Browser Rendering binding.
 *
 * @module
 */

/**
 * Options for Browser Rendering.
 *
 * Browser Rendering gives Workers programmatic control of a headless
 * browser (via Puppeteer/Playwright forks) for screenshots, PDF
 * generation, and scraping. It is an account capability — there is
 * nothing to provision; the binding simply enables access.
 *
 * @see https://developers.cloudflare.com/browser-rendering/
 *
 * @example
 * ```ts
 * const browser = app.addBrowserRendering();
 * app.addWorker("scraper", {
 *   entrypoint: "./src/index.ts",
 *   bindings: { BROWSER: browser },
 * });
 * ```
 */
export interface BrowserRenderingOptions {
  /**
   * Default binding name hint used by the dashboard/graph display.
   * The actual binding name always comes from the worker's bindings map key.
   *
   * @default "BROWSER"
   */
  binding?: string;
}
