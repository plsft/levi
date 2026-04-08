export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets from the ASSETS binding
    const response = await env.ASSETS.fetch(request);

    // For SPA routing: if asset not found and path has no extension,
    // serve index.html so client-side routing can handle it
    if (response.status === 404 && !url.pathname.includes(".")) {
      const indexRequest = new Request(new URL("/index.html", url.origin), request);
      const indexResponse = await env.ASSETS.fetch(indexRequest);
      if (indexResponse.status === 200) {
        return new Response(indexResponse.body, {
          status: 200,
          headers: addSecurityHeaders(new Headers(indexResponse.headers)),
        });
      }
    }

    // Add security headers to all responses
    const securedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: addSecurityHeaders(new Headers(response.headers)),
    });

    return securedResponse;
  },
};

function addSecurityHeaders(headers) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  return headers;
}
