import { Gift, Users, Trophy, Star } from "lucide-react";

export default function RewardsPage() {
  const rewards = [
    {
      icon: Users,
      title: "Referral Rewards",
      text: "Invite new members and monitor your referral activity.",
    },
    {
      icon: Gift,
      title: "Member Bonuses",
      text: "Access platform-defined rewards and promotional benefits.",
    },
    {
      icon: Trophy,
      title: "Milestones",
      text: "Track achievements across your member journey.",
    },
    {
      icon: Star,
      title: "Rankings",
      text: "Participate in community rankings and recognition programs.",
    },
  ];

  return (
    <>
      <section className="hero-glow grid-bg">
        <div className="container py-24 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            Rewards
          </span>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Grow Your Network.
            <br />
            <span className="gradient-text">Unlock Rewards.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl leading-8 text-slate-400">
            Explore the demo rewards ecosystem built around referrals,
            achievements and member engagement.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-5 md:grid-cols-2">
          {rewards.map((reward) => {
            const Icon = reward.icon;

            return (
              <div
                key={reward.title}
                className="rounded-3xl border border-white/10 bg-[#0b1d2a] p-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16c784]/10 text-[#16c784]">
                  <Icon size={25} />
                </div>

                <h2 className="mt-6 text-2xl font-bold">{reward.title}</h2>

                <p className="mt-3 leading-7 text-slate-400">
                  {reward.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}