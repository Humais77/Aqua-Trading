"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  WalletCards,
  Package,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";

const links = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Deposits",
    href: "/admin/deposits",
    icon: WalletCards,
  },
  {
    label: "Plans",
    href: "/admin/plans",
    icon: Package,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          aria-label="Open admin menu"
        >
          <Menu size={24} />
        </button>

        <div className="ml-3">
          <h1 className="text-base font-black text-slate-900">
            AQUA <span className="text-[#ed1385]">ADMIN</span>
          </h1>

          <p className="text-[8px] font-bold tracking-[0.15em] text-slate-400">
            CONTROL PANEL
          </p>
        </div>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close admin menu"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-[250px]
          border-r border-slate-200 bg-white
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div>
            <h1 className="text-lg font-black text-slate-900">
              AQUA <span className="text-[#ed1385]">ADMIN</span>
            </h1>

            <p className="mt-1 text-[9px] font-bold tracking-[0.15em] text-slate-400">
              CONTROL PANEL
            </p>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 lg:hidden"
            aria-label="Close admin menu"
          >
            <X size={21} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 p-4">
          {links.map((link) => {
            const Icon = link.icon;

            const active =
              pathname === link.href ||
              (link.href !== "/admin" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-[#ed1385] text-white shadow-lg shadow-pink-200"
                    : "text-slate-600 hover:bg-pink-50 hover:text-[#ed1385]"
                }`}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 left-4 right-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}