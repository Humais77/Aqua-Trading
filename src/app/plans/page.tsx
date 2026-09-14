import Plans from "@/src/components/Plans";


export default function PlansPage() {
  return (
    <>
      <section className="hero-glow grid-bg">
        <div className="container py-24 text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            Opportunities
          </span>

          <h1 className="mt-4 text-5xl font-black md:text-6xl">
            Explore Our <span className="gradient-text">Plans</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Review the demo plans, features and projected figures.
          </p>
        </div>
      </section>

      <Plans />
    </>
  );
}