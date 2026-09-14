import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const benefits = [
  "Easy Registration",
  "Plan Overview",
  "Member Dashboard",
  "Referral Rewards",
  "Team Growth",
  "Contact Support",
];

const rewards = [
  {
    image: "/rewards.png",
    title: "Member Rewards",
    description: "Reach milestones. Discover more.",
    link: "View Rewards",
    href: "/rewards",
  },
  {
    image: "/PrizeZone.png",
    title: "Prize Zone",
    description: "A little more to look forward to.",
    link: "Explore Prizes",
    href: "/rewards",
  },
  {
    image: "/RankingSystem.png",
    title: "Ranking System",
    description: "Reach your next rank.",
    link: "View Rankings",
    href: "/rewards",
  },
  {
    image: "/TeamRewards.png",
    title: "Team Rewards",
    description: "Build your team. Grow together.",
    link: "Learn More",
    href: "/rewards",
  },
];

export default function Stats() {
  return (
    <section id="whychooseus" className="relative overflow-hidden bg-[#fffafd] py-14 sm:py-20">
      {/* Background soft glow */}
      <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-[350px] w-[500px] rounded-full bg-[#fce2ef] opacity-60 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top Header & Checklist Section */}
        <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Heading */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-[#171827]">
              Why <span className="text-[#ed1385]">Choose Us?</span>
            </h2>

            <p className="mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500 font-medium">
              A simple way to explore plans, discover member rewards and manage
              your investment journey.
            </p>
          </div>

          {/* Right Checklist */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3.5">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#ed1385] text-white shadow-sm">
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reward 3D Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rewards.map((reward) => (
            <div
              key={reward.title}
              className="group flex flex-col items-center rounded-3xl border border-pink-100/70 bg-white p-6 sm:p-7 text-center shadow-lg shadow-pink-100/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-pink-200/50"
            >
              {/* 3D Illustration Container */}
              <div className="relative flex h-36 sm:h-40 w-full items-center justify-center mb-3">
                <Image
                  src={reward.image}
                  alt={reward.title}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {reward.title}
              </h3>

              {/* Description */}
              <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                {reward.description}
              </p>

              {/* Link CTA */}
              <Link
                href={reward.href}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#ed1385] transition-colors hover:text-[#c70b6e]"
              >
                <span>{reward.link}</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}