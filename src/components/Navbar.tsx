"use client";

import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Plans", href: "/#plans" },
  { label: "Rewards", href: "/#whychooseus" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fffafd]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group"
        >
          {/* Logo Circle Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#ff007a] text-[#ff007a] shadow-sm">
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

          {/* Logo Text */}
          <div className="flex flex-col">
            <div className="text-lg font-black tracking-tight leading-none text-slate-900">
              AQUA <span className="text-[#ff007a]">TRADING</span>
            </div>
            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              INVEST TODAY, GROW TOMORROW
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 sm:gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? "rounded-full bg-[#ff007a] text-white shadow-md shadow-pink-300/50"
                    : "text-slate-600 hover:text-[#ff007a]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Action Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Login Pill */}
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full border border-pink-200/80 bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#ff007a] shadow-sm transition hover:bg-pink-50 hover:scale-105"
          >
            <User size={15} strokeWidth={2.5} />
            <span>Login</span>
          </Link>

          {/* Register Gradient Pill */}
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-pink-300/60 transition hover:opacity-95 hover:scale-105"
          >
            <User size={15} strokeWidth={2.5} />
            <span>Register</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-pink-200 bg-white p-2.5 text-[#ff007a] shadow-sm lg:hidden focus:outline-none"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="border-t border-pink-100 bg-white/95 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col px-6 py-5 gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-[#ff007a] text-white"
                      : "text-slate-700 hover:bg-pink-50 hover:text-[#ff007a]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-pink-100 pt-4">
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white py-3 text-xs font-bold text-[#ff007a] shadow-sm"
              >
                <User size={15} />
                <span>Login</span>
              </Link>

              <Link
                href="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] to-[#e6006f] py-3 text-xs font-bold text-white shadow-md"
              >
                <User size={15} />
                <span>Register</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}