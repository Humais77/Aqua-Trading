"use client";

import {
  ArrowUpRight,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function TotalBalanceCard({
  balance,
}: {
  balance: number;
}) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <section className="relative mt-4 overflow-hidden rounded-[22px] bg-gradient-to-r from-[#ff1590] via-[#f42691] to-[#ed1385] px-5 py-5 text-white shadow-[0_10px_30px_rgba(237,19,133,0.20)] sm:px-7 sm:py-6">
      {/* Decorative shapes */}
      <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full border-[18px] border-white/10" />

      <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full border-[20px] border-white/10" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-bold sm:text-[14px]">
            Total Balance
          </p>

          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15"
          >
            {showBalance ? (
              <Eye size={13} />
            ) : (
              <EyeOff size={13} />
            )}
          </button>
        </div>

        {/* Balance */}
        <h2 className="mt-2 text-[29px] font-black tracking-tight sm:text-[34px]">
          {showBalance
            ? `Rs ${balance.toLocaleString("en-PK", {
                minimumFractionDigits: 2,
              })}`
            : "••••••••"}
        </h2>

        {/* Bottom stats */}
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2">
            <TrendingUp size={15} />

            <div>
              <p className="text-[7px] text-white/70">
                Current Growth
              </p>

              <p className="text-[10px] font-black">
                +0.00%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2">
            <ArrowUpRight size={15} />

            <div>
              <p className="text-[7px] text-white/70">
                Total Earnings
              </p>

              <p className="text-[10px] font-black">
                Rs 0.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}