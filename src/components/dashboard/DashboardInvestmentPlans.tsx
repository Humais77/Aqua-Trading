"use client";

import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Gift,
  TrendingUp,
} from "lucide-react";

import { investmentPlans } from "@/src/lib/plans";

function formatCurrency(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function DashboardInvestmentPlans() {
  return (
    <section className="w-full">
      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp
            size={22}
            className="text-[#ed1385]"
          />

          <h1 className="text-2xl font-bold text-slate-900">
            Invest Plans
          </h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Explore the available investment plans and
          review their details.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {investmentPlans.map((plan) => (
          <div
            key={plan.id}
            className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-[0_8px_30px_rgba(237,19,133,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(237,19,133,0.13)]"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-[#ff1590] to-[#ed1385] px-5 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
                    Investment Plan
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {plan.name}
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs text-white/80">
                  Plan Amount
                </p>

                <p className="mt-1 text-3xl font-black">
                  {formatCurrency(plan.amount)}
                </p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
              <div className="space-y-3">
                {/* Daily Profit */}
                <div className="flex items-center justify-between rounded-xl bg-pink-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#ed1385] shadow-sm">
                      <CircleDollarSign size={18} />
                    </div>

                    <span className="text-sm text-slate-500">
                      Daily Profit
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(plan.dailyProfit)}
                  </span>
                </div>

                {/* Duration */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#ed1385] shadow-sm">
                      <CalendarDays size={18} />
                    </div>

                    <span className="text-sm text-slate-500">
                      Duration
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {plan.duration} Days
                  </span>
                </div>

                {/* Total Profit */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#ed1385] shadow-sm">
                      <TrendingUp size={18} />
                    </div>

                    <span className="text-sm text-slate-500">
                      Total Profit
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {formatCurrency(plan.totalProfit)}
                  </span>
                </div>

                {/* Referral Bonus */}
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#ed1385] shadow-sm">
                      <Gift size={18} />
                    </div>

                    <span className="text-sm text-slate-500">
                      Referral Bonus
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-900">
                    {plan.referralBonus}%
                  </span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                disabled
                className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-400"
              >
                Select Plan
                <ArrowRight size={17} />
              </button>

              <p className="mt-2 text-center text-[11px] text-slate-400">
                Investment functionality will be available soon.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}