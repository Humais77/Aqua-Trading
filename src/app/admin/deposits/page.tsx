"use client";

import { useEffect, useState } from "react";
import {
  Check,
  X,
  Clock3,
  ExternalLink,
  Image as ImageIcon,
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
  transactionReference: string | null;
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

  const [selectedProof, setSelectedProof] =
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
    switch (method) {
      case "BANK_TRANSFER":
        return "Bank Transfer";

      case "EASYPAISA":
        return "Easypaisa";

      case "JAZZCASH":
        return "JazzCash";

      case "RAAST":
        return "Raast";

      default:
        return method;
    }
  }

  /*
   * Makes sure the stored value is a valid image
   * data URL.
   *
   * If DB contains:
   * data:image/jpeg;base64,/9j/...
   *
   * it is returned unchanged.
   *
   * If DB contains only:
   * /9j/...
   *
   * we add the JPEG prefix.
   */
  function getImageUrl(
    proofUrl: string | null
  ) {
    if (!proofUrl) {
      return null;
    }

    if (
      proofUrl.startsWith("data:image/")
    ) {
      return proofUrl;
    }

    return `data:image/jpeg;base64,${proofUrl}`;
  }

  return (
    <>
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

          {/* Manual Payment Notice */}
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
                    {deposits.map((deposit) => {
                      const imageUrl =
                        getImageUrl(
                          deposit.proofUrl
                        );

                      return (
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
                            {deposit.transactionReference ? (
                              <p className="break-all font-mono text-xs font-bold text-slate-700">
                                {
                                  deposit.transactionReference
                                }
                              </p>
                            ) : (
                              <span className="text-xs text-slate-400">
                                No transaction ID
                              </span>
                            )}

                            <p className="mt-1 break-all font-mono text-[10px] text-slate-400">
                              Ref: {deposit.reference}
                            </p>
                          </td>

                          {/* Proof */}
                          <td className="px-5 py-4">
                            {imageUrl ? (
                              <div className="flex flex-col gap-2">
                                {/* Thumbnail */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProof(
                                      imageUrl
                                    )
                                  }
                                  className="group relative h-16 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                                >
                                  <img
                                    src={imageUrl}
                                    alt="Deposit payment proof"
                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                  />

                                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition group-hover:opacity-100">
                                    <ImageIcon
                                      size={18}
                                    />
                                  </span>
                                </button>

                                {/* View Screenshot */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedProof(
                                      imageUrl
                                    )
                                  }
                                  className="inline-flex w-fit items-center gap-1.5 text-xs font-bold text-[#ed1385] hover:underline"
                                >
                                  <ImageIcon
                                    size={13}
                                  />

                                  View Screenshot
                                </button>

                                {/* Open actual image */}
                                <a
                                  href={imageUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                                >
                                  Open Image
                                  <ExternalLink
                                    size={13}
                                  />
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                No screenshot
                              </span>
                            )}
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
                                <Clock3
                                  size={11}
                                />
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
                                  <Check
                                    size={14}
                                  />

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
                      );
                    })}

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

      {/* ================================================== */}
      {/* IMAGE PREVIEW MODAL */}
      {/* ================================================== */}

      {selectedProof && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() =>
            setSelectedProof(null)
          }
        >
          <div
            className="relative max-h-[95vh] max-w-4xl overflow-hidden rounded-2xl bg-white p-3 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Close */}
            <button
              type="button"
              onClick={() =>
                setSelectedProof(null)
              }
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
              aria-label="Close image"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <img
              src={selectedProof}
              alt="Deposit payment proof"
              className="max-h-[85vh] max-w-full rounded-xl object-contain"
            />

            {/* Open actual image */}
            <div className="flex justify-center pt-3">
              <a
                href={selectedProof}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#ed1385] px-4 py-2 text-sm font-bold text-white hover:bg-[#d90d75]"
              >
                Open Image
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}