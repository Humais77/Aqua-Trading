import Link from "next/link";
import { Headset } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#fff0f6] border-t border-pink-100 text-[#171827]">
      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Subtitle */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#ed1385] text-[#ed1385]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-[#ed1385]">
                AQUA TRADING
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                INVEST TODAY, GROW TOMORROW
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8 text-xs font-semibold text-slate-700">
            <Link href="/" className="transition hover:text-[#ed1385]">
              Home
            </Link>
            <Link href="/plans" className="transition hover:text-[#ed1385]">
              Plans
            </Link>
            <Link href="/about" className="transition hover:text-[#ed1385]">
              About Us
            </Link>
            <Link href="/contact" className="transition hover:text-[#ed1385]">
              Contact
            </Link>
          </nav>

          {/* Get In Touch */}
          <Link
            href="/contact"
            className="flex items-center gap-2 text-xs font-bold text-[#ed1385] hover:underline"
          >
            <Headset size={16} />
            <span>Get in Touch</span>
          </Link>
        </div>

        {/* Divider & Bottom Bar */}
        <div className="mt-8 border-t border-pink-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-slate-500">
          <div>© 2026 AQUA TRADING. All rights reserved.</div>
          <div>
            Small Steps. <span className="font-bold text-[#ed1385]">Brighter Tomorrow.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}