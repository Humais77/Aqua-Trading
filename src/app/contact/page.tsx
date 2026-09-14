"use client";

import { useEffect } from "react";

export default function ContactPage() {
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=9232146690418&text&type=phone_number&app_absent=0";

  useEffect(() => {
    window.location.href = whatsappUrl;
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fffafd] text-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting to WhatsApp...</h1>
        <p className="mt-2 text-sm text-slate-500">
          If you are not redirected automatically,{" "}
          <a
            href={whatsappUrl}
            className="font-bold text-[#ed1385] underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}