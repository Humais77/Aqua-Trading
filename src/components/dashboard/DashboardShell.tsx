"use client";

import { useState } from "react";

import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardBottomBar from "./DashboardBottomBar";

import { getCurrentUser } from "@/src/lib/auth";

type User = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

export default function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#fffafd] text-slate-900">
      {/* Top Header */}
      <DashboardHeader
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`min-h-[calc(100vh-78px)] pt-[78px] transition-all duration-300 ${
          sidebarOpen
            ? "lg:pl-[164px]"
            : "lg:pl-[164px]"
        }`}
      >
        <main className="px-3 py-4 pb-24 sm:px-5 sm:py-6 lg:px-6 lg:py-7 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Mobile / Tablet Bottom Navigation */}
      <DashboardBottomBar />
    </div>
  );
}