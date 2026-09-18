"use client";

import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
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
    <div className="min-h-screen bg-[#fffafd]">
      <DashboardSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? "lg:ml-[250px]" : "lg:ml-[78px]"
        }`}
      >
        <DashboardHeader
          user={user}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}