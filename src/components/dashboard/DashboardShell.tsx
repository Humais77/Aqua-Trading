"use client";

import { useEffect, useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auto-open on desktop, keep closed on mobile
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mq.matches);

    const handler = (e: MediaQueryListEvent) => setSidebarOpen(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#fffafd] text-slate-900">
      <DashboardHeader
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div
        className={`min-h-[calc(100vh-78px)] pt-[78px] transition-all duration-300 ${
          sidebarOpen ? "lg:pl-[164px]" : "lg:pl-0"
        }`}
      >
        <main className="px-3 py-4 pb-24 sm:px-5 sm:py-6 lg:px-6 lg:py-7 lg:pb-10">
          {children}
        </main>
      </div>

      <DashboardBottomBar />
    </div>
  );
}