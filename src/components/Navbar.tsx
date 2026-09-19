"use client";

import Link from "next/link";
import {
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Plans", href: "/#plans" },
  { label: "Rewards", href: "/#whychooseus" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Contact", href: "/contact" },
];

type CurrentUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => {
    setOpen(false);
  };

  /*
   * Check currently logged-in user
   */
  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          if (mounted) {
            setUser(null);
          }
          return;
        }

        const data = await response.json();

        if (mounted && data.success && data.user) {
          setUser(data.user);
        } else if (mounted) {
          setUser(null);
        }
      } catch (error) {
        console.error("NAVBAR_USER_ERROR:", error);

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoadingUser(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  /*
   * Logout
   */
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      closeMenu();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("NAVBAR_LOGOUT_ERROR:", error);
    }
  };

  /*
   * Only actual pages should have an active/selected state.
   *
   * Hash links such as:
   * /#plans
   * /#whychooseus
   * /#how-it-works
   *
   * all have pathname "/". Therefore we do NOT mark them active
   * using pathname alone.
   */
  const isNavItemActive = (href: string) => {
    if (href.includes("#")) {
      return false;
    }

    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#fffafd]/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
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
            <div className="text-lg font-black leading-none tracking-tight text-slate-900">
              AQUA{" "}
              <span className="text-[#ff007a]">
                TRADING
              </span>
            </div>

            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
              INVEST TODAY, GROW TOMORROW
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
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

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {loadingUser ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-pink-100" />
          ) : user ? (
            <>
              {/* Admin Panel */}
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 rounded-full border border-pink-200/80 bg-white px-5 py-2.5 text-xs font-bold text-[#ff007a] shadow-sm transition hover:scale-105 hover:bg-pink-50 sm:text-sm"
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={2.5}
                  />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* User Dashboard */}
              {user.role === "USER" && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full border border-pink-200/80 bg-white px-5 py-2.5 text-xs font-bold text-[#ff007a] shadow-sm transition hover:scale-105 hover:bg-pink-50 sm:text-sm"
                >
                  <User
                    size={15}
                    strokeWidth={2.5}
                  />
                  <span>Dashboard</span>
                </Link>
              )}

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-300/60 transition hover:scale-105 hover:opacity-95 sm:text-sm"
              >
                <LogOut
                  size={15}
                  strokeWidth={2.5}
                />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-pink-200/80 bg-white px-5 py-2.5 text-xs font-bold text-[#ff007a] shadow-sm transition hover:scale-105 hover:bg-pink-50 sm:text-sm"
              >
                <User
                  size={15}
                  strokeWidth={2.5}
                />
                <span>Login</span>
              </Link>

              {/* Register */}
              <Link
                href="/register"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] via-[#ff2a93] to-[#e6006f] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-300/60 transition hover:scale-105 hover:opacity-95 sm:text-sm"
              >
                <User
                  size={15}
                  strokeWidth={2.5}
                />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-full border border-pink-200 bg-white p-2.5 text-[#ff007a] shadow-sm focus:outline-none lg:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-pink-100 bg-white/95 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-5">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.href);

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

            <div className="mt-4 border-t border-pink-100 pt-4">
              {loadingUser ? (
                <div className="h-12 w-full animate-pulse rounded-xl bg-pink-100" />
              ) : user ? (
                <div className="flex flex-col gap-2">
                  {/* Admin */}
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-full bg-[#ff007a] py-3 text-xs font-bold text-white shadow-md"
                    >
                      <ShieldCheck size={16} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {/* User */}
                  {user.role === "USER" && (
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white py-3 text-xs font-bold text-[#ff007a] shadow-sm"
                    >
                      <User size={15} />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] to-[#e6006f] py-3 text-xs font-bold text-white shadow-md"
                  >
                    <LogOut size={15} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Login */}
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-full border border-pink-200 bg-white py-3 text-xs font-bold text-[#ff007a] shadow-sm"
                  >
                    <User size={15} />
                    <span>Login</span>
                  </Link>

                  {/* Register */}
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#ff1183] to-[#e6006f] py-3 text-xs font-bold text-white shadow-md"
                  >
                    <User size={15} />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}