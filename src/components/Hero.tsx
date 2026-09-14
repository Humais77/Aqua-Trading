import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Gift,
  Medal,
  Send,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  LogOut,
  Dices,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Easy to",
    subtitle: "Get Started",
  },
  {
    icon: TrendingUp,
    title: "Explore",
    subtitle: "Investment Plans",
  },
  {
    icon: Users,
    title: "Grow Your",
    subtitle: "Community",
  },
];

const rewards = [
  {
    icon: Gift,
    title: "Member Rewards",
  },
  {
    icon: Dices,
    title: "Prize Zone",
  },
  {
    icon: Medal,
    title: "Ranking System",
  },
  {
    icon: Users,
    title: "Team Rewards",
  },
  {
    icon: Send,
    title: "Refer & Earn",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#fffafd] via-[#fff5fa] to-[#ffe6f2] pt-8 pb-12 md:pt-12 md:pb-16">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-80px] top-[-50px] h-[550px] w-[550px] rounded-full bg-[#ffd1e8] opacity-50 blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[20%] h-[400px] w-[500px] rounded-full bg-[#fff0f7] opacity-60 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main Hero Grid */}
        <div className="grid min-h-[460px] items-center gap-8 lg:grid-cols-12">
          {/* Left Column Text & Actions */}
          <div className="z-10 lg:col-span-7">
            {/* Tagline */}
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ed1385]">
                SMALL STEPS
              </span>
              <span className="text-xs font-bold text-[#ed1385]">•</span>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ed1385]">
                BIG DREAMS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black leading-[1.08] tracking-tight text-[#171827]">
              Smart Investment <br />
              <span className="text-[#ed1385]">Brighter</span> Tomorrow
            </h1>

            {/* Subtext */}
            <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              Explore plans, discover rewards and start your investment journey
              with AQUA TRADING.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {/* Register Button (Gradient Pill) */}
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-pink-300/60 transition hover:opacity-95 hover:scale-[1.02]"
              >
                <User size={16} />
                <span>Register Now</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              {/* Login Button (White Pill with Pink Border) */}
              <Link
                href="/login"
                className="group inline-flex items-center gap-2.5 rounded-full border border-pink-200 bg-white px-7 py-3.5 text-xs sm:text-sm font-bold text-[#ed1385] shadow-md shadow-pink-100/50 transition hover:bg-pink-50 hover:scale-[1.02]"
              >
                <LogOut size={15} className="rotate-180" />
                <span>Login Now</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Small Feature Pills Below Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8 border-t border-pink-200/50 pt-6">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.subtitle}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff1183] to-[#e6006f] text-white shadow-md shadow-pink-200">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>

                    <div className="text-xs font-bold leading-snug text-slate-800">
                      <div>{feature.title}</div>
                      <div>{feature.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column 3D Graphic */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="relative z-10 w-full max-w-[420px] lg:max-w-none">
              <Image
                src="/Hero.png"
                alt="3D Phone Dashboard and Savings Graphic"
                width={500}
                height={500}
                priority
                className="h-auto w-full object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>

        {/* Floating Bottom Rewards Bar */}
        <div className="relative z-20 mt-10">
          <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-xl shadow-pink-100/70 border border-pink-100/70">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-pink-100">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;

                return (
                  <div
                    key={reward.title}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 sm:pt-0 ${
                      index !== 0 ? "sm:pl-4" : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0f6] text-[#ed1385]">
                      <Icon size={22} strokeWidth={2} />
                    </div>

                    <span className="text-xs font-bold text-slate-800 text-center sm:text-left">
                      {reward.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}