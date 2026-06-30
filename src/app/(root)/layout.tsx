import type { Metadata } from "next";
import "../globals.css";
import { BRAND_ICONS } from "../../lib/site";

export const metadata: Metadata = {
  title: "NavoKit",
  description: "Small tools. Faster work.",
  icons: BRAND_ICONS,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
