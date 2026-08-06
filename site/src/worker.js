export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // flarefound.com is being sunset — permanently redirect to the new home
    if (url.hostname === "levi.flarefound.com") {
      url.hostname = "levi.plsft.com";
      return Response.redirect(url.toString(), 301);
    }

    // Serve static assets from the ASSETS binding
    const response = await env.ASSETS.fetch(request);

    // For SPA routing: if asset not found and path has no extension,
    // serve index.html so client-side routing can handle it
    if (response.status === 404 && !url.pathname.includes(".")) {
      const indexRequest = new Request(new URL("/index.html", url.origin), request);
      let indexResponse = await env.ASSETS.fetch(indexRequest);
      // ASSETS may redirect (307) to the canonical path — follow it
      if (indexResponse.status >= 300 && indexResponse.status < 400) {
        indexResponse = await env.ASSETS.fetch(indexResponse.url || indexRequest);
      }
      if (indexResponse.ok) {
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
