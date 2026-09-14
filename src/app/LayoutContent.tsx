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

  return (
    <>
      {!isAuthPage && <Navbar />}

      <main>{children}</main>

      {!isAuthPage && <Footer />}
    </>
  );
}