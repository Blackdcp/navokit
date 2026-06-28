const fs = require('fs');

async function test() {
  const formData = new FormData();
  // Generate a 10kb dummy file buffer
  const buffer = Buffer.alloc(10240, "a");
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
  formData.append('files', blob, 'test.pptx');

  console.log("Sending request to production...");
  const res = await fetch('https://www.navokit.com/api/tools/ppt2pdf', {
    method: 'POST',
    body: formData
  });
  
  console.log("Status:", res.status);
  if (!res.ok) {
    const text = await res.text();
    console.log("Error:", text);
  } else {
    console.log("Success! Headers:", res.headers);
  }
}

test().catch(console.error);
