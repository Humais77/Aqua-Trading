import AdminSidebar from "@/src/components/admin/AdminSidebar";
import { getCurrentUser } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Normal users cannot enter the admin panel.
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AdminSidebar />

      <main className="min-h-screen pt-16 lg:ml-[250px] lg:pt-0">
        {children}
      </main>
    </div>
  );
}