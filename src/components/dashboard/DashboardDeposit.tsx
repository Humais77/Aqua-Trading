"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
} from "lucide-react";

type DepositMethod =
  | "BANK_TRANSFER"
  | "EASYPAISA"
  | "JAZZCASH"
  | "RAAST";

type Deposit = {
  id: string;
  amount: number;
  method: DepositMethod;
  reference: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

const paymentMethods = [
  {
    id: "BANK_TRANSFER" as const,
    title: "Bank Transfer",
    description: "Demo bank transfer",
    icon: Building2,
  },
  {
    id: "EASYPAISA" as const,
    title: "Easypaisa",
    description: "Demo Easypaisa payment",
    icon: Smartphone,
  },
  {
    id: "JAZZCASH" as const,
    title: "JazzCash",
    description: "Demo JazzCash payment",
    icon: CreditCard,
  },
  {
    id: "RAAST" as const,
    title: "Raast",
    description: "Demo Raast payment",
    icon: Wallet,
  },
];

const methodLabels: Record<DepositMethod, string> = {
  BANK_TRANSFER: "Bank Transfer",
  EASYPAISA: "Easypaisa",
  JAZZCASH: "JazzCash",
  RAAST: "Raast",
};

export default function DashboardDeposit() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] =
    useState<DepositMethod>("BANK_TRANSFER");

  const [deposits, setDeposits] = useState<Deposit[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [latestReference, setLatestReference] =
    useState("");

  async function loadDeposits() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/deposits/history",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to load deposit history."
        );
      }

      setDeposits(data.deposits ?? []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load deposit history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLatestReference("");

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount < 310) {
      setError(
        "Minimum demo deposit amount is Rs. 310."
      );

      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        "/api/deposits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: numericAmount,
            method,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to submit deposit."
        );
      }

      setSuccess(
        "Demo deposit request submitted successfully."
      );

      setLatestReference(
        data.deposit.reference
      );

      setAmount("");

      await loadDeposits();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to submit deposit."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function copyReference(reference: string) {
    navigator.clipboard.writeText(reference);
  }

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 shrink-0 text-amber-600"
            size={20}
          />

          <div>
            <h3 className="font-bold text-amber-800">
              Demo Mode
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              This deposit section is for demonstration
              purposes only. No real payment will be
              processed and no money will be transferred.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Deposit Form */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgba(237,19,133,0.06)] sm:p-6">
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
              <ArrowDownToLine size={22} />
            </div>

            <h1 className="text-xl font-black text-slate-800">
              Make a Deposit
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Add a demo deposit request to your
              account.
            </p>
          </div>

          {/* Amount */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="deposit-amount"
                className="mb-2 block text-sm font-bold text-slate-700"
              >
                Deposit Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                  Rs.
                </span>

                <input
                  id="deposit-amount"
                  type="number"
                  min="310"
                  step="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#ed1385] focus:bg-white focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Minimum demo deposit: Rs. 310
              </p>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Payment Method
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((item) => {
                  const Icon = item.icon;
                  const selected =
                    method === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() =>
                        setMethod(item.id)
                      }
                      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-[#ed1385] bg-pink-50 shadow-[0_5px_15px_rgba(237,19,133,0.08)]"
                          : "border-slate-200 bg-white hover:border-pink-200 hover:bg-pink-50/40"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          selected
                            ? "bg-[#ed1385] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Demo Instructions */}
            <div className="rounded-xl border border-dashed border-pink-200 bg-pink-50/50 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#ed1385]">
                Demo Payment Instructions
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Account Title
                  </span>

                  <span className="font-bold text-slate-700">
                    Aqua Trading Demo
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Account Number
                  </span>

                  <span className="font-bold text-slate-700">
                    0000000000
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">
                    Payment Reference
                  </span>

                  <span className="font-bold text-slate-700">
                    DEMO-AQUA
                  </span>
                </div>
              </div>

              <p className="mt-4 border-t border-pink-100 pt-3 text-xs leading-5 text-slate-500">
                These are fictional demo details.
                No real payment should be sent to them.
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-green-600"
                    size={18}
                  />

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      {success}
                    </p>

                    {latestReference && (
                      <p className="mt-1 text-xs text-green-600">
                        Reference:{" "}
                        <span className="font-bold">
                          {latestReference}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff1590] to-[#ed1385] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(237,19,133,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(237,19,133,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Processing Demo Deposit...
                </>
              ) : (
                <>
                  <ArrowDownToLine size={18} />
                  Submit Demo Deposit
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Card */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgba(237,19,133,0.06)] sm:p-6">
          <h2 className="text-lg font-black text-slate-800">
            Deposit Information
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Your deposit request will appear in the
            history below after submission.
          </p>

          <div className="mt-6 space-y-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Processing
              </p>

              <p className="mt-1 text-sm font-bold text-slate-700">
                Manual Demo Review
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Payment Status
              </p>

              <p className="mt-1 text-sm font-bold text-amber-600">
                Pending
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-400">
                Real Money
              </p>

              <p className="mt-1 text-sm font-bold text-green-600">
                Not Supported
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit History */}
      <div className="rounded-2xl border border-pink-100 bg-white shadow-[0_8px_30px_rgba(237,19,133,0.06)]">
        <div className="border-b border-pink-100 p-5 sm:p-6">
          <h2 className="text-lg font-black text-slate-800">
            Deposit History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your demo deposit requests.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-sm text-slate-400">
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading deposit history...
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-[#ed1385]">
              <ArrowDownToLine size={21} />
            </div>

            <p className="mt-3 text-sm font-bold text-slate-700">
              No deposits yet
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your demo deposit requests will appear
              here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Method
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Reference
                  </th>

                  <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {deposits.map((deposit) => (
                  <tr
                    key={deposit.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {new Date(
                        deposit.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-slate-800">
                      Rs.{" "}
                      {deposit.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      {methodLabels[deposit.method]}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          copyReference(
                            deposit.reference
                          )
                        }
                        className="flex items-center gap-2 text-xs font-bold text-[#ed1385] hover:underline"
                      >
                        {deposit.reference}
                        <Copy size={13} />
                      </button>
                    </td>

                    <td className="px-5 py-4">
                      <DepositStatus
                        status={deposit.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DepositStatus({
  status,
}: {
  status: Deposit["status"];
}) {
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-600">
        <CheckCircle2 size={13} />
        Approved
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
        <AlertCircle size={13} />
        Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-600">
      <Clock3 size={13} />
      Pending
    </span>
  );
}