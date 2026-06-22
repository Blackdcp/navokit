"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    // We execute this purely on the client side to bypass ALL CDN caching,
    // IP masking, and header stripping issues caused by Qiniu/Cloudflare.
    const lang = navigator.language.toLowerCase();
    
    // Check if the user's OS or browser is explicitly set to Chinese
    if (lang.includes('zh') || lang.includes('cn')) {
      router.replace('/zh');
    } else {
      // For all other languages (English, Spanish, etc.), redirect to English
      router.replace('/en');
    }
  }, [router]);

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
      <div style={{ width: 24, height: 24, border: '2px solid #ccc', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
