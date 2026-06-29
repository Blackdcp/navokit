export const SITE_URL = "https://www.navokit.com";

export const SUPPORTED_LANGUAGES = ["en", "zh"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function localizedAlternates(pathname = "") {
  const path = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "";
  return {
    canonical: `${SITE_URL}/en${path}`,
    languages: {
      en: `${SITE_URL}/en${path}`,
      zh: `${SITE_URL}/zh${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}

export function localizedCanonical(lang: SupportedLanguage, pathname = "") {
  const path = pathname ? (pathname.startsWith("/") ? pathname : `/${pathname}`) : "";
  return {
    canonical: `${SITE_URL}/${lang}${path}`,
    languages: {
      en: `${SITE_URL}/en${path}`,
      zh: `${SITE_URL}/zh${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}
