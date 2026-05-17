import { AdminShell } from "@/frontend/components/admin/admin-shell";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
