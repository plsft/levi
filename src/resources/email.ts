import type { ResourceType } from "../types/index.js";
import type { EmailOptions } from "../types/email.js";
import { Resource } from "./base.js";

/**
 * Email sending binding resource (`send_email`) — send email from
 * Workers via Cloudflare Email Routing to verified destinations.
 */
export class EmailResource extends Resource<EmailOptions> {
  constructor(name: string, options: EmailOptions = {}) {
    if (options.destinationAddress && options.allowedDestinationAddresses) {
      throw new Error(
        `Email binding "${name}": destinationAddress and allowedDestinationAddresses ` +
          `are mutually exclusive — set one or the other.`,
      );
    }
    super(name, options);
  }

  readonly type: ResourceType = "email";
}
