import type { ResourceType } from "../types/index.js";
import type { SnippetOptions } from "../types/edge-rules.js";
import { Resource } from "./base.js";

/**
 * A Cloudflare Snippet — a lightweight JS module that runs at the zone
 * edge before Workers, with a matching snippet rule controlling when it
 * executes. Uploaded and synced by `levi provision`.
 */
export class SnippetResource extends Resource<SnippetOptions> {
  readonly type: ResourceType = "snippet";

  /** Declaration order within the app (snippet rule ordering contract). */
  readonly declarationIndex: number;

  constructor(name: string, options: SnippetOptions, declarationIndex: number) {
    super(name, options);
    this.declarationIndex = declarationIndex;
  }
}
