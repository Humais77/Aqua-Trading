"use client";

import Image from "next/image";
import { Menu, LogOut } from "lucide-react";

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
  const balance = Number(user.balance);

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-pink-100 bg-white/95 backdrop-blur-md">
      <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-white text-slate-600 transition hover:bg-pink-50 hover:text-[#ed1385]"
            aria-label="Toggle sidebar"
          >
            <Menu size={21} />
          </button>

          <div className="hidden sm:block">
            <p className="text-[10px] font-medium text-slate-400">
              Welcome to your dashboard
            </p>

            <h1 className="text-[16px] font-black text-slate-900">
              Aqua Trading
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Balance */}
          <div className="hidden rounded-xl border border-pink-100 bg-pink-50/60 px-4 py-2 sm:block">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
              Balance
            </p>

            <p className="text-[14px] font-black text-[#ed1385]">
              Rs.{" "}
              {balance.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2.5">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-pink-100 bg-pink-50">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[13px] font-black text-[#ed1385]">
                  {user.fullName
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="hidden md:block">
              <p className="text-[8px] font-medium text-slate-400">
                Welcome!
              </p>

              <p className="max-w-[130px] truncate text-[11px] font-black text-slate-800">
                {user.fullName}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex h-10 items-center gap-2 rounded-xl bg-[#ed1385] px-3 text-white shadow-[0_5px_15px_rgba(237,19,133,0.20)] transition hover:bg-[#d90b75]"
          >
            <LogOut size={16} />

            <span className="hidden text-[10px] font-bold sm:block">
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Mobile balance */}
      <div className="border-t border-pink-100 px-4 py-2 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-semibold text-slate-400">
            Available Balance
          </span>

          <span className="text-[11px] font-black text-[#ed1385]">
            Rs.{" "}
            {balance.toLocaleString("en-PK", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </header>
  );
}