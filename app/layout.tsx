import type { Metadata } from "next";
import { AppProviders } from "@/frontend/providers";
import { SiteShell } from "@/components/site/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Qaiser Land Estates",
    template: "%s | Qaiser Land Estates",
  },
  description:
    "Premium land buying and selling website for Qaiser Ahmad Mir with private admin workflow and luxury estate presentation.",
  metadataBase: new URL("https://kasierwebsitee.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
