import type { ResourceType } from "../types/index.js";
import type { BrowserRenderingOptions } from "../types/browser-rendering.js";
import { Resource } from "./base.js";

/**
 * Browser Rendering resource — headless browser control from Workers.
 * An account capability; nothing is provisioned.
 */
export class BrowserRenderingResource extends Resource<BrowserRenderingOptions> {
  readonly type: ResourceType = "browser-rendering";
}
