"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

type Plan = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  investment: number;
  dailyProfit: number;
  days: number;
  totalProfit: number;
  referBonus: number;
  isActive: boolean;
};

const emptyPlan = {
  name: "",
  tagline: "",
  image: "",
  investment: "",
  dailyProfit: "",
  days: "85",
  totalProfit: "",
  referBonus: "14",
};

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState(emptyPlan);

  async function loadPlans() {
    const response = await fetch(
      "/api/admin/plans"
    );

    const data = await response.json();

    if (data.success) {
      setPlans(data.plans);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(emptyPlan);
    setOpen(true);
  }

  function openEdit(plan: Plan) {
    setEditingId(plan.id);

    setForm({
      name: plan.name,
      tagline: plan.tagline,
      image: plan.image,
      investment: String(plan.investment),
      dailyProfit: String(plan.dailyProfit),
      days: String(plan.days),
      totalProfit: String(plan.totalProfit),
      referBonus: String(plan.referBonus),
    });

    setOpen(true);
  }

  async function savePlan(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const payload = {
      name: form.name,
      tagline: form.tagline,
      image: form.image,
      investment: Number(form.investment),
      dailyProfit: Number(form.dailyProfit),
      days: Number(form.days),
      totalProfit: Number(form.totalProfit),
      referBonus: Number(form.referBonus),
    };

    const response = await fetch(
      editingId
        ? `/api/admin/plans/${editingId}`
        : "/api/admin/plans",
      {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    setOpen(false);
    await loadPlans();
  }

  async function togglePlan(plan: Plan) {
    const response = await fetch(
      `/api/admin/plans/${plan.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !plan.isActive,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    await loadPlans();
  }

  async function deletePlan(id: string) {
    if (
      !window.confirm(
        "Delete this investment plan?"
      )
    ) {
      return;
    }

    const response = await fetch(
      `/api/admin/plans/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    await loadPlans();
  }

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Investment Plans
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage the plans displayed on the website.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ed1385] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200"
          >
            <Plus size={17} />
            Create Plan
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-sm text-slate-500">
            Loading plans...
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div className="bg-gradient-to-r from-[#ff1183] to-[#e6006f] p-5 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black">
                      {plan.name}
                    </h2>

                    <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black">
                      {plan.isActive
                        ? "ACTIVE"
                        : "HIDDEN"}
                    </span>
                  </div>

                  <p className="mt-2 whitespace-pre-line text-xs text-pink-100">
                    {plan.tagline}
                  </p>
                </div>

                <div className="space-y-3 p-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Investment
                    </span>
                    <strong>
                      Rs.{" "}
                      {plan.investment.toLocaleString()}
                    </strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Daily Profit
                    </span>
                    <strong>
                      Rs.{" "}
                      {plan.dailyProfit.toLocaleString()}
                    </strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Duration
                    </span>
                    <strong>
                      {plan.days} days
                    </strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Total Profit
                    </span>
                    <strong>
                      Rs.{" "}
                      {plan.totalProfit.toLocaleString()}
                    </strong>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">
                      Referral Bonus
                    </span>
                    <strong className="text-[#ed1385]">
                      {plan.referBonus}%
                    </strong>
                  </div>

                  <div className="flex gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() =>
                        openEdit(plan)
                      }
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        togglePlan(plan)
                      }
                      className="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 hover:bg-slate-50"
                    >
                      {plan.isActive ? (
                        <EyeOff size={14} />
                      ) : (
                        <Eye size={14} />
                      )}
                    </button>

                    <button
                      onClick={() =>
                        deletePlan(plan.id)
                      }
                      className="rounded-lg border border-red-100 px-3 py-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    {editingId
                      ? "Edit Plan"
                      : "Create Plan"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    This information will be displayed publicly.
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={savePlan}
                className="space-y-4"
              >
                <input
                  placeholder="Plan name e.g. AQUA-01"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                  required
                />

                <textarea
                  placeholder="Tagline"
                  value={form.tagline}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tagline: e.target.value,
                    })
                  }
                  className="min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                  required
                />

                <input
                  placeholder="Image URL"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Investment"
                    value={form.investment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        investment:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Daily Profit"
                    value={form.dailyProfit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        dailyProfit:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Days"
                    value={form.days}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        days: e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Total Profit"
                    value={form.totalProfit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        totalProfit:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                    required
                  />

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Referral Bonus %"
                    value={form.referBonus}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        referBonus:
                          e.target.value,
                      })
                    }
                    className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ed1385]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#ed1385] py-3 text-sm font-black text-white shadow-lg shadow-pink-200"
                >
                  {editingId
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}