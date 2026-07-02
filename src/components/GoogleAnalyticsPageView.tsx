"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GoogleAnalyticsPageView({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || typeof window === "undefined" || typeof window.gtag !== "function") return;

    window.gtag("config", measurementId, {
      page_path: `${window.location.pathname}${window.location.search}`,
    });
  }, [measurementId, pathname]);

  return null;
}
