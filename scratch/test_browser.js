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

async function main() {
  const initRes = await sendMcpRequest('initialize', {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "Antigravity", version: "1.0.0" }
  }, 1);
  console.log("MCP Init:\n", JSON.stringify(initRes, null, 2));

  const toolsRes = await sendMcpRequest('tools/list', {}, 2);
  console.log("MCP Tools:\n", JSON.stringify(toolsRes, null, 2));
}

main().catch(console.error);
