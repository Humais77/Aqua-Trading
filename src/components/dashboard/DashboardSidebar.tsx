"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AppWindow,
  BarChart3,
  CircleDollarSign,
  Clock3,
  Gift,
  History,
  LayoutDashboard,
  LogOut,
  Medal,
  ReceiptText,
  Send,
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
    href: "/dashboard/plans",
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
  const pathname = usePathname();
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[65] bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-[78px] z-[70]
          h-[calc(100vh-78px)]
          w-[164px]
          border-r border-pink-100
          bg-white
          shadow-[4px_0_18px_rgba(237,19,133,0.06)]
          transition-transform duration-300

          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Mobile close */}
        <div className="flex h-12 items-center justify-end px-3 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-pink-50 hover:text-[#ed1385]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-full overflow-y-auto px-2 py-3 scrollbar-thin scrollbar-thumb-pink-200">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active =
  item.href === "/dashboard"
    ? pathname === "/dashboard"
    : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setOpen(false);
                    }
                  }}
                  className={`
                    group flex min-h-[42px] items-center gap-3
                    rounded-[10px] px-3
                    transition-all duration-200

                    ${
                      active
                        ? "bg-gradient-to-r from-[#ff1590] to-[#ed1385] text-white shadow-[0_5px_12px_rgba(237,19,133,0.25)]"
                        : "text-slate-500 hover:bg-pink-50 hover:text-[#ed1385]"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={2.5}
                    className="shrink-0"
                  />

                  <span className="whitespace-nowrap text-[10px] font-semibold">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Sidebar Logout */}
          <div className="mt-3 border-t border-pink-100 pt-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                  });
                } finally {
                  window.location.href = "/login";
                }
              }}
              className="flex w-full items-center gap-3 rounded-[10px] px-3 py-3 text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={18} />

              <span className="text-[10px] font-semibold">
                Logout
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}