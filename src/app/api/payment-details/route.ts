import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/lib/auth";

export const runtime = "nodejs";

const allowedMethods = [
  "BANK_TRANSFER",
  "EASYPAISA",
  "JAZZCASH",
  "RAAST",
] as const;

type PaymentMethod = (typeof allowedMethods)[number];

function isPaymentMethod(
  value: string | null
): value is PaymentMethod {
  return (
    value !== null &&
    (allowedMethods as readonly string[]).includes(value)
  );
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const method = searchParams.get("method");

    if (!isPaymentMethod(method)) {
      return NextResponse.json(
        {
          message: "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    const detail =
      await db.orm.public.PaymentDetail.first({
        method,
        enabled: true,
      });

    return NextResponse.json({
      success: true,
      detail: detail ?? null,
    });
  } catch (error) {
    console.error("PAYMENT_DETAILS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Unable to load payment details.",
      },
      { status: 500 }
    );
  }
}
