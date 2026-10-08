const publicSite = 'https://lamdready.blogspot.com/';
export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    const headers = { 'X-Robots-Tag': 'noindex', 'X-Content-Type-Options': 'nosniff' };
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET, HEAD' } });
    if (path === '/') return new Response(null, { status: 302, headers: { ...headers, Location: publicSite } });
    if (path === '/health') {
      return new Response(request.method === 'HEAD' ? null : JSON.stringify({ service: 'LamdReady', status: 'ok', publicSite, rulesAvailable: false }), { headers: { ...headers, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
    }
    if (path.startsWith('/assets/')) {
      const asset = await env.ASSETS.fetch(request);
      const response = new Response(asset.body, asset);
      for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Cache-Control', asset.ok ? 'public, max-age=300' : 'no-store');
      return response;
    }
    return new Response('Not found', { status: 404, headers });
  },
};
