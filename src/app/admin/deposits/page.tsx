"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock3,
  ExternalLink,
} from "lucide-react";

type Deposit = {
  id: string;
  userId: string;

  user: {
    id: string;
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
  transactionReference: string;
  proofUrl: string | null;

  verificationType:
  | "SCREENSHOT"
  | "TRANSACTION_ID"
  | null;

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

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  async function loadDeposits() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/deposits",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error(
        "LOAD_DEPOSITS_ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
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
        ? "Approve this deposit and add the amount to the user's balance?"
        : "Reject this deposit?";

    if (!window.confirm(message)) {
      return;
    }

    try {
      setProcessingId(id);

      const response = await fetch(
        `/api/admin/deposits/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(
          data.message ||
            "Unable to update deposit."
        );
        return;
      }

      if (status === "APPROVED") {
        alert(
          `Deposit approved.\n\nNew user balance: Rs. ${Number(
            data.user?.balance ?? 0
          ).toLocaleString()}`
        );
      } else {
        alert("Deposit rejected.");
      }

      await loadDeposits();
    } catch (error) {
      console.error(
        "UPDATE_DEPOSIT_ERROR:",
        error
      );

      alert(
        "Something went wrong while updating the deposit."
      );
    } finally {
      setProcessingId(null);
    }
  }

  function formatMethod(method: Deposit["method"]) {
    return method
      .replace("_", " ")
      .replace("EASYPAISA", "Easypaisa")
      .replace("JAZZCASH", "JazzCash")
      .replace(
        "BANK TRANSFER",
        "Bank Transfer"
      )
      .replace("RAAST", "Raast");
  }

  return (
    <div className="p-4 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-slate-900">
            Deposits
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review external payment submissions and
            approve or reject deposit requests.
          </p>
        </div>

        {/* Demo / Manual Payment Notice */}
        <div className="mb-6 rounded-2xl border border-pink-100 bg-pink-50 p-5">
          <h2 className="font-black text-[#ed1385]">
            Manual Payment Verification
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Verify the transaction against the
            client's actual bank, Easypaisa, JazzCash
            or Raast account before approving.
            Approval automatically adds the deposit
            amount to the user's Aqua balance.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading deposits...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
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
                      Transaction ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Proof
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
                      {/* User */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {deposit.user
                            ?.fullName ??
                            "Unknown User"}
                        </p>

                        <p className="text-xs text-slate-400">
                          @
                          {deposit.user
                            ?.username ??
                            "unknown"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {deposit.user?.email}
                        </p>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <span className="font-black text-[#ed1385]">
                          Rs.{" "}
                          {deposit.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-5 py-4 text-sm font-semibold text-slate-600">
                        {formatMethod(
                          deposit.method
                        )}
                      </td>

                      {/* Transaction Reference */}
                      <td className="px-5 py-4">
                        <p className="font-mono text-xs font-bold text-slate-700">
                          {
                            deposit.transactionReference
                          }
                        </p>

                        <p className="mt-1 font-mono text-[10px] text-slate-400">
                          {deposit.reference}
                        </p>
                      </td>

                      {/* Proof */}
                      <td className="px-5 py-4">
                        {deposit.proofUrl ? (
                          <a
                            href={
                              deposit.proofUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                          >
                            View
                            <ExternalLink
                              size={13}
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No proof
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
  <div className="space-y-1">
    <p className="text-xs font-bold text-slate-700">
      {deposit.verificationType ===
      "SCREENSHOT"
        ? "Screenshot"
        : "Transaction ID"}
    </p>

    {deposit.transactionReference && (
      <p className="break-all text-xs text-slate-500">
        {deposit.transactionReference}
      </p>
    )}

    {deposit.proofUrl && (
      <a
        href={deposit.proofUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ed1385] hover:underline"
      >
        View Screenshot
        <ExternalLink size={13} />
      </a>
    )}
  </div>
</td>  
                      {/* Status */}
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

                      {/* Actions */}
                      <td className="px-5 py-4">
                        {deposit.status ===
                        "PENDING" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              disabled={
                                processingId ===
                                deposit.id
                              }
                              onClick={() =>
                                updateStatus(
                                  deposit.id,
                                  "APPROVED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Check size={14} />

                              {processingId ===
                              deposit.id
                                ? "Processing..."
                                : "Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                processingId ===
                                deposit.id
                              }
                              onClick={() =>
                                updateStatus(
                                  deposit.id,
                                  "REJECTED"
                                )
                              }
                              className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                        colSpan={7}
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