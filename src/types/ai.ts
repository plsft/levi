/**
 * Type definitions for Cloudflare Workers AI and AI Gateway in Levi.
 *
 * Workers AI provides serverless GPU inference for a catalog of open
 * models. AI Gateway is an observability and control plane that sits
 * in front of any AI API (Workers AI, OpenAI, Anthropic, etc.).
 *
 * @module
 * @see https://developers.cloudflare.com/workers-ai/
 * @see https://developers.cloudflare.com/ai-gateway/
 */

// ---------------------------------------------------------------------------
// Workers AI Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Workers AI binding.
 *
 * Passed to `app.addWorkersAI()` to declare a Workers AI binding in
 * the app graph. Workers AI provides access to Cloudflare's catalog of
 * serverless AI models (LLMs, embedding models, image generation, etc.).
 *
 * @example
 * ```ts
 * // With default binding name
 * const ai = app.addWorkersAI();
 *
 * // With custom binding name
 * const ai = app.addWorkersAI({ binding: "MODELS" });
 * ```
 */
export interface WorkersAIOptions {
  /**
   * Binding name exposed in the Worker's `env` object.
   *
   * The Worker accesses the AI binding as `env[binding]`.
   *
   * @default "AI"
   * @example "AI"
   * @example "MODELS"
   */
  binding?: string;
}

// ---------------------------------------------------------------------------
// AI Gateway Rate Limiting
// ---------------------------------------------------------------------------

/**
 * Rate limiting configuration for an AI Gateway.
 *
 * Controls how many requests per time period are allowed through the
 * gateway. Excess requests receive a 429 response.
 *
 * @see https://developers.cloudflare.com/ai-gateway/configuration/rate-limiting/
 */
export interface AIGatewayRateLimitConfig {
  /**
   * Enable rate limiting on this gateway.
   */
  enabled: boolean;

  /**
   * Maximum number of requests allowed per time period.
   *
   * @minimum 1
   * @example 100
   */
  limit?: number;

  /**
   * Time period in seconds for the rate limit window.
   *
   * @minimum 1
   * @example 60 — 100 requests per minute
   */
  period?: number;
}

// ---------------------------------------------------------------------------
// AI Gateway Caching
// ---------------------------------------------------------------------------

/**
 * Caching configuration for an AI Gateway.
 *
 * When enabled, identical requests to the same model with the same
 * parameters return cached responses, reducing cost and latency.
 *
 * @see https://developers.cloudflare.com/ai-gateway/configuration/caching/
 */
export interface AIGatewayCachingConfig {
  /**
   * Enable response caching on this gateway.
   */
  enabled: boolean;

  /**
   * Cache time-to-live in seconds.
   *
   * Cached responses are evicted after this duration.
   *
   * @minimum 1
   * @example 3600 — cache for 1 hour
   */
  ttl?: number;
}

// ---------------------------------------------------------------------------
// AI Gateway Log Collection
// ---------------------------------------------------------------------------

/**
 * Log collection configuration for an AI Gateway.
 *
 * When enabled, all requests and responses flowing through the gateway
 * are logged for observability, debugging, and analytics.
 *
 * @see https://developers.cloudflare.com/ai-gateway/configuration/logging/
 */
export interface AIGatewayLogCollectionConfig {
  /**
   * Enable log collection on this gateway.
   *
   * Logs include request parameters, response bodies, latency, token
   * counts, and cost estimates.
   */
  enabled: boolean;
}

// ---------------------------------------------------------------------------
// AI Gateway Options
// ---------------------------------------------------------------------------

/**
 * Configuration options for a Cloudflare AI Gateway.
 *
 * Passed to `app.addAIGateway()` to declare an AI Gateway in the app
 * graph. AI Gateway acts as a proxy for AI API calls, providing
 * caching, rate limiting, logging, and analytics.
 *
 * @example
 * ```ts
 * const gateway = app.addAIGateway("my-gateway", {
 *   id: "my-gateway",
 *   rateLimiting: { enabled: true, limit: 100, period: 60 },
 *   caching: { enabled: true, ttl: 3600 },
 *   logCollection: { enabled: true },
 * });
 * ```
 */
export interface AIGatewayOptions {
  /**
   * The AI Gateway identifier / slug.
   *
   * This is the gateway slug used in the AI Gateway URL:
   * `https://gateway.ai.cloudflare.com/v1/{account_id}/{id}/`
   *
   * Must be unique within the Cloudflare account.
   *
   * @example "my-gateway"
   * @example "production-llm"
   */
  id: string;

  /**
   * Existing AI Gateway ID to reference when generating wrangler config.
   *
   * When set, the generated wrangler.jsonc AI binding includes a `gateway`
   * block pointing to this ID. If omitted, Levi uses the `id` field.
   *
   * @example "my-gateway"
   */
  gatewayId?: string;

  /**
   * Rate limiting configuration for the gateway.
   *
   * Controls how many requests per time period are allowed.
   */
  rateLimiting?: AIGatewayRateLimitConfig;

  /**
   * Response caching configuration for the gateway.
   *
   * Caches identical requests to reduce cost and latency.
   */
  caching?: AIGatewayCachingConfig;

  /**
   * Log collection configuration for the gateway.
   *
   * Enables detailed logging of all AI API calls.
   */
  logCollection?: AIGatewayLogCollectionConfig;

  /**
   * Enable real-time alerts for this gateway.
   *
   * When enabled, Cloudflare sends notifications for anomalies
   * such as error rate spikes or unusual traffic patterns.
   *
   * @default false
   */
  alertsEnabled?: boolean;
}
