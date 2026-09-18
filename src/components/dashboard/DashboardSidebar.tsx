"use client";

import Link from "next/link";
import {
  AppWindow,
  BarChart3,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  Gift,
  History,
  LayoutDashboard,
  LogOut,
  Medal,
  ReceiptText,
  Send,
  Settings2,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invest Plan",
    href: "#",
    icon: BarChart3,
  },
  {
    label: "My Running Plans",
    href: "#",
    icon: Clock3,
  },
  {
    label: "Deposit",
    href: "#",
    icon: Wallet,
  },
  {
    label: "Withdraw",
    href: "#",
    icon: CircleDollarSign,
  },
  {
    label: "Transactions",
    href: "#",
    icon: ReceiptText,
  },
  {
    label: "My Team",
    href: "#",
    icon: Users,
  },
  {
    label: "Salary Rewards",
    href: "#",
    icon: Gift,
  },
  {
    label: "Rankings",
    href: "#",
    icon: Trophy,
  },
  {
    label: "Deposit History",
    href: "#",
    icon: History,
  },
  {
    label: "Withdraw History",
    href: "#",
    icon: Send,
  },
  {
    label: "Referral Bonus",
    href: "#",
    icon: Medal,
  },
  {
    label: "Verification",
    href: "#",
    icon: UserCheck,
  },
  {
    label: "Daily Rewards",
    href: "#",
    icon: Gift,
  },
  {
    label: "App Download",
    href: "#",
    icon: AppWindow,
  },
];

export default function DashboardSidebar({
  open,
  setOpen,
}: Props) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-pink-100 bg-white shadow-[5px_0_25px_rgba(237,19,133,0.06)] transition-all duration-300 ${
          open
            ? "w-[250px]"
            : "w-[78px]"
        } ${
          open
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex h-[78px] items-center border-b border-pink-100 px-4">
          {open ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#ed1385] text-[#ed1385]">
                <TrendingIcon />
              </div>

              <div>
                <div className="text-[17px] font-black text-slate-900">
                  AQUA
                  <span className="text-[#ed1385]">
                    TRADING
                  </span>
                </div>

                <div className="text-[7px] font-bold tracking-[1.5px] text-slate-400">
                  INVEST. GROW. EMPOWER.
                </div>
              </div>
            </Link>
          ) : (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#ed1385] text-[#ed1385]">
              <TrendingIcon />
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="ml-auto hidden rounded-lg p-2 text-slate-400 hover:bg-pink-50 hover:text-[#ed1385] lg:block"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform ${
                !open ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={() => setOpen(false)}
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-pink-50 hover:text-[#ed1385] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/dashboard";

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setOpen(false);
                    }
                  }}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                    active
                      ? "bg-[#ed1385] text-white shadow-[0_6px_15px_rgba(237,19,133,0.22)]"
                      : "text-slate-500 hover:bg-pink-50 hover:text-[#ed1385]"
                  }`}
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                  />

                  {open && (
                    <span className="text-[11px] font-semibold">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-pink-100 p-3">
          <button
            onClick={async () => {
              await fetch(
                "/api/auth/logout",
                {
                  method: "POST",
                }
              );

              window.location.href = "/login";
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-500 transition hover:bg-red-50 ${
              !open ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />

            {open && (
              <span className="text-[11px] font-semibold">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

function TrendingIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 15v-3" />
      <path d="M11 15V9" />
      <path d="M15 15V6" />
      <path d="m7 12 4-4 4 2 4-6" />
    </svg>
  );
}