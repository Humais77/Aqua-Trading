import {
  LockKeyhole,
  Headphones,
  Gauge,
  Users,
} from "lucide-react";

export default function WhyAqua() {
  const features = [
    {
      icon: LockKeyhole,
      title: "Security First",
      text: "Account protection and secure authentication will be at the core of the production platform.",
    },
    {
      icon: Gauge,
      title: "Simple Dashboard",
      text: "Access investments, rewards, referrals and account information from one place.",
    },
    {
      icon: Users,
      title: "Referral Community",
      text: "Build and manage your referral network through an easy-to-use member system.",
    },
    {
      icon: Headphones,
      title: "Member Support",
      text: "A dedicated support experience helps members find answers and assistance.",
    },
  ];

  return (
    <section className="section">
      <div className="container grid items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            Why Aqua Trading
          </span>

          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Everything You Need,
            <br />
            <span className="gradient-text">In One Place</span>
          </h2>

          <p className="mt-6 max-w-xl leading-8 text-slate-400">
            Designed around a simple member experience, Aqua Trading brings
            account management, plans, rewards and referrals together in one
            modern platform.
          </p>

          <div className="mt-8 h-1 w-20 rounded-full bg-[#16c784]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-[#0b1d2a] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16c784]/10 text-[#16c784]">
                  <Icon size={21} />
                </div>

                <h3 className="mt-5 font-bold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}