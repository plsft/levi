export {
  resolveAuth,
  cfApi,
  cfGet,
  cfPost,
  cfPatch,
  cfPut,
  cfPutMultipart,
  cfDelete,
} from "./api.js";
export type { CloudflareAuth, CloudflareApiResponse, CloudflareApiError } from "./api.js";

export {
  findZone,
  listDnsRecords,
  createDnsRecord,
  updateDnsRecord,
  deleteDnsRecord,
  getSslMode,
  setSslMode,
  provisionDomain,
  teardownDomain,
} from "./dns.js";
export type {
  DnsRecordType,
  DnsRecord,
  CreateDnsRecordInput,
  UpdateDnsRecordInput,
  ZoneInfo,
  SslMode,
  DnsProvisionResult,
} from "./dns.js";

export {
  getPhaseEntrypoint,
  planPhaseSync,
  applyPhaseSync,
  syncZoneRules,
  toApiRule,
  leviNameOf,
} from "./rulesets.js";
export type {
  RulesetRule,
  Ruleset,
  PhaseSyncPlan,
  PhaseSyncResult,
} from "./rulesets.js";

export {
  listSnippets,
  putSnippet,
  deleteSnippet,
  getSnippetRules,
  putSnippetRules,
  planSnippetRulesSync,
  syncSnippets,
} from "./snippets.js";
export type {
  SnippetInfo,
  SnippetRule,
  SnippetRulesPlan,
  SnippetSyncResult,
} from "./snippets.js";

export {
  getEmailRoutingSettings,
  enableEmailRouting,
  listDestinationAddresses,
  createDestinationAddress,
  provisionEmail,
} from "./email.js";
export type {
  EmailRoutingSettings,
  DestinationAddress,
  EmailProvisionResult,
} from "./email.js";
