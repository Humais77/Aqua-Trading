"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowDownToLine,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  CreditCard,
  ExternalLink,
  ImagePlus,
  Loader2,
  Smartphone,
  Upload,
  Wallet,
  X,
} from "lucide-react";

type DepositMethod =
  | "BANK_TRANSFER"
  | "EASYPAISA"
  | "JAZZCASH"
  | "RAAST";

type DepositStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type VerificationType =
  | "TRANSACTION_ID"
  | "SCREENSHOT";

type Deposit = {
  id: string;
  amount: number;
  method: DepositMethod;
  reference: string;
  transactionReference: string | null;
  proofUrl: string | null;
  status: DepositStatus;
  createdAt: string;
  updatedAt?: string;
};

type PaymentDetail = {
  method: DepositMethod;
  title: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string | null;
  enabled: boolean;
};

const paymentMethods = [
  {
    id: "BANK_TRANSFER" as const,
    title: "Bank Transfer",
    description: "Manual bank payment",
    icon: Building2,
  },
  {
    id: "EASYPAISA" as const,
    title: "Easypaisa",
    description: "Manual Easypaisa payment",
    icon: Smartphone,
  },
  {
    id: "JAZZCASH" as const,
    title: "JazzCash",
    description: "Manual JazzCash payment",
    icon: CreditCard,
  },
  {
    id: "RAAST" as const,
    title: "Raast",
    description: "Manual Raast payment",
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

  const [verificationType, setVerificationType] =
    useState<VerificationType>("TRANSACTION_ID");

  const [transactionReference, setTransactionReference] =
    useState("");

  const [proofUrl, setProofUrl] =
    useState<string | null>(null);

  const [proofName, setProofName] = useState("");

  const [deposits, setDeposits] =
    useState<Deposit[]>([]);

  const [paymentDetails, setPaymentDetails] =
    useState<PaymentDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [detailsLoading, setDetailsLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [latestReference, setLatestReference] =
    useState("");

  async function loadDeposits() {
    try {
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

  async function loadPaymentDetails(
    selectedMethod: DepositMethod
  ) {
    try {
      setDetailsLoading(true);

      const response = await fetch(
        `/api/payment-details?method=${selectedMethod}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to load payment details."
        );
      }

      setPaymentDetails(data.detail ?? null);
    } catch {
      setPaymentDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  }

  useEffect(() => {
    loadDeposits();
  }, []);

  useEffect(() => {
    loadPaymentDetails(method);
  }, [method]);

  async function handleProofUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError(
        "Please upload an image screenshot."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Screenshot must be smaller than 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      const compressedImage =
        await compressImage(file);

      if (
        compressedImage.length >
        2_500_000
      ) {
        setError(
          "Screenshot is still too large. Please choose a smaller image."
        );
        event.target.value = "";
        return;
      }

      setProofUrl(compressedImage);
      setProofName(file.name);
    } catch {
      setError(
        "Unable to process the screenshot."
      );
    }
  }

  function removeProof() {
    setProofUrl(null);
    setProofName("");

    const input =
      document.getElementById(
        "deposit-proof"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLatestReference("");

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount < 310
    ) {
      setError(
        "Minimum deposit amount is Rs. 310."
      );
      return;
    }

    if (
      verificationType === "TRANSACTION_ID" &&
      !transactionReference.trim()
    ) {
      setError(
        "Please enter your payment transaction ID."
      );
      return;
    }

    if (
      verificationType === "TRANSACTION_ID" &&
      transactionReference.trim().length < 3
    ) {
      setError(
        "Transaction ID must contain at least 3 characters."
      );
      return;
    }

    if (
      verificationType === "SCREENSHOT" &&
      !proofUrl
    ) {
      setError(
        "Please upload your payment screenshot."
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

            transactionReference:
              verificationType ===
              "TRANSACTION_ID"
                ? transactionReference.trim()
                : null,

            proofUrl:
              verificationType ===
              "SCREENSHOT"
                ? proofUrl
                : null,
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
        "Deposit request submitted successfully. It is now waiting for admin verification."
      );

      setLatestReference(
        data.deposit?.reference ?? ""
      );

      setAmount("");
      setTransactionReference("");
      setProofUrl(null);
      setProofName("");

      const input =
        document.getElementById(
          "deposit-proof"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

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

  async function copyReference(
    reference: string
  ) {
    try {
      await navigator.clipboard.writeText(
        reference
      );
    } catch {
      // Clipboard may be unavailable.
    }
  }

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 shrink-0 text-amber-600"
            size={20}
          />

          <div>
            <h3 className="font-bold text-amber-800">
              Manual Payment Verification
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-700">
              After making your payment, submit either
              your transaction ID or a screenshot of the
              payment receipt. An admin will manually
              verify the request before your balance is
              credited.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        {/* Form */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgba(237,19,133,0.06)] sm:p-6">
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
              <ArrowDownToLine size={22} />
            </div>

            <h1 className="text-xl font-black text-slate-800">
              Make a Deposit
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Submit your payment for manual verification.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Amount */}
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
                  inputMode="numeric"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#ed1385] focus:bg-white focus:ring-4 focus:ring-pink-100 disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Minimum deposit: Rs. 310
              </p>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Payment Method
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentMethods.map(
                  (item) => {
                    const Icon = item.icon;
                    const selected =
                      method === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={submitting}
                        onClick={() =>
                          setMethod(item.id)
                        }
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-[#ed1385] bg-pink-50"
                            : "border-slate-200 bg-white hover:border-pink-200"
                        } disabled:opacity-60`}
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

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {item.title}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="rounded-xl border border-pink-200 bg-pink-50/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-wider text-[#ed1385]">
                  {paymentDetails?.title ??
                    "Payment Details"}
                </p>

                {detailsLoading && (
                  <Loader2
                    size={15}
                    className="animate-spin text-[#ed1385]"
                  />
                )}
              </div>

              {paymentDetails ? (
                <div className="mt-4 space-y-3 text-sm">
                  <DetailRow
                    label="Account Title"
                    value={
                      paymentDetails.accountTitle
                    }
                  />

                  <DetailRow
                    label="Account Number"
                    value={
                      paymentDetails.accountNumber
                    }
                  />

                  {paymentDetails.instructions && (
                    <div className="border-t border-pink-100 pt-3">
                      <p className="text-xs text-slate-400">
                        Instructions
                      </p>

                      <p className="mt-1 whitespace-pre-line text-sm leading-6 font-medium text-slate-700">
                        {
                          paymentDetails.instructions
                        }
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Payment details are currently unavailable.
                </p>
              )}
            </div>

            {/* Verification Choice */}
            <div>
              <label className="mb-3 block text-sm font-bold text-slate-700">
                Payment Verification
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setVerificationType(
                      "TRANSACTION_ID"
                    )
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    verificationType ===
                    "TRANSACTION_ID"
                      ? "border-[#ed1385] bg-pink-50"
                      : "border-slate-200 bg-white hover:border-pink-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        verificationType ===
                        "TRANSACTION_ID"
                          ? "bg-[#ed1385] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Copy size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Enter Transaction ID
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Enter the payment reference.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setVerificationType(
                      "SCREENSHOT"
                    )
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    verificationType ===
                    "SCREENSHOT"
                      ? "border-[#ed1385] bg-pink-50"
                      : "border-slate-200 bg-white hover:border-pink-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        verificationType ===
                        "SCREENSHOT"
                          ? "bg-[#ed1385] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ImagePlus size={18} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Upload Screenshot
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Upload payment proof.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Transaction ID */}
            {verificationType ===
              "TRANSACTION_ID" && (
              <div>
                <label
                  htmlFor="transaction-reference"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Transaction / Payment ID
                </label>

                <input
                  id="transaction-reference"
                  type="text"
                  value={transactionReference}
                  onChange={(event) =>
                    setTransactionReference(
                      event.target.value
                    )
                  }
                  placeholder="e.g. TXN123456789"
                  autoComplete="off"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#ed1385] focus:bg-white focus:ring-4 focus:ring-pink-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Enter the transaction ID shown on your
                  payment receipt.
                </p>
              </div>
            )}

            {/* Screenshot */}
            {verificationType ===
              "SCREENSHOT" && (
              <div>
                <label
                  htmlFor="deposit-proof"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Payment Screenshot
                </label>

                {!proofUrl ? (
                  <label
                    htmlFor="deposit-proof"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-pink-50/40 px-5 py-8 text-center transition hover:border-[#ed1385] hover:bg-pink-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#ed1385] shadow-sm">
                      <Upload size={21} />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      Upload payment screenshot
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WEBP • Max 5 MB
                    </p>

                    <input
                      id="deposit-proof"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleProofUpload
                      }
                      className="hidden"
                      disabled={submitting}
                    />
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-xl border border-pink-200 bg-slate-50">
                    <div className="relative">
                      <img
                        src={proofUrl}
                        alt="Payment proof preview"
                        className="max-h-[360px] w-full object-contain"
                      />

                      <button
                        type="button"
                        onClick={removeProof}
                        disabled={submitting}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:bg-red-50"
                      >
                        <X size={17} />
                      </button>
                    </div>

                    <div className="border-t border-slate-200 bg-white px-4 py-3">
                      <p className="truncate text-xs font-bold text-slate-700">
                        {proofName}
                      </p>

                      <p className="mt-1 text-xs text-green-600">
                        Screenshot ready for submission.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                        Deposit Reference:{" "}
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff1590] to-[#ed1385] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(237,19,133,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Submitting Request...
                </>
              ) : (
                <>
                  <ArrowDownToLine size={18} />
                  Submit Deposit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information */}
        <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-[0_8px_30px_rgba(237,19,133,0.06)] sm:p-6">
          <h2 className="text-lg font-black text-slate-800">
            How It Works
          </h2>

          <div className="mt-6 space-y-4">
            <Step
              number="1"
              title="Make Payment"
              text="Send the amount using the payment details shown above."
            />

            <Step
              number="2"
              title="Provide Proof"
              text="Enter your transaction ID or upload a payment screenshot."
            />

            <Step
              number="3"
              title="Admin Verification"
              text="An admin reviews your payment information."
            />

            <Step
              number="4"
              title="Balance Credit"
              text="Approved deposits are automatically added to your balance."
            />
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl border border-pink-100 bg-white shadow-[0_8px_30px_rgba(237,19,133,0.06)]">
        <div className="border-b border-pink-100 p-5 sm:p-6">
          <h2 className="text-lg font-black text-slate-800">
            Deposit History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track your deposit requests and verification status.
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
            <p className="text-sm font-bold text-slate-700">
              No deposits yet
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="space-y-4 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-400">
                        Amount
                      </p>

                      <p className="mt-1 text-lg font-black text-slate-800">
                        Rs.{" "}
                        {deposit.amount.toLocaleString()}
                      </p>
                    </div>

                    <DepositStatus
                      status={deposit.status}
                    />
                  </div>

                  <InfoRow
                    label="Date"
                    value={new Date(
                      deposit.createdAt
                    ).toLocaleDateString()}
                  />

                  <InfoRow
                    label="Method"
                    value={methodLabels[deposit.method]}
                  />

                  <InfoRow
                    label="Verification"
                    value={
                      deposit.proofUrl
                        ? "Screenshot"
                        : deposit.transactionReference
                        ? "Transaction ID"
                        : "Not provided"
                    }
                  />

                  {deposit.transactionReference && (
                    <InfoRow
                      label="Transaction ID"
                      value={
                        deposit.transactionReference
                      }
                    />
                  )}

                  <InfoRow
                    label="Deposit Reference"
                    value={deposit.reference}
                  />

                  {deposit.proofUrl && (
                    <a
                      href={deposit.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#ed1385]"
                    >
                      View Submitted Screenshot
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader>Method</TableHeader>
                    <TableHeader>Verification</TableHeader>
                    <TableHeader>Reference</TableHeader>
                    <TableHeader>Proof</TableHeader>
                    <TableHeader>Status</TableHeader>
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

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {methodLabels[deposit.method]}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                        {deposit.proofUrl
                          ? "Screenshot"
                          : deposit.transactionReference
                          ? "Transaction ID"
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            copyReference(
                              deposit.reference
                            )
                          }
                          className="flex items-center gap-2 text-xs font-bold text-[#ed1385]"
                        >
                          {deposit.reference}
                          <Copy size={13} />
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        {deposit.proofUrl ? (
                          <a
                            href={deposit.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ed1385]"
                          >
                            View
                            <ExternalLink size={13} />
                          </a>
                        ) : deposit.transactionReference ? (
                          <span className="text-xs font-semibold text-slate-600">
                            {deposit.transactionReference}
                          </span>
                        ) : (
                          "—"
                        )}
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
          </>
        )}
      </div>
    </div>
  );
}

function compressImage(
  file: File
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = 1400;
        const scale = Math.min(
          1,
          maxWidth / image.width
        );

        const canvas =
          document.createElement("canvas");

        canvas.width = Math.round(
          image.width * scale
        );

        canvas.height = Math.round(
          image.height * scale
        );

        const context =
          canvas.getContext("2d");

        if (!context) {
          reject(
            new Error(
              "Unable to process image."
            )
          );
          return;
        }

        context.drawImage(
          image,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(
          canvas.toDataURL(
            "image/jpeg",
            0.78
          )
        );
      };

      image.onerror = () =>
        reject(
          new Error(
            "Invalid image."
          )
        );

      image.src =
        reader.result as string;
    };

    reader.onerror = () =>
      reject(
        new Error(
          "Unable to read image."
        )
      );

    reader.readAsDataURL(file);
  });
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-slate-500">
        {label}
      </span>

      <span className="break-all font-bold text-slate-700 sm:text-right">
        {value}
      </span>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-all text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-50 text-xs font-black text-[#ed1385]">
        {number}
      </div>

      <div>
        <p className="text-sm font-bold text-slate-700">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {text}
        </p>
      </div>
    </div>
  );
}

function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="px-5 py-3 text-left text-[11px] font-black uppercase tracking-wider text-slate-400">
      {children}
    </th>
  );
}

function DepositStatus({
  status,
}: {
  status: DepositStatus;
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