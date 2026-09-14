import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

interface PlanItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
  investment: string;
  dailyProfit: string;
  days: number;
  totalProfit: string;
  referBonus: string;
}

const plansData: PlanItem[] = [
  {
    id: "01",
    name: "AQUA-01",
    tagline: "Small Step\nBig Future",
    image: "https://cdn-icons-png.flaticon.com/512/1356/1356479.png", // Rocket icon
    investment: "Rs 310",
    dailyProfit: "Rs77",
    days: 85,
    totalProfit: "Rs6,545",
    referBonus: "14%",
  },
  {
    id: "02",
    name: "AQUA-02",
    tagline: "Invest Smart\nGrow Faster",
    image: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png", // Trophy icon
    investment: "Rs 810",
    dailyProfit: "Rs202",
    days: 85,
    totalProfit: "Rs17,170",
    referBonus: "14%",
  },
  {
    id: "03",
    name: "AQUA-03",
    tagline: "Bigger Investment\nBigger Opportunities",
    image: "https://cdn-icons-png.flaticon.com/512/2058/2058865.png", // Gold bullion icon
    investment: "Rs 1,310",
    dailyProfit: "Rs327",
    days: 85,
    totalProfit: "Rs27,795",
    referBonus: "14%",
  },
  {
    id: "04",
    name: "AQUA-04",
    tagline: "High Yield\nAccelerated Growth",
    image: "https://cdn-icons-png.flaticon.com/512/1356/1356479.png", // Rocket icon
    investment: "Rs 2,500",
    dailyProfit: "Rs625",
    days: 85,
    totalProfit: "Rs53,125",
    referBonus: "14%",
  },
  {
    id: "05",
    name: "AQUA-05",
    tagline: "Elite Level\nMaximum Returns",
    image: "https://cdn-icons-png.flaticon.com/512/3112/3112946.png", // Trophy icon
    investment: "Rs 5,000",
    dailyProfit: "Rs1,250",
    days: 85,
    totalProfit: "Rs106,250",
    referBonus: "14%",
  },
  {
    id: "06",
    name: "AQUA-06",
    tagline: "VIP Capital\nUltimate Wealth",
    image: "https://cdn-icons-png.flaticon.com/512/2058/2058865.png", // Gold bullion icon
    investment: "Rs 10,000",
    dailyProfit: "Rs2,500",
    days: 85,
    totalProfit: "Rs212,500",
    referBonus: "14%",
  },
];

export default function Plans() {
  return (
    <section
  id="plans"
  className="scroll-mt-20 bg-[#fff0f6] py-16 text-[#171827]"
>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Our <span className="text-[#ed1385]">Investment Plans</span>
            </h2>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              Find a plan that fits your next step.
            </p>
          </div>

          <Link
            href="/plans"
            className="self-start sm:self-auto inline-flex items-center gap-2 rounded-full border border-[#ed1385] px-5 py-2 text-xs font-bold text-[#ed1385] transition hover:bg-[#ed1385] hover:text-white"
          >
            View All Plans
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Cards Grid: 3 columns on desktop resulting in 2 rows of 3 cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plansData.map((plan) => (
            <div
              key={plan.id}
              className="relative overflow-hidden rounded-3xl bg-white p-4 shadow-xl shadow-pink-100/50 border border-pink-100/60 transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Header Gradient Box */}
              <div className="relative h-36 rounded-2xl bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] p-5 text-white flex items-center gap-4 overflow-hidden shadow-inner">
                {/* Number Badge */}
                <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#171827] shadow-sm">
                  {plan.id}
                </div>

                {/* Graphic / Icon */}
                <div className="w-16 h-16 flex-shrink-0 drop-shadow-md">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Header Text */}
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-black uppercase tracking-wide">
                    {plan.name}
                  </h3>
                  <p className="text-xs font-medium text-pink-100 whitespace-pre-line mt-1 leading-snug">
                    {plan.tagline}
                  </p>
                </div>

                {/* Bottom Curve Divider effect */}
                <div className="absolute -bottom-1 left-0 right-0 h-4 bg-white [clip-path:ellipse(60%_100%_at_50%_100%)]"></div>
              </div>

              {/* Card Body Content */}
              <div className="p-3 space-y-3">
                {/* Main Investment Box */}
                <div className="flex items-center gap-4 rounded-xl bg-[#fff0f6] p-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ed1385] text-white">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 13c-5.52 0-10-2.02-10-4.5V13c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v-2.5c0 2.48-4.48 4.5-10 4.5zm0 4.5c-5.52 0-10-2.02-10-4.5V18c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v-2.5c0 2.48-4.48 4.5-10 4.5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400">
                      Investment
                    </span>
                    <span className="text-xl font-black text-[#ed1385]">
                      {plan.investment}
                    </span>
                  </div>
                </div>

                {/* 2x2 Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Daily Profit */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#fff0f6]/60 p-2.5">
                    <div className="text-[#ed1385]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 20V10M12 20V4M6 20v-6" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400">Daily Profit</span>
                      <span className="text-xs font-black text-slate-800">{plan.dailyProfit}</span>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#fff0f6]/60 p-2.5">
                    <div className="text-[#ed1385]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400">Days</span>
                      <span className="text-xs font-black text-slate-800">{plan.days}</span>
                    </div>
                  </div>

                  {/* Total Profit */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#fff0f6]/60 p-2.5">
                    <div className="text-[#ed1385]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400">Total Profit</span>
                      <span className="text-xs font-black text-slate-800">{plan.totalProfit}</span>
                    </div>
                  </div>

                  {/* Refer Bonus */}
                  <div className="flex items-center gap-2.5 rounded-xl bg-[#fff0f6]/60 p-2.5">
                    <div className="text-[#ed1385]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold text-slate-400">Refer Bonus</span>
                      <span className="text-xs font-black text-[#ed1385]">{plan.referBonus}</span>
                    </div>
                  </div>
                </div>

                {/* Invest Now Button */}
                <Link
                  href="/register"
                  className="mt-4 flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-[#ff1183] to-[#e6006f] px-5 py-3 text-sm font-bold text-white shadow-md shadow-pink-300/50 transition hover:opacity-95"
                >
                  <Send size={16} className="rotate-45" />
                  <span>Invest Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}