import { redirect } from "next/navigation";

import { getCurrentUser } from "@/src/lib/auth";

import DashboardProfileCard from "@/src/components/dashboard/DashboardProfileCard";
import TotalBalanceCard from "@/src/components/dashboard/TotalBalanceCard";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * Only send the fields that the Client Component actually needs.
   *
   * This also prevents database-only fields such as:
   * createdAt
   * updatedAt
   * passwordHash
   * etc.
   *
   * from being passed to a Client Component.
   */
  const dashboardUser = {
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    balance: Number(user.balance) || 0,
    referralCode: user.referralCode,
  };

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      {/* Profile / Referral */}
      <DashboardProfileCard user={dashboardUser} />

      {/* Total Balance */}
      <TotalBalanceCard
        balance={dashboardUser.balance}
      />
    </div>
  );
}