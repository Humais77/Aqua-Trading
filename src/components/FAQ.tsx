"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../lib/data";


export default function FAQ() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="section bg-[#081a27]">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#16c784]">
            FAQ
          </span>

          <h2 className="mt-4 text-4xl font-black md:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = active === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d2a]"
              >
                <button
                  onClick={() => setActive(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-semibold"
                >
                  {faq.question}

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-[#16c784] transition ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 px-6 py-5 text-sm leading-7 text-slate-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}