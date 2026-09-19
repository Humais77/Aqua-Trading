"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  investment: number;
  dailyProfit: number;
  days: number;
  totalProfit: number;
  referBonus: number;
}

export default function Plans() {
  const [plans, setPlans] = useState<PlanItem[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch(
          "/api/plans"
        );

        const data = await response.json();

        if (data.success) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error(
          "LOAD_PLANS_ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  return (
    <section
      id="plans"
      className="scroll-mt-20 bg-[#fff0f6] py-16 text-[#171827]"
    >
      <div className="container mx-auto max-w-6xl px-4">

        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our{" "}
              <span className="text-[#ed1385]">
                Investment Plans
              </span>
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Find a plan that fits your next step.
            </p>
          </div>

          <Link
            href="/plans"
            className="inline-flex self-start items-center gap-2 rounded-full border border-[#ed1385] px-5 py-2 text-xs font-bold text-[#ed1385] transition hover:bg-[#ed1385] hover:text-white sm:self-auto"
          >
            View All Plans
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm font-semibold text-slate-400">
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm font-semibold text-slate-400">
            No active plans available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className="relative overflow-hidden rounded-3xl border border-pink-100/60 bg-white p-4 shadow-xl shadow-pink-100/50 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative flex h-36 items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] p-5 text-white shadow-inner">

                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#171827] shadow-sm">
                    {String(index + 1).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="h-16 w-16 flex-shrink-0 drop-shadow-md">
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 pr-6">
                    <h3 className="text-xl font-black uppercase tracking-wide">
                      {plan.name}
                    </h3>

                    <p className="mt-1 whitespace-pre-line text-xs font-medium leading-snug text-pink-100">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="absolute -bottom-1 left-0 right-0 h-4 bg-white [clip-path:ellipse(60%_100%_at_50%_100%)]" />
                </div>

                <div className="space-y-3 p-3">

                  <div className="flex items-center gap-4 rounded-xl bg-[#fff0f6] p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ed1385] text-white">
                      💰
                    </div>

                    <div>
                      <span className="block text-[11px] font-semibold text-slate-400">
                        Investment
                      </span>

                      <span className="text-xl font-black text-[#ed1385]">
                        Rs{" "}
                        {plan.investment.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-[#fff0f6]/60 p-3">
                      <span className="block text-[10px] font-semibold text-slate-400">
                        Daily Profit
                      </span>

                      <span className="text-xs font-black text-slate-800">
                        Rs{" "}
                        {plan.dailyProfit.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fff0f6]/60 p-3">
                      <span className="block text-[10px] font-semibold text-slate-400">
                        Days
                      </span>

                      <span className="text-xs font-black text-slate-800">
                        {plan.days}
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fff0f6]/60 p-3">
                      <span className="block text-[10px] font-semibold text-slate-400">
                        Total Profit
                      </span>

                      <span className="text-xs font-black text-slate-800">
                        Rs{" "}
                        {plan.totalProfit.toLocaleString()}
                      </span>
                    </div>

                    <div className="rounded-xl bg-[#fff0f6]/60 p-3">
                      <span className="block text-[10px] font-semibold text-slate-400">
                        Refer Bonus
                      </span>

                      <span className="text-xs font-black text-[#ed1385]">
                        {plan.referBonus}%
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/register"
                    className="mt-4 flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#ff1183] to-[#e6006f] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-300/50 transition hover:opacity-95"
                  >
                    <Send
                      size={16}
                      className="rotate-45"
                    />

                    <span>
                      Invest Now
                    </span>

                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}