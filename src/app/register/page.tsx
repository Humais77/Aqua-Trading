"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Gift,
  ShieldCheck,
  TrendingUp,
  Users,
  Headset,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
export default function RegisterPage() {
   const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [referralCode, setReferralCode] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const router = useRouter();

  const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    const response = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          referralCode,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      setError(
        data.message || "Unable to create account."
      );
      return;
    }

    router.push("/login?registered=true");
  } catch {
    setError(
      "Unable to connect to the server."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white font-sans text-slate-800">
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft pink glows */}
        <div className="absolute -left-32 -top-32 h-[430px] w-[430px] rounded-full bg-pink-100/70 blur-[90px]" />

        <div className="absolute -right-32 top-20 h-[500px] w-[500px] rounded-full bg-pink-100/70 blur-[100px]" />

        <div className="absolute left-1/2 top-[45%] h-[350px] w-[650px] -translate-x-1/2 rounded-full bg-pink-50/70 blur-[120px]" />

        {/* Bottom pink wave */}
        <div className="absolute -bottom-20 left-[-5%] h-[150px] w-[110%] rotate-[-4deg] bg-gradient-to-r from-pink-100 via-pink-200 to-pink-100" />

        <div className="absolute -bottom-24 left-[-5%] h-[115px] w-[110%] rotate-[-4deg] bg-pink-200/60" />
      </div>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================== */}

      <div className="relative z-10 mx-auto min-h-screen max-w-[1180px] px-5 pb-4 pt-7 sm:px-8">
        {/* =======================================================
            BACK TO HOME
        ======================================================== */}

        <div className="absolute left-5 top-7 sm:left-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#d96a9e] transition hover:text-[#ed1385]"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span>Back to home</span>
          </Link>
        </div>

        {/* =======================================================
            LOGO
        ======================================================== */}

        <div className="flex flex-col items-center pt-0 text-center">
          <Link
            href="/"
            className="inline-flex flex-col items-center"
          >
            {/* Logo icon */}
            <div className="relative flex h-[62px] w-[62px] items-center justify-center rounded-full border-[3px] border-[#ed1385] bg-white shadow-[0_4px_18px_rgba(237,19,133,0.12)]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#ed1385]"
              >
                <path d="M3 3v18h18" />
                <path d="M7 15v-3" />
                <path d="M11 15V9" />
                <path d="M15 15V6" />
                <path d="m7 12 4-4 4 2 4-6" />
                <path d="M16 4h3v3" />
              </svg>
            </div>

            {/* Brand */}
            <h1 className="mt-2 text-[28px] font-black leading-none tracking-[-1.5px] text-slate-900 sm:text-[31px]">
              AQUA{" "}
              <span className="text-[#ed1385]">
                TRADING
              </span>
            </h1>

            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.28em] text-slate-400">
              INVEST TODAY, GROW TOMORROW
            </p>
          </Link>
        </div>

        {/* =======================================================
            MAIN REGISTER AREA
        ======================================================== */}

        <section className="relative mx-auto mt-7 min-h-[520px] max-w-[1080px]">
          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div className="absolute left-0 top-0 hidden h-full w-[250px] lg:block">
            {/* Better Tomorrow Card */}
            <div className="absolute left-4 top-1 rotate-[-9deg]">
              <div className="relative flex h-[142px] w-[132px] flex-col justify-center rounded-[24px] border border-pink-100 bg-white/90 px-5 shadow-[0_12px_30px_rgba(237,19,133,0.12)] backdrop-blur-sm">
                <p className="text-[16px] font-bold leading-[1.05] text-slate-700">
                  Your
                </p>

                <p className="text-[20px] font-black leading-[1.05] text-[#ed1385]">
                  Better
                </p>

                <p className="text-[20px] font-black leading-[1.05] text-[#ed1385]">
                  Tomorrow
                </p>

                <p className="mt-2 text-[11px] font-semibold text-slate-400">
                  Starts Here
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="absolute left-12 top-[185px] space-y-4">
              <MiniFeature
                icon={<ShieldCheck size={15} />}
                line1="Your"
                line2="Account"
              />

              <MiniFeature
                icon={<TrendingUp size={15} />}
                line1="Explore"
                line2="Plans"
              />

              <MiniFeature
                icon={<Users size={15} />}
                line1="Referral"
                line2="Rewards"
              />
            </div>

            {/* 3D Coins */}
            <div className="absolute -bottom-1 left-[-5px] h-[205px] w-[235px]">
              <Image
                src="/Growth.png"
                alt="Investment growth"
                fill
                priority
                className="object-contain object-left-bottom drop-shadow-[0_12px_12px_rgba(237,19,133,0.12)]"
              />
            </div>
          </div>

          {/* =====================================================
              CENTER REGISTER CARD
          ====================================================== */}

          <div className="relative z-20 mx-auto w-full max-w-[410px]">
            <div className="rounded-[32px] border border-pink-200/80 bg-white/95 px-6 pb-7 pt-0 shadow-[0_15px_45px_rgba(237,19,133,0.14)] backdrop-blur-md sm:px-7">
              {/* Pink Header */}
              <div className="relative -mx-1 -mt-1 overflow-hidden rounded-b-[38px] rounded-t-[28px] bg-gradient-to-br from-[#ff39a2] via-[#ff1d91] to-[#e90070] px-5 pb-5 pt-5 text-center shadow-[0_8px_20px_rgba(237,19,133,0.25)]">
                {/* Decorative glow */}
                <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/10 blur-xl" />

                <h2 className="relative text-[23px] font-black leading-tight text-white">
                  Create Account
                </h2>

                <p className="relative mt-1 text-[9px] font-medium text-pink-100">
                  Join Aqua Trading and start your investment journey
                </p>
              </div>

              {/* Welcome text */}
              <div className="mt-5 text-center">
                <p className="text-[10px] font-semibold text-slate-500">
                  Create your account to get started.
                </p>
              </div>

              {/* =================================================
                  REGISTER FORM
              ================================================== */}

              <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
              >
                <div>
  <div className="relative">
    <User
      size={16}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
    />

    <input
      required
      type="text"
      value={username}
      onChange={(event) =>
        setUsername(event.target.value)
      }
      placeholder="Choose a username"
      className="h-[47px] w-full rounded-full border border-slate-200 bg-white px-10 text-[10px] font-semibold text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-[#ed1385] focus:ring-2 focus:ring-pink-100"
    />
  </div>

  <p className="mt-1.5 pl-4 text-[7px] font-medium text-slate-400">
    Letters, numbers and underscores only.
  </p>
</div>

                <div>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
  type="text"
  value={name}
  onChange={(event) =>
    setName(event.target.value)
  }
  placeholder="Your full name"
                      className="h-[47px] w-full rounded-full border border-slate-200 bg-white px-10 text-[10px] font-semibold text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-[#ed1385] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  <p className="mt-1.5 pl-4 text-[7px] font-medium text-slate-400">
                    Enter your full name.
                  </p>
                </div>

                {/* =================================================
                    EMAIL
                ================================================== */}

                <div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                       required
  type="email"
  value={email}
  onChange={(event) =>
    setEmail(event.target.value)
  }
  placeholder="you@example.com"
                      className="h-[47px] w-full rounded-full border border-slate-200 bg-white px-10 text-[10px] font-semibold text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-[#ed1385] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  <p className="mt-1.5 pl-4 text-[7px] font-medium text-slate-400">
                    Use an active email address.
                  </p>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================== */}

                <div>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      required
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(event) =>
    setPassword(event.target.value)
  }
  placeholder="Create a password"
                      className="h-[47px] w-full rounded-full border border-slate-200 bg-white px-10 pr-11 text-[10px] font-semibold text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-[#ed1385] focus:ring-2 focus:ring-pink-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#ed1385]"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>

                  <p className="mt-1.5 pl-4 text-[7px] font-medium text-slate-400">
                    Create a secure password for your account.
                  </p>
                </div>

                {/* =================================================
                    REFERRAL CODE
                ================================================== */}

                <div>
                  <div className="relative">
                    <Gift
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                     type="text"
  value={referralCode}
  onChange={(event) =>
    setReferralCode(event.target.value)
  }
  placeholder="Enter referral code"
                      className="h-[47px] w-full rounded-full border border-slate-200 bg-white px-10 text-[10px] font-semibold text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.03)] outline-none transition placeholder:text-slate-400 focus:border-[#ed1385] focus:ring-2 focus:ring-pink-100"
                    />
                  </div>

                  <p className="mt-1.5 pl-4 text-[7px] font-medium text-slate-400">
                    Referral code is optional.
                  </p>
                </div>
                {error && (
  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-[9px] font-semibold text-red-600">
    {error}
  </div>
)}

                {/* =================================================
                    CREATE ACCOUNT BUTTON
                ================================================== */}

                <button
                  type="submit"
                  className="group flex h-[49px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff28a0] to-[#ed0072] text-[14px] font-black text-white shadow-[0_7px_18px_rgba(237,19,133,0.28)] transition hover:-translate-y-[1px] hover:shadow-[0_10px_22px_rgba(237,19,133,0.34)] active:translate-y-0"
                >
                  <span>Create Account</span>

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* =================================================
                  DIVIDER
              ================================================== */}

              <div className="relative my-5 flex items-center">
                <div className="w-full border-t border-slate-200" />

                <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-[8px] font-bold text-slate-300">
                  OR
                </span>
              </div>

              {/* =================================================
                  LOGIN LINK
              ================================================== */}

              <div className="flex items-center justify-center gap-2.5 text-[9px] font-semibold text-slate-500">
                <span>Already have an account?</span>

                <Link
                  href="/login"
                  className="rounded-full border border-[#ff7fbd] bg-white px-4 py-2 text-[9px] font-bold text-[#ed1385] transition hover:bg-pink-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}

          <div className="absolute right-0 top-0 hidden h-full w-[250px] lg:block">
            {/* Invest / Learn / Grow */}
            <div className="absolute right-4 top-1 text-right">
              <p className="font-serif text-[25px] font-medium italic leading-[1.15] text-[#ed1385]">
                Invest
              </p>

              <p className="font-serif text-[25px] font-medium italic leading-[1.15] text-[#ed1385]">
                Learn
              </p>

              <p className="font-serif text-[29px] font-bold italic leading-[1.15] text-[#ed1385]">
                Grow
              </p>

              <div className="mt-1 flex justify-end pr-1">
                <Heart
                  size={22}
                  strokeWidth={2}
                  className="text-[#ed1385]"
                />
              </div>
            </div>

            {/* 3D Phone / Shield */}
            <div className="absolute -bottom-1 right-[-8px] h-[270px] w-[245px]">
              <Image
                src="/Login-Security.png"
                alt="Secure investment"
                fill
                priority
                className="object-contain object-right-bottom drop-shadow-[0_12px_14px_rgba(237,19,133,0.12)]"
              />
            </div>
          </div>
        </section>

        {/* =======================================================
            BOTTOM NAVIGATION
        ======================================================== */}

        <section className="relative z-20 mx-auto mt-3 w-full max-w-[1050px] px-4 sm:mt-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4 sm:gap-x-12">
            <BottomFeature
              icon={
                <TrendingUp
                  size={25}
                  strokeWidth={2.5}
                />
              }
              title="Explore"
              subtitle="Investment Plans"
            />

            <BottomFeature
              icon={
                <ShieldCheck
                  size={25}
                  strokeWidth={2.5}
                />
              }
              title="Your"
              subtitle="Account"
            />

            <BottomFeature
              icon={
                <Users
                  size={25}
                  strokeWidth={2.5}
                />
              }
              title="Growing"
              subtitle="Community"
            />

            <BottomFeature
              icon={
                <Headset
                  size={25}
                  strokeWidth={2.5}
                />
              }
              title="Contact"
              subtitle="Support"
            />
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center text-[9px] font-medium text-slate-400">
            © 2026 AQUA TRADING. All rights reserved.
          </p>
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   LEFT FEATURE
============================================================= */

function MiniFeature({
  icon,
  line1,
  line2,
}: {
  icon: React.ReactNode;
  line1: string;
  line2: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ed1385] text-white shadow-[0_4px_10px_rgba(237,19,133,0.2)]">
        {icon}
      </div>

      <span className="text-[9px] font-bold leading-[1.05] text-slate-600">
        {line1}
        <br />
        {line2}
      </span>
    </div>
  );
}

/* =============================================================
   BOTTOM FEATURE
============================================================= */

function BottomFeature({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-[82px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100/80 text-[#ed1385] shadow-[0_4px_12px_rgba(237,19,133,0.10)]">
        {icon}
      </div>

      <p className="mt-2.5 text-[10px] font-bold leading-[1.2] text-slate-700 sm:text-[11px]">
        {title}
        <br />
        {subtitle}
      </p>
    </div>
  );
}