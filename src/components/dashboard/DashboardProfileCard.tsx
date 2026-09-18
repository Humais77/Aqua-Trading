"use client";

import Image from "next/image";
import {
  Check,
  ClipboardCopy,
  Crown,
  Gift,
} from "lucide-react";
import { useEffect, useState } from "react";

type DashboardUser = {
  fullName: string;
  username: string;
  email: string;
  profileImage: string | null;
  balance: number;
  referralCode: string | null;
};

export default function DashboardProfileCard({
  user,
}: {
  user: DashboardUser;
}) {
  const [copied, setCopied] = useState(false);

  /*
   * Keep the initial server/client HTML identical.
   * The full URL is added only after hydration.
   */
  const [referralLink, setReferralLink] = useState(
    `/register/${user.referralCode || user.username}`
  );

  useEffect(() => {
    const code = user.referralCode || user.username;

    setReferralLink(
      `${window.location.origin}/register/${code}`
    );
  }, [user.referralCode, user.username]);

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard may be unavailable
    }
  };

  const initials = user.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-[22px] border border-pink-200 bg-white p-3 shadow-[0_8px_30px_rgba(237,19,133,0.08)] sm:p-4 lg:p-5">
      {/* Profile Section */}
      <div className="rounded-[18px] bg-gradient-to-br from-[#fff9fd] via-[#fff0f8] to-[#fffafd] p-3 sm:p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Profile Picture */}
          <div className="flex shrink-0 items-center">
            <div className="relative flex h-[92px] w-[92px] items-center justify-center rounded-full border-[5px] border-white bg-pink-100 shadow-[0_4px_15px_rgba(237,19,133,0.18)] sm:h-[104px] sm:w-[104px]">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.fullName}
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-black text-[#ed1385]">
                    {initials}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="min-w-0 flex-1">
            <h2 className="text-[23px] font-black tracking-tight text-slate-900 sm:text-[25px]">
              {user.username}
            </h2>

            <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
              Ref By:
              <span className="ml-1 font-black text-[#ed1385]">
                Direct Member
              </span>
            </p>

            {/* Referral URL */}
            <div className="mt-3 flex min-w-0">
              <div className="flex min-w-0 flex-1 items-center rounded-l-xl border border-pink-100 bg-white px-3 py-2.5">
                <span className="truncate text-[9px] font-medium text-slate-500 sm:text-[10px]">
                  {referralLink}
                </span>
              </div>

              <button
                type="button"
                onClick={copyReferral}
                aria-label="Copy referral link"
                className="flex h-[40px] w-[45px] shrink-0 items-center justify-center rounded-r-xl bg-[#ed1385] text-white transition hover:bg-[#d90b75]"
              >
                {copied ? (
                  <Check size={18} />
                ) : (
                  <ClipboardCopy size={18} />
                )}
              </button>
            </div>

            <p className="mt-1.5 text-[8px] text-slate-400">
              Share your link and grow your community
            </p>
          </div>

          {/* Member Badge */}
          <div className="flex shrink-0 sm:self-start">
            <div className="flex items-center gap-2 rounded-[15px] border border-pink-200 bg-white px-3 py-2 shadow-[0_4px_12px_rgba(237,19,133,0.08)]">
              <Crown
                size={25}
                fill="#f5a800"
                className="text-[#f5a800]"
              />

              <div>
                <p className="text-[12px] font-black text-slate-800">
                  Member
                </p>

                <p className="text-[7px] font-medium text-[#ed1385]">
                  Since Sep 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Rewards */}
      <button
        type="button"
        className="mt-3 flex w-full items-center gap-3 rounded-[17px] bg-gradient-to-r from-[#a80c72] via-[#d40b7b] to-[#ed1385] px-3 py-3 text-left text-white shadow-[0_7px_18px_rgba(237,19,133,0.20)] transition hover:brightness-105 sm:px-4"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <Gift size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black">
            Daily Rewards
          </p>

          <p className="text-[8px] font-medium text-white/75">
            Open your calendar & collect today&apos;s bonus
          </p>
        </div>

        <span className="pr-1 text-lg">
          →
        </span>
      </button>
    </section>
  );
}