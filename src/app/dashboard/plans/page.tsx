import { redirect } from "next/navigation";

import { getCurrentUser } from "@/src/lib/auth";
import DashboardInvestmentPlans from "@/src/components/dashboard/DashboardInvestmentPlans";

export default async function DashboardPlansPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      <DashboardInvestmentPlans />
    </div>
  );
}