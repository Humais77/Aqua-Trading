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
} from "lucide-react";

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

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[250px] border-r border-slate-200 bg-white lg:block">
      <div className="flex h-20 items-center border-b border-slate-100 px-6">
        <div>
          <h1 className="text-lg font-black text-slate-900">
            AQUA <span className="text-[#ed1385]">ADMIN</span>
          </h1>

          <p className="mt-1 text-[9px] font-bold tracking-[0.15em] text-slate-400">
            CONTROL PANEL
          </p>
        </div>
      </div>

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

      <div className="absolute bottom-5 left-4 right-4">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-500"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}