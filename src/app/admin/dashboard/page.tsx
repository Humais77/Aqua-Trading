"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Package,
  WalletCards,
  Clock3,
  CircleDollarSign,
} from "lucide-react";

type Stats = {
  users: number;
  plans: number;
  deposits: number;
  pendingDeposits: number;
  approvedDepositAmount: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(
          "/api/admin/dashboard"
        );

        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: stats?.users ?? 0,
      icon: Users,
    },
    {
      label: "Total Plans",
      value: stats?.plans ?? 0,
      icon: Package,
    },
    {
      label: "Total Deposits",
      value: stats?.deposits ?? 0,
      icon: WalletCards,
    },
    {
      label: "Pending Deposits",
      value: stats?.pendingDeposits ?? 0,
      icon: Clock3,
    },
    {
      label: "Approved Deposit Value",
      value: `Rs. ${(stats?.approvedDepositAmount ?? 0).toLocaleString()}`,
      icon: CircleDollarSign,
    },
  ];

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage Aqua Trading users, plans and demo deposits.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
                    <Icon size={21} />
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    {card.label}
                  </p>

                  <p className="mt-2 text-2xl font-black text-slate-900">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-pink-100 bg-pink-50 p-5">
          <h2 className="font-black text-[#ed1385]">
            Demo Environment
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Deposits shown in this panel are demo transactions.
            Approving a deposit updates the internal demo balance
            only. No real bank, Easypaisa, JazzCash or Raast
            transaction is processed.
          </p>
        </div>
      </div>
    </div>
  );
}