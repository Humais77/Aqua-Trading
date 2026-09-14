import type { Metadata } from "next";

import "./globals.css";
import LayoutContent from "./LayoutContent";

export const metadata: Metadata = {
  title: "Aqua Trading | Smart Trading & Investment",
  description:
    "A modern trading and investment platform demo built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}