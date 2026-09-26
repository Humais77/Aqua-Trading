"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Save,
  Smartphone,
  Wallet,
} from "lucide-react";

type DepositMethod =
  | "BANK_TRANSFER"
  | "EASYPAISA"
  | "JAZZCASH"
  | "RAAST";

type PaymentDetail = {
  id?: string;
  method: DepositMethod;
  title: string;
  accountTitle: string;
  accountNumber: string;
  instructions: string;
  enabled: boolean;
};

const defaultDetails: PaymentDetail[] = [
  {
    method: "BANK_TRANSFER",
    title: "Bank Transfer",
    accountTitle: "",
    accountNumber: "",
    instructions: "",
    enabled: true,
  },
  {
    method: "EASYPAISA",
    title: "Easypaisa",
    accountTitle: "",
    accountNumber: "",
    instructions: "",
    enabled: true,
  },
  {
    method: "JAZZCASH",
    title: "JazzCash",
    accountTitle: "",
    accountNumber: "",
    instructions: "",
    enabled: true,
  },
  {
    method: "RAAST",
    title: "Raast",
    accountTitle: "",
    accountNumber: "",
    instructions: "",
    enabled: true,
  },
];

const methodIcons = {
  BANK_TRANSFER: Building2,
  EASYPAISA: Smartphone,
  JAZZCASH: CreditCard,
  RAAST: Wallet,
};

export default function AdminPaymentDetails() {
  const [details, setDetails] =
    useState<PaymentDetail[]>(
      defaultDetails
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadDetails();
  }, []);

  async function loadDetails() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/payment-details",
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

      const saved =
        data.details ?? [];

      setDetails(
        defaultDetails.map(
          (defaultDetail) => {
            const existing =
              saved.find(
                (item: PaymentDetail) =>
                  item.method ===
                  defaultDetail.method
              );

            return existing
              ? {
                  ...defaultDetail,
                  ...existing,
                  instructions:
                    existing.instructions ??
                    "",
                }
              : defaultDetail;
          }
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load payment details."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateDetail(
    method: DepositMethod,
    field: keyof PaymentDetail,
    value: string | boolean
  ) {
    setDetails((current) =>
      current.map((detail) =>
        detail.method === method
          ? {
              ...detail,
              [field]: value,
            }
          : detail
      )
    );
  }

  async function saveDetail(
    detail: PaymentDetail
  ) {
    setSaving(detail.method);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/payment-details",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(detail),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Unable to save payment details."
        );
      }

      setMessage(
        `${detail.title} details updated successfully.`
      );

      await loadDetails();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save payment details."
      );
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-100 bg-white p-10 text-sm text-slate-500 shadow-sm">
        <Loader2
          size={18}
          className="mr-2 animate-spin"
        />
        Loading payment details...
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-5">
        <h2 className="text-xl font-black text-slate-900">
          Payment Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          These details are displayed to users on the
          deposit page. Update them whenever your
          receiving account changes.
        </p>
      </div>

      {message && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          <CheckCircle2 size={17} />
          {message}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        {details.map((detail) => {
          const Icon =
            methodIcons[detail.method];

          const isSaving =
            saving === detail.method;

          return (
            <div
              key={detail.method}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-50 text-[#ed1385]">
                    <Icon size={21} />
                  </div>

                  <div>
                    <h3 className="font-black text-slate-800">
                      {detail.title}
                    </h3>

                    <p className="text-xs text-slate-400">
                      {detail.method}
                    </p>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-600">
                  <input
                    type="checkbox"
                    checked={
                      detail.enabled
                    }
                    onChange={(event) =>
                      updateDetail(
                        detail.method,
                        "enabled",
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#ed1385]"
                  />
                  Enabled
                </label>
              </div>

              <div className="space-y-4">
                <Field
                  label="Display Title"
                  value={detail.title}
                  onChange={(value) =>
                    updateDetail(
                      detail.method,
                      "title",
                      value
                    )
                  }
                />

                <Field
                  label="Account Title"
                  value={
                    detail.accountTitle
                  }
                  onChange={(value) =>
                    updateDetail(
                      detail.method,
                      "accountTitle",
                      value
                    )
                  }
                />

                <Field
                  label="Account Number / Wallet"
                  value={
                    detail.accountNumber
                  }
                  onChange={(value) =>
                    updateDetail(
                      detail.method,
                      "accountNumber",
                      value
                    )
                  }
                />

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600">
                    Instructions
                  </label>

                  <textarea
                    value={
                      detail.instructions
                    }
                    onChange={(event) =>
                      updateDetail(
                        detail.method,
                        "instructions",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Enter payment instructions..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#ed1385] focus:bg-white focus:ring-4 focus:ring-pink-100"
                  />
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    saveDetail(detail)
                  }
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ed1385] px-4 text-sm font-bold text-white transition hover:bg-[#d90d77] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save {detail.title}
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-[#ed1385] focus:bg-white focus:ring-4 focus:ring-pink-100"
      />
    </div>
  );
}