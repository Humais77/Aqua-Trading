"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock3,
} from "lucide-react";

type Deposit = {
  id: string;
  userId: string;
  user: {
    fullName: string;
    username: string;
    email: string;
  } | null;
  amount: number;
  method:
    | "BANK_TRANSFER"
    | "EASYPAISA"
    | "JAZZCASH"
    | "RAAST";
  reference: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED";
  createdAt: string;
};

export default function AdminDepositsPage() {
  const [deposits, setDeposits] =
    useState<Deposit[]>([]);

  const [loading, setLoading] =
    useState(true);

  async function loadDeposits() {
    const response = await fetch(
      "/api/admin/deposits"
    );

    const data = await response.json();

    if (data.success) {
      setDeposits(data.deposits);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  async function updateStatus(
    id: string,
    status: "APPROVED" | "REJECTED"
  ) {
    const message =
      status === "APPROVED"
        ? "Approve this deposit and add its amount to the user's demo balance?"
        : "Reject this deposit?";

    if (!window.confirm(message)) {
      return;
    }

    const response = await fetch(
      `/api/admin/deposits/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    await loadDeposits();
  }

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900">
            Deposits
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage demo deposit requests.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading deposits...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Method
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Reference
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-black uppercase text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {deposits.map((deposit) => (
                    <tr key={deposit.id}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {deposit.user?.fullName ??
                            "Unknown User"}
                        </p>

                        <p className="text-xs text-slate-400">
                          @
                          {deposit.user?.username ??
                            "unknown"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-black text-[#ed1385]">
                        Rs.{" "}
                        {deposit.amount.toLocaleString()}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {deposit.method.replace(
                          "_",
                          " "
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {deposit.reference}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black ${
                            deposit.status ===
                            "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : deposit.status ===
                                  "APPROVED"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-500"
                          }`}
                        >
                          {deposit.status ===
                            "PENDING" && (
                            <Clock3 size={11} />
                          )}

                          {deposit.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {deposit.status ===
                        "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                updateStatus(
                                  deposit.id,
                                  "APPROVED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white hover:bg-green-600"
                            >
                              <Check size={14} />
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  deposit.id,
                                  "REJECTED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white hover:bg-red-600"
                            >
                              <X size={14} />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {!deposits.length && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-sm text-slate-400"
                      >
                        No deposits found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}