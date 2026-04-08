import type { ResourceType } from "../types/index.js";
import type { PipelineOptions } from "../types/pipeline.js";
import { Resource } from "./base.js";

/** @beta Cloudflare Pipeline resource — data ingestion and transformation. */
export class PipelineResource extends Resource<PipelineOptions> {
  readonly type: ResourceType = "pipeline";
}
