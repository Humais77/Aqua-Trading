"use client";

import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  Users,
  Wallet,
  WalletCards,
} from "lucide-react";

const items = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Invest",
    href: "#",
    icon: BarChart3,
  },
  {
    label: "Deposit",
    href: "#",
    icon: WalletCards,
  },
  {
    label: "Withdraw",
    href: "#",
    icon: Wallet,
  },
  {
    label: "Team",
    href: "#",
    icon: Users,
  },
];

export default function DashboardBottomBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[80] h-[64px] border-t border-white/20 bg-gradient-to-r from-[#ff1b91] via-[#ed1385] to-[#f20c82] px-2 shadow-[0_-5px_20px_rgba(237,19,133,0.20)] lg:hidden">
      <div className="mx-auto flex h-full max-w-2xl items-center justify-around">
        {items.map((item, index) => {
          const Icon = item.icon;
          const active = index === 0;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex h-[56px] min-w-[64px] flex-1
                flex-col items-center justify-center
                rounded-xl
                transition-all

                ${
                  active
                    ? "bg-white/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                    : "text-white/95 hover:bg-white/10"
                }
              `}
            >
              <Icon
                size={20}
                strokeWidth={2.7}
              />

              <span className="mt-1 text-[8px] font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}