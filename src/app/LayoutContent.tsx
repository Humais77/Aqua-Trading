"use client";

import { usePathname } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  const isDashboard =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  const isAdmin =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  /*
   * Public Navbar/Footer are completely hidden
   * inside authenticated areas.
   */
  const hideChrome =
    isAuthPage ||
    isDashboard ||
    isAdmin;

  return (
    <>
      {!hideChrome && <Navbar />}

      <main>{children}</main>

      {!hideChrome && <Footer />}
    </>
  );
}