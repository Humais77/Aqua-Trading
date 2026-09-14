import { Users, TrendingUp, ShieldCheck, Headset } from "lucide-react";

export default function QuickFeatures() {
  const features = [
    {
      icon: Users,
      title: "Community",
      subtitle: "Grow your network",
    },
    {
      icon: TrendingUp,
      title: "Your Plans",
      subtitle: "Track in one place",
    },
    {
      icon: ShieldCheck,
      title: "Your Account",
      subtitle: "Stay in control",
    },
    {
      icon: Headset,
      title: "Need Help?",
      subtitle: "Contact our team",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#fff0f6] py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] p-6 text-white shadow-lg shadow-pink-200/50 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 py-3 sm:py-0 sm:px-6 first:pl-0 last:pr-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <Icon size={26} className="text-white" />
                </div>
                <div>
                  <h4 className="text-base font-bold leading-snug">{item.title}</h4>
                  <p className="text-xs text-pink-100/90">{item.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}