"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

interface SiteShellProps {
  children: ReactNode;
}

export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <FloatingWhatsApp />
    </div>
  );
}
