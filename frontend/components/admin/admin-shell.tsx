"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  CircleDollarSign,
  LogOut,
  Menu,
  Sparkles,
  Store,
  Star,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { site } from "@/constants/site";
import {
  useGetOwnerProfileQuery,
  useLogoutMutation,
  useMeQuery,
} from "@/frontend/store/api/kasierApi";

const navItems = [
  { href: "/admin/lands/buy", label: "Buy", icon: Store },
  { href: "/admin/lands/sell", label: "Sell", icon: CircleDollarSign },
  { href: "/admin/sold", label: "Sold history", icon: Sparkles },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/owner", label: "Profile", icon: UserCircle },
];

function isAuthPage(pathname: string) {
  return pathname === "/login" || pathname === "/admin/login" || pathname === "/forgot-password" || pathname === "/admin/forgot-password";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isLoading } = useMeQuery();
  const { data: owner } = useGetOwnerProfileQuery();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    if (isAuthPage(pathname)) return;
    if (session && !session.authenticated) {
      router.replace("/login");
    }
  }, [pathname, router, session]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  if (isAuthPage(pathname)) {
    return children;
  }

  if (isLoading || !session) {
    return <div className="grid min-h-screen place-items-center bg-forest-50 text-forest-950">Loading admin panel...</div>;
  }

  if (!session.authenticated) {
    return <div className="grid min-h-screen place-items-center bg-forest-50 text-forest-950">Redirecting to login...</div>;
  }

  return (
    <div className="min-h-screen bg-forest-50 text-forest-950">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="sticky top-0 z-30 border-b border-forest-900/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-forest-900/10 bg-forest-100">
                {owner?.photo ? (
                  <Image src={owner.photo} alt={owner.name || site.ownerName} fill className="object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-serif text-lg text-forest-950">{owner?.name || site.ownerName}</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">Admin panel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-forest-900/10 bg-white text-forest-950"
              aria-label={menuOpen ? "Close admin menu" : "Open admin menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={closeMenu}
            className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          />
        ) : null}

        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 w-[86vw] max-w-[320px] border-r border-forest-900/10 bg-white/98 backdrop-blur transition-transform duration-200 lg:relative lg:z-auto lg:h-screen lg:w-80 lg:translate-x-0 lg:border-b-0",
            menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          ].join(" ")}
        >
          <div className="flex h-full flex-col gap-5 p-4 md:p-6">
            <div className="rounded-sm border border-forest-900/10 bg-forest-950 p-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/15 bg-white/10">
                  {owner?.photo ? (
                    <Image src={owner.photo} alt={owner.name || site.ownerName} fill className="object-cover" />
                  ) : null}
                </div>
                <div>
                  <h1 className="font-serif text-2xl leading-tight md:text-3xl">{owner?.name || site.ownerName}</h1>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-white/65">Admin profile</p>
                </div>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className={[
                      "flex items-center justify-between rounded-sm px-4 py-3 text-sm transition",
                      active
                        ? "bg-forest-950 text-white"
                        : "bg-forest-50 text-forest-950 hover:bg-forest-100",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={() => void handleLogout()}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-sm bg-forest-950 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-forest-800"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1600px] p-4 pt-4 md:p-6 xl:p-8">
            <div>{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
