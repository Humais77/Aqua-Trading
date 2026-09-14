import Link from "next/link";
import { ArrowRight, Target, Eye, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <section className="hero-glow grid-bg">
        <div className="container py-24 text-center md:py-32">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            About Aqua Trading
          </span>

          <h1 className="mt-5 text-5xl font-black md:text-7xl">
            Building a <span className="gradient-text">Smarter</span>
            <br />
            Trading Experience
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">
            A modern platform concept focused on giving members a simple,
            transparent and convenient digital experience.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
              Our Story
            </span>

            <h2 className="mt-4 text-4xl font-black">
              Designed Around the Member
            </h2>
          </div>

          <div className="space-y-5 leading-8 text-slate-400">
            <p>
              Aqua Trading is presented as a digital platform where members
              can explore available opportunities and manage their accounts
              through a centralized dashboard.
            </p>

            <p>
              The platform concept combines account management, plan tracking,
              rewards and referral features into a single experience.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-[#081a27]">
        <div className="container grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our Mission",
              text: "Create a simple and accessible digital experience for members.",
            },
            {
              icon: Eye,
              title: "Our Vision",
              text: "Build a trusted and modern platform centered around its community.",
            },
            {
              icon: ShieldCheck,
              title: "Our Values",
              text: "Security, clarity, responsible technology and member experience.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-[#0b1d2a] p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#16c784]/10 text-[#16c784]">
                  <Icon size={23} />
                </div>

                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="container text-center">
          <h2 className="text-4xl font-black">
            Ready to explore the platform?
          </h2>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#16c784] px-6 py-3 font-bold text-[#06141f]"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}