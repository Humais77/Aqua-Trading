
import { getCurrentUser } from "@/src/lib/auth";
import {
  ArrowUpRight,
  BarChart3,
  CircleDollarSign,
  Gift,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const balance = Number(user.balance);

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Page heading */}
      <div className="mb-7">
        <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#ed1385]">
          Dashboard
        </p>

        <h2 className="mt-1 text-[25px] font-black tracking-[-0.8px] text-slate-900">
          Welcome, {user.fullName.split(" ")[0]}!
        </h2>

        <p className="mt-1 text-[11px] text-slate-500">
          Manage your Aqua Trading account from here.
        </p>
      </div>

      {/* Balance */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Available Balance"
          value={`Rs. ${balance.toLocaleString("en-PK", {
            minimumFractionDigits: 2,
          })}`}
          icon={<Wallet size={20} />}
          highlight
        />

        <DashboardCard
          title="Total Deposited"
          value="Rs. 0.00"
          icon={<CircleDollarSign size={20} />}
        />

        <DashboardCard
          title="Total Withdrawn"
          value="Rs. 0.00"
          icon={<ArrowUpRight size={20} />}
        />

        <DashboardCard
          title="Referral Code"
          value={user.referralCode}
          icon={<Gift size={20} />}
        />
      </div>

      {/* Main dashboard */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Welcome card */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#ed1385] to-[#b90063] p-6 text-white shadow-[0_15px_35px_rgba(237,19,133,0.18)]">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-pink-100">
              Aqua Trading
            </p>

            <h3 className="mt-3 max-w-[500px] text-[25px] font-black leading-tight">
              Start building your investment journey.
            </h3>

            <p className="mt-3 max-w-[480px] text-[11px] leading-6 text-pink-100">
              Your dashboard will contain your investment plans,
              deposits, withdrawals, rewards, referral information
              and account activity.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-[10px] font-semibold backdrop-blur-sm">
              <TrendingUp size={16} />
              Your account is ready.
            </div>
          </div>

          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-10 h-52 w-52 rounded-full bg-white/10" />
        </div>

        {/* Account status */}
        <div className="rounded-[24px] border border-pink-100 bg-white p-6 shadow-[0_8px_30px_rgba(237,19,133,0.06)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
              <BarChart3 size={21} />
            </div>

            <div>
              <h3 className="text-[13px] font-black text-slate-900">
                Account Overview
              </h3>

              <p className="text-[9px] text-slate-400">
                Your current account status
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <StatusRow
              label="Account"
              value="Active"
              positive
            />

            <StatusRow
              label="Verification"
              value={user.isVerified ? "Verified" : "Not Verified"}
              positive={user.isVerified}
            />

            <StatusRow
              label="Username"
              value={`@${user.username}`}
            />

            
          </div>
        </div>
      </div>

      {/* Coming soon */}
      <div className="mt-6 rounded-[24px] border border-dashed border-pink-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
            <Gift size={19} />
          </div>

          <div>
            <h3 className="text-[13px] font-black text-slate-900">
              More dashboard features coming
            </h3>

            <p className="mt-1 text-[9px] text-slate-400">
              Investment plans, deposits, withdrawals, team,
              rewards and verification will be added next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  highlight = false,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border p-5 shadow-[0_7px_25px_rgba(237,19,133,0.05)] ${
        highlight
          ? "border-[#ed1385]/20 bg-gradient-to-br from-white to-pink-50"
          : "border-pink-100 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
          {icon}
        </div>
      </div>

      <p
        className={`mt-4 break-all text-[19px] font-black ${
          highlight ? "text-[#ed1385]" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <span className="text-[10px] font-medium text-slate-400">
        {label}
      </span>

      <span
        className={`text-[10px] font-bold ${
          positive === true
            ? "text-green-600"
            : positive === false
              ? "text-red-500"
              : "text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

