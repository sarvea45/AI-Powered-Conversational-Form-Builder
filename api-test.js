const http = require('http');

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8080,
      path,
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("Starting API Tests...");
  try {
    // 1. Health
    let res = await request('/health');
    console.log(`[Req 2] GET /health: ${res.statusCode} ${res.data.status}`);

    // 2. Generate Form
    res = await request('/api/form/generate', 'POST', { prompt: "A contact form" });
    const convId = res.data.conversationId;
    console.log(`[Req 3] POST /generate (v1): Status ${res.statusCode}, Version ${res.data.version}, formId: ${res.data.formId}`);

    // 3. Multi-turn
    res = await request('/api/form/generate', 'POST', { prompt: "Add phone number", conversationId: convId });
    console.log(`[Req 4] POST /generate (multi-turn): Status ${res.statusCode}, Version ${res.data.version} (Expect 2)`);

    // 4. Ambiguity
    res = await request('/api/form/generate', 'POST', { prompt: "Make a form for booking a meeting room" });
    console.log(`[Req 5] POST /generate (ambiguity): Status ${res.statusCode}, returned status '${res.data.status}', questions: ${res.data.questions?.length}`);

    // 5. Retry mock 1
    res = await request('/api/form/generate?mock_llm_failure=1', 'POST', { prompt: "Test mock 1" });
    console.log(`[Req 6] POST /generate?mock_llm_failure=1: Status ${res.statusCode} (Expect 200)`);

    // 6. Retry mock 3
    res = await request('/api/form/generate?mock_llm_failure=3', 'POST', { prompt: "Test mock 3" });
    console.log(`[Req 6] POST /generate?mock_llm_failure=3: Status ${res.statusCode} (Expect 500) Error: ${res.data.error}`);

  } catch(e) {
    console.error(e);
  }
}

runTests();
