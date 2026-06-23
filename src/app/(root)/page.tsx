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
    <div className="h-screen flex items-center justify-center bg-navo-surface">
      <div className="w-6 h-6 border-2 border-[#ccc] border-t-navo-ink rounded-full animate-spin" />
    </div>
  );
}
