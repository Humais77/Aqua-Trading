import { redirect } from "next/navigation";

import { getCurrentUser } from "@/src/lib/auth";
import DashboardDeposit from "@/src/components/dashboard/DashboardDeposit";

export default async function DashboardDepositPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <DashboardDeposit />
    </div>
  );
}