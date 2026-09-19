"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  balance: number;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  referralCode: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    const response = await fetch(
      "/api/admin/users"
    );

    const data = await response.json();

    if (data.success) {
      setUsers(data.users);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function deleteUser(id: string) {
    const confirmed = window.confirm(
      "Delete this user? This will also delete their demo deposit history."
    );

    if (!confirmed) return;

    const response = await fetch(
      `/api/admin/users/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    await loadUsers();
  }

  async function toggleVerified(user: User) {
    const response = await fetch(
      `/api/admin/users/${user.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isVerified: !user.isVerified,
        }),
      }
    );

    const data = await response.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    await loadUsers();
  }

  return (
    <div className="p-5 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Users
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered Aqua Trading users.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ed1385] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-pink-200">
            <UserPlus size={17} />
            Add User
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      User
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Email
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Balance
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase text-slate-400">
                      Verification
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-black uppercase text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">
                          {user.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                          @{user.username}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-4 text-sm font-black text-[#ed1385]">
                        Rs.{" "}
                        {user.balance.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-black ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            toggleVerified(user)
                          }
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black ${
                            user.isVerified
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-500"
                          }`}
                        >
                          <ShieldCheck size={12} />
                          {user.isVerified
                            ? "Verified"
                            : "Unverified"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() =>
                              deleteUser(user.id)
                            }
                            className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!users.length && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-10 text-center text-sm text-slate-400"
                      >
                        No users found.
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