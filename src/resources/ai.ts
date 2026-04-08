import type { ResourceType, WorkersAIOptions, AIGatewayOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Workers AI resource.
 *
 * Workers AI provides serverless GPU inference for a catalog of
 * open-source models, accessible directly from Workers.
 */
export class WorkersAIResource extends Resource<WorkersAIOptions> {
  readonly type: ResourceType = "workers-ai";
}

/**
 * A Cloudflare AI Gateway resource.
 *
 * AI Gateway sits in front of AI providers (including Workers AI)
 * to provide caching, rate limiting, logging, and analytics.
 */
export class AIGatewayResource extends Resource<AIGatewayOptions> {
  readonly type: ResourceType = "ai-gateway";
}
