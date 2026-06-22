const http = require('http');

async function runTest() {
  console.log('Testing /api/tools/ai-video/submit...');
  const submitRes = await fetch('http://localhost:3000/api/tools/ai-video/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'A test video for self testing' })
  });

  if (!submitRes.ok) {
    const err = await submitRes.text();
    console.error('Submit Failed:', submitRes.status, err);
    process.exit(1);
  }

  const submitData = await submitRes.json();
  console.log('Submit Success:', submitData);

  const videoId = submitData.video_id;
  if (!videoId) {
    console.error('Missing video_id in response!');
    process.exit(1);
  }

  console.log(`\nStarting polling for video_id: ${videoId}`);
  let completed = false;
  let attempts = 0;

  while (!completed && attempts < 15) { // max 15 attempts (2.5 mins)
    attempts++;
    console.log(`Poll Attempt ${attempts}...`);
    
    const statusRes = await fetch(`http://localhost:3000/api/tools/ai-video/status?video_id=${videoId}`);
    const statusData = await statusRes.json();

    if (statusRes.status === 429 || (statusData.error && statusData.error.includes('rate limit'))) {
      console.log('Rate limited! Waiting 10s...');
    } else if (!statusRes.ok) {
      console.error('Status check failed:', statusRes.status, statusData);
      process.exit(1);
    } else {
      console.log(`Status: ${statusData.status}, Progress: ${statusData.progress}%`);
      if (statusData.status === 'completed') {
        completed = true;
        console.log('Test Success! Video URL:', statusData.video_url);
      } else if (statusData.status === 'failed') {
        console.error('Video generation failed on the server side!');
        process.exit(1);
      }
    }

    if (!completed) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds like frontend
    }
  }

  if (!completed) {
    console.error('Timed out waiting for completion.');
    process.exit(1);
  }
}

runTest().catch(console.error);
