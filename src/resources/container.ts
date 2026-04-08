import type { ResourceType } from "../types/index.js";
import type { ContainerOptions } from "../types/container.js";
import { Resource } from "./base.js";

/** @beta Cloudflare Container resource — run containerized workloads alongside Workers. */
export class ContainerResource extends Resource<ContainerOptions> {
  readonly type: ResourceType = "container";
}
