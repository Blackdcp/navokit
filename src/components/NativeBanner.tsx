'use client';

import { useEffect } from 'react';

export default function NativeBanner() {
  useEffect(() => {
    // 动态注入原生广告脚本
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = 'https://arkgleamfox.com/5de3905d29eb789c026f5dfa10539279/invoke.js';
    
    // 我们将脚本插入到 head 中，因为它依赖于已存在页面中的 div container
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center my-6">
      <div id="container-5de3905d29eb789c026f5dfa10539279"></div>
    </div>
  );
}
