export { resolveAuth, cfApi, cfGet, cfPost, cfPatch, cfDelete } from "./api.js";
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
