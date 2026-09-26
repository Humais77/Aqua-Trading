"use client";

import { useEffect, useState } from "react";

import {
  Users,
  Package,
  WalletCards,
  Clock3,
  CircleDollarSign,
  XCircle,
  Hourglass,
  RefreshCw,
} from "lucide-react";

import AdminPaymentDetails from "@/src/components/admin/AdminPaymentDetails";

type Stats = {
  users: number;
  plans: number;
  deposits: number;
  pendingDeposits: number;
  approvedDeposits: number;
  rejectedDeposits: number;
  approvedDepositAmount: number;
  pendingDepositAmount: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<Stats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  async function loadDashboard(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(
        "/api/admin/dashboard",
        {
          cache: "no-store",
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to load dashboard."
        );
      }

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error(
        "ADMIN_DASHBOARD_LOAD_ERROR:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
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
      label: "Approved Deposits",
      value: stats?.approvedDeposits ?? 0,
      icon: CircleDollarSign,
    },
    {
      label: "Rejected Deposits",
      value: stats?.rejectedDeposits ?? 0,
      icon: XCircle,
    },
    {
      label: "Approved Deposit Value",
      value: `Rs. ${(
        stats?.approvedDepositAmount ?? 0
      ).toLocaleString()}`,
      icon: CircleDollarSign,
    },
    {
      label: "Pending Deposit Value",
      value: `Rs. ${(
        stats?.pendingDepositAmount ?? 0
      ).toLocaleString()}`,
      icon: Hourglass,
    },
  ];

  return (
    <div className="p-4 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage Aqua Trading users, deposits and
              payment details.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:border-pink-200 hover:text-[#ed1385] disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
            Loading dashboard...
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

                  <p className="mt-2 break-words text-2xl font-black text-slate-900">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Verification Notice */}
        <div className="mt-8 rounded-2xl border border-pink-100 bg-pink-50 p-5">
          <h2 className="font-black text-[#ed1385]">
            Deposit Verification
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Users can submit either a transaction ID
            or a payment screenshot. Open the Deposits
            section to review the submitted information
            before approving or rejecting the request.
          </p>

          <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
            Approved deposits automatically increase the
            user's internal Aqua balance. Rejected deposits
            do not change the balance.
          </p>
        </div>

        {/* Payment Details */}
        <AdminPaymentDetails />
      </div>
    </div>
  );
}