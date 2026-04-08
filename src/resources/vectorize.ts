import type { ResourceType, VectorizeOptions } from "../types/index.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Vectorize index resource.
 *
 * Vectorize provides vector search capabilities, enabling semantic
 * search and retrieval-augmented generation (RAG) workflows.
 */
export class VectorizeResource extends Resource<VectorizeOptions> {
  readonly type: ResourceType = "vectorize";
}
