import type { ResourceType } from "../types/index.js";
import type { AnalyticsEngineOptions } from "../types/analytics-engine.js";
import { Resource } from "./base.js";

/**
 * Workers Analytics Engine dataset resource — unlimited-cardinality
 * analytics written from Workers via `writeDataPoint()`.
 * Datasets are created automatically on first write.
 */
export class AnalyticsEngineResource extends Resource<AnalyticsEngineOptions> {
  readonly type: ResourceType = "analytics-engine";
}
