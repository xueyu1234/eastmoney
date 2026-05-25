export async function onRequest(context) {
  const url = new URL(context.request.url);
  // 把 /api/eastmoney/... 转发到东方财富
  const target = 'https://push2.eastmoney.com/api' + url.pathname.replace('/api/eastmoney', '') + url.search;

  const resp = await fetch(target, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.eastmoney.com/',
    },
  });

  const body = await resp.arrayBuffer();

  return new Response(body, {
    status: resp.status,
    headers: {
      'Content-Type': resp.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
  });
}
