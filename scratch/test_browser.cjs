const http = require('http');

async function sendMcpRequest(method, params = {}, id = 1) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      jsonrpc: "2.0",
      id,
      method,
      params
    });

    const req = http.request({
      hostname: '127.0.0.1',
      port: 9000,
      path: '/mcp',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function callTool(name, args = {}) {
  return await sendMcpRequest('tools/call', {
    name,
    arguments: args
  }, Date.now());
}

async function main() {
  await sendMcpRequest('initialize', {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "Antigravity", version: "1.0.0" }
  }, 1);

  console.log("=== Clicking astro-cms row (ref=e103) ===");
  await callTool('act', { page: 3, kind: 'click', ref: 'e103' });
  await callTool('act', { page: 3, kind: 'press', key: 'Enter' });
  await new Promise(r => setTimeout(r, 2000));

  const snapRes = await callTool('snapshot', { page: 3 });
  const text = snapRes.result?.content?.[0]?.text || '';
  console.log("astro-cms contents:\n", text.slice(3000, 7000));
}

main().catch(console.error);
