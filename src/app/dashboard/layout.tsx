import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";

import DashboardShell from "@/src/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * Admins must never enter the normal user dashboard.
   */
  if (user.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}