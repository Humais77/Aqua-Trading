"use client";

import Image from "next/image";
import {
  Bell,
  ChevronDown,
  Menu,
  Power,
  Settings,
  WalletCards,
} from "lucide-react";

type User = {
  fullName: string;
  username: string;
  email: string;
  profileImage: string | null;
  balance: unknown;
};

export default function DashboardHeader({
  user,
  sidebarOpen,
  setSidebarOpen,
}: {
  user: User;
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}) {
  const balance = Number(user.balance) || 0;

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/login";
    }
  };

  const initials = user.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed left-0 right-0 top-0 z-[60] h-[78px] border-b border-pink-100 bg-white/95 shadow-[0_4px_20px_rgba(237,19,133,0.05)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-7">
        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Menu */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle dashboard sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#ed1385] transition hover:bg-pink-50"
          >
            <Menu size={22} strokeWidth={2.5} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
              <TrendingIcon />
            </div>

            <div className="hidden sm:block">
              <div className="text-[20px] font-black leading-none tracking-tight text-[#111827]">
                AQUA
                <span className="text-[#ed1385]">TRADING</span>
              </div>

              <div className="mt-1 text-[6px] font-bold tracking-[1.4px] text-slate-400">
                INVEST TODAY, GROW TOMORROW
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center">
          {/* Settings */}
          <button
            type="button"
            className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-pink-50 text-[#ed1385] transition hover:bg-pink-100 sm:mr-4"
          >
            <Settings size={16} />
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative mr-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-pink-50 hover:text-[#ed1385] sm:mr-4"
          >
            <Bell size={18} />

            <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ed1385] px-1 text-[8px] font-black text-white">
              2
            </span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2 border-r border-pink-100 pr-3 sm:pr-5">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-pink-200 bg-pink-50">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.fullName}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[11px] font-black text-[#ed1385]">
                  {initials}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <p className="text-[7px] font-medium text-slate-400">
                Welcome!
              </p>

              <p className="max-w-[100px] truncate text-[11px] font-black text-slate-900">
                {user.fullName}
              </p>
            </div>

            <ChevronDown
              size={13}
              className="hidden text-[#ed1385] md:block"
            />
          </div>

          {/* Balance */}
          <div className="hidden items-center gap-2 px-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100 text-[#ed1385]">
              <WalletCards size={17} />
            </div>

            <div>
              <p className="text-[7px] font-semibold text-slate-400">
                Balance
              </p>

              <p className="text-[12px] font-black text-[#ed1385]">
                Rs {balance.toLocaleString("en-PK", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="ml-2 flex h-[42px] items-center gap-2 border-l border-pink-100 pl-3 text-slate-500 transition hover:text-[#ed1385] sm:ml-0 sm:pl-4"
          >
            <Power size={18} strokeWidth={2.5} />

            <span className="hidden text-[9px] font-bold sm:block">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

function TrendingIcon() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 48 48"
      fill="none"
      stroke="#ed1385"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7v34h34" />

      <path d="M13 31v-7" />
      <path d="M22 31V15" />
      <path d="M31 31V10" />

      <path d="m13 23 9-9 9 5 10-13" />

      <path d="M35 7h6v6" />
    </svg>
  );
}