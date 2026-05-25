/**
 * Cloudflare Worker 入口
 * - /api/eastmoney/* → 反向代理到 push2.eastmoney.com
 * - 其他路径       → 返回内嵌的 index.html
 */

import HTML from './index.html';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // ── API 代理 ─────────────────────────────────────────────
    if (url.pathname.startsWith('/api/eastmoney/')) {
      const target =
        'https://push2.eastmoney.com/api' +
        url.pathname.replace('/api/eastmoney', '') +
        url.search;

      const resp = await fetch(target, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
            '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          Referer: 'https://www.eastmoney.com/',
          Accept: 'application/json, text/javascript, */*; q=0.01',
        },
      });

      const body = await resp.arrayBuffer();
      return new Response(body, {
        status: resp.status,
        headers: {
          'Content-Type':
            resp.headers.get('Content-Type') || 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store',
        },
      });
    }

    // ── 静态页面 ──────────────────────────────────────────────
    return new Response(HTML, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};
