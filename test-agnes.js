const https = require('https');

const data = JSON.stringify({
  model: 'Agnes-2.0-Flash', // Or 'gpt-4' or 'claude-3-haiku-20240307' - whatever they support
  messages: [{ role: 'user', content: 'Say hello world' }],
});

const options = {
  hostname: 'apihub.agnes-ai.com',
  port: 443,
  path: '/v1/models',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer sk-hQe8X3F1rnujEclYAuRgZEYWEGgZ5B7Gvs9H0Pe964k7nbxg',
  },
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const parsed = JSON.parse(body);
      if (parsed.data) {
        console.log('Available Models:', parsed.data.map(m => m.id).join(', '));
      } else {
        console.log('Body:', body);
      }
    } catch (e) {
      console.log('Body:', body);
    }
  });
});

req.on('error', (error) => { console.error(error); });
req.end();
