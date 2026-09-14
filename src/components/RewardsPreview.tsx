import Link from "next/link";
import { Gift, Users, Trophy } from "lucide-react";

export default function RewardsPreview() {
  const rewards = [
    {
      icon: Users,
      title: "Referral Rewards",
      text: "Invite members and track your referral activity.",
    },
    {
      icon: Gift,
      title: "Member Rewards",
      text: "Explore rewards available through the platform.",
    },
    {
      icon: Trophy,
      title: "Achievement System",
      text: "Track your progress and unlock platform milestones.",
    },
  ];

  return (
    <section className="section bg-[#081a27]">
      <div className="container">
        <div className="rounded-[2rem] border border-[#16c784]/15 bg-gradient-to-br from-[#0d3026] to-[#0b1d2a] p-8 md:p-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
                Rewards
              </span>

              <h2 className="mt-4 text-4xl font-black md:text-5xl">
                Grow Together.
                <br />
                <span className="gradient-text">Earn Rewards.</span>
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                The demo includes a complete rewards experience designed to
                encourage community growth and member engagement.
              </p>

              <Link
                href="/rewards"
                className="mt-7 inline-block rounded-xl bg-[#16c784] px-6 py-3 font-bold text-[#06141f] transition hover:bg-[#45e6ae]"
              >
                Explore Rewards
              </Link>
            </div>

            <div className="grid gap-4">
              {rewards.map((reward) => {
                const Icon = reward.icon;

                return (
                  <div
                    key={reward.title}
                    className="flex gap-5 rounded-2xl border border-white/10 bg-black/10 p-5"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#16c784]/10 text-[#16c784]">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="font-bold">{reward.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        {reward.text}
                      </p>
                    </div>
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