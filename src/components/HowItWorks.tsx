export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Create an account",
      description: "Sign up and explore your dashboard.",
    },
    {
      id: "02",
      title: "Explore the plans",
      description: "Review amounts, returns and terms.",
    },
    {
      id: "03",
      title: "Follow your progress",
      description: "Manage your plans and member rewards.",
    },
  ];

  return (
    <section className="bg-[#fff0f6] py-14 text-[#171827]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
          {/* Left Title */}
          <div className="lg:col-span-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ed1385]">
              YOUR NEXT CHAPTER
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-black leading-tight">
              A simple way <br className="hidden sm:inline" />
              to get started.
            </h2>
          </div>

          {/* Right Steps */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-pink-100/80 text-xs font-black text-[#ed1385]">
                  {step.id}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}