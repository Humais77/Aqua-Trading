import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#16c784]/20 bg-[#0b3026] px-7 py-16 text-center md:px-16">
          <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#16c784]/10 blur-3xl" />

          <div className="relative">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#45e6ae]">
              Start Today
            </span>

            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black md:text-5xl">
              Ready to Take the Next Step?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-300">
              Create your account and explore the Aqua Trading member
              experience.
            </p>

            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#16c784] px-7 py-4 font-bold text-[#06141f] transition hover:bg-[#45e6ae]"
            >
              Create Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}