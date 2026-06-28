const prompt = "A small golden cat sitting on a wooden chair in a sunny garden, peaceful atmosphere, soft warm lighting";

async function test() {
  console.log("Testing submit API...");
  try {
    const res = await fetch("http://localhost:3001/api/tools/ai-video/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, lang: 'en' })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
    
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
