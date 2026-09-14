import { Star } from "lucide-react";
import { testimonials } from "../lib/data";

export default function Testimonials() {
  return (
    <section className="section">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            Member Experience
          </span>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            What Members <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="rounded-2xl border border-white/10 bg-[#0b1d2a] p-7"
            >
              <div className="flex gap-1 text-[#16c784]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={15} fill="currentColor" />
                ))}
              </div>

              <p className="mt-6 leading-7 text-slate-400">
                “{testimonial.text}”
              </p>

              <div className="mt-7 border-t border-white/10 pt-5">
                <div className="font-bold">{testimonial.name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}