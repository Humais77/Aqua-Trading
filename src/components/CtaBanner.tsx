import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="bg-[#fff0f6] py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-white p-6 sm:p-8 shadow-xl shadow-pink-100/60 border border-pink-100/60">
          {/* Icon & Heading */}
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-50 text-[#ed1385]">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Start Your <span className="text-[#ed1385]">Investment Journey</span> Today
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-400">
                Take your next step with AQUA TRADING.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link
              href="/register"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] to-[#e6006f] px-6 py-3 text-xs font-bold text-white shadow-md shadow-pink-300/50 transition hover:opacity-95"
            >
              <span>Register Now</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/login"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white px-6 py-3 text-xs font-bold text-[#ed1385] shadow-sm transition hover:bg-pink-50"
            >
              <User size={14} />
              <span>Login Now</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}