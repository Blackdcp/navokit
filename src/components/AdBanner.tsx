'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  format?: string;
  className?: string;
}

export default function AdBanner({
  adKey,
  width,
  height,
  format = 'iframe',
  className = ''
}: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // 清理之前的广告内容，防止路由切换时重复加载
    containerRef.current.innerHTML = '';

    // 配置脚本
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : '${format}',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    // 执行脚本
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.async = true;
    invokeScript.src = `https://arkgleamfox.com/${adKey}/invoke.js`;

    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [adKey, width, height, format]);

  return (
    <div className={`flex justify-center items-center my-4 overflow-hidden w-full ${className}`}>
      <div 
        ref={containerRef} 
        style={{ minHeight: `${height}px`, minWidth: `${width}px` }} 
      />
    </div>
  );
}
