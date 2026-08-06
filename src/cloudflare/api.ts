/**
 * Thin Cloudflare REST API client.
 *
 * Uses native `fetch` (Node 18+) — no external HTTP dependencies.
 * Authentication via API token (preferred) or Global API key + email.
 */

const CF_API_BASE = "https://api.cloudflare.com/client/v4";

export interface CloudflareAuth {
  /** API Token (recommended — scoped permissions). */
  apiToken?: string;
  /** Global API Key (legacy — full account access). */
  apiKey?: string;
  /** Email associated with the Global API Key. */
  email?: string;
}

export interface CloudflareApiError {
  code: number;
  message: string;
}

export interface CloudflareApiResponse<T> {
  success: boolean;
  errors: CloudflareApiError[];
  messages: string[];
  result: T;
  result_info?: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

/**
 * Resolve authentication from explicit options or environment variables.
 *
 * Priority:
 * 1. Explicit `apiToken` option
 * 2. `CLOUDFLARE_API_TOKEN` env var
 * 3. Explicit `apiKey` + `email`
 * 4. `CLOUDFLARE_API_KEY` + `CLOUDFLARE_EMAIL` env vars
 */
export function resolveAuth(auth?: Partial<CloudflareAuth>): CloudflareAuth {
  if (auth?.apiToken) return { apiToken: auth.apiToken };

  const envToken = process.env.CLOUDFLARE_API_TOKEN;
  if (envToken) return { apiToken: envToken };

  if (auth?.apiKey && auth?.email) {
    return { apiKey: auth.apiKey, email: auth.email };
  }

  const envKey = process.env.CLOUDFLARE_API_KEY;
  const envEmail = process.env.CLOUDFLARE_EMAIL;
  if (envKey && envEmail) return { apiKey: envKey, email: envEmail };

  throw new Error(
    "No Cloudflare authentication found. " +
      "Set CLOUDFLARE_API_TOKEN or provide apiToken in options.",
  );
}

function buildHeaders(auth: CloudflareAuth): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth.apiToken) {
    headers["Authorization"] = `Bearer ${auth.apiToken}`;
  } else if (auth.apiKey && auth.email) {
    headers["X-Auth-Key"] = auth.apiKey;
    headers["X-Auth-Email"] = auth.email;
  }

  return headers;
}

/**
 * Make an authenticated request to the Cloudflare API.
 */
export async function cfApi<T>(
  method: string,
  path: string,
  auth: CloudflareAuth,
  body?: unknown,
): Promise<CloudflareApiResponse<T>> {
  const url = `${CF_API_BASE}${path}`;
  const headers = buildHeaders(auth);

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = (await response.json()) as CloudflareApiResponse<T>;

  if (!json.success) {
    const errMsg = json.errors.map((e) => `[${e.code}] ${e.message}`).join("; ");
    throw new Error(`Cloudflare API error: ${errMsg}`);
  }

  return json;
}

// ── Convenience methods ────────────────────────────────────────

export async function cfGet<T>(
  path: string,
  auth: CloudflareAuth,
): Promise<T> {
  const res = await cfApi<T>("GET", path, auth);
  return res.result;
}

export async function cfPost<T>(
  path: string,
  auth: CloudflareAuth,
  body: unknown,
): Promise<T> {
  const res = await cfApi<T>("POST", path, auth, body);
  return res.result;
}

export async function cfPut<T>(
  path: string,
  auth: CloudflareAuth,
  body: unknown,
): Promise<T> {
  const res = await cfApi<T>("PUT", path, auth, body);
  return res.result;
}

/**
 * PUT a multipart/form-data body (used by the Snippets API, which takes
 * file parts plus a JSON `metadata` part).
 */
export async function cfPutMultipart<T>(
  path: string,
  auth: CloudflareAuth,
  form: FormData,
): Promise<T> {
  const url = `${CF_API_BASE}${path}`;
  const headers = buildHeaders(auth);
  // Let fetch set the multipart boundary Content-Type itself
  delete (headers as Record<string, string>)["Content-Type"];

  const response = await fetch(url, { method: "PUT", headers, body: form });
  const json = (await response.json()) as CloudflareApiResponse<T>;

  if (!json.success) {
    const errMsg = json.errors.map((e) => `[${e.code}] ${e.message}`).join("; ");
    throw new Error(`Cloudflare API error: ${errMsg}`);
  }

  return json.result;
}

export async function cfPatch<T>(
  path: string,
  auth: CloudflareAuth,
  body: unknown,
): Promise<T> {
  const res = await cfApi<T>("PATCH", path, auth, body);
  return res.result;
}

export async function cfDelete<T>(
  path: string,
  auth: CloudflareAuth,
): Promise<T> {
  const res = await cfApi<T>("DELETE", path, auth);
  return res.result;
}
