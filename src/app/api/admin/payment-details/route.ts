import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

const methods = [
  "BANK_TRANSFER",
  "EASYPAISA",
  "JAZZCASH",
  "RAAST",
] as const;

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    const details =
      await db.orm.public.PaymentDetail.all();

    return NextResponse.json({
      success: true,
      details,
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_DETAILS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load payment details.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Forbidden.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      method,
      title,
      accountTitle,
      accountNumber,
      instructions,
      enabled,
    } = body;

    if (!methods.includes(method)) {
      return NextResponse.json(
        {
          message:
            "Invalid payment method.",
        },
        { status: 400 }
      );
    }

    if (
      !title?.trim() ||
      !accountTitle?.trim() ||
      !accountNumber?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Title, account title and account number are required.",
        },
        { status: 400 }
      );
    }

    const existing =
      await db.orm.public.PaymentDetail.first({
        method,
      });

    let detail;

    if (existing) {
      detail =
        await db.orm.public.PaymentDetail
          .where({
            id: existing.id,
          })
          .update({
            title: title.trim(),
            accountTitle:
              accountTitle.trim(),
            accountNumber:
              accountNumber.trim(),
            instructions:
              instructions?.trim() || null,
            enabled:
              typeof enabled ===
              "boolean"
                ? enabled
                : true,
            updatedAt: Temporal.Now.instant(),
          });
    } else {
      detail =
        await db.orm.public.PaymentDetail.create({
          method,
          title: title.trim(),
          accountTitle:
            accountTitle.trim(),
          accountNumber:
            accountNumber.trim(),
          instructions:
            instructions?.trim() || null,
          enabled:
            typeof enabled ===
            "boolean"
              ? enabled
              : true,
        });
    }

    return NextResponse.json({
      success: true,
      detail,
    });
  } catch (error) {
    console.error(
      "ADMIN_PAYMENT_DETAILS_PATCH_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update payment details.",
      },
      { status: 500 }
    );
  }
}