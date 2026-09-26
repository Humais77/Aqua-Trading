import { NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/lib/auth";

export const runtime = "nodejs";

const depositSchema = z
  .object({
    amount: z.coerce
      .number()
      .finite()
      .min(310, "Minimum deposit is Rs. 310.")
      .max(
        10000000,
        "Maximum deposit is Rs. 10,000,000."
      ),

    method: z.enum([
      "BANK_TRANSFER",
      "EASYPAISA",
      "JAZZCASH",
      "RAAST",
    ]),

    transactionReference: z
      .string()
      .trim()
      .max(
        100,
        "Transaction reference is too long."
      )
      .optional()
      .nullable(),

    proofUrl: z
      .string()
      .trim()
      .url("Invalid proof URL.")
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    const hasTransactionReference =
      typeof data.transactionReference === "string" &&
      data.transactionReference.trim().length >= 3;

    const hasProof =
      typeof data.proofUrl === "string" &&
      data.proofUrl.trim().length > 0;

    if (!hasTransactionReference && !hasProof) {
      ctx.addIssue({
        code: "custom",
        path: ["transactionReference"],
        message:
          "Enter a transaction ID or upload a payment screenshot.",
      });
    }
  });

function generateDepositReference() {
  return `DEP-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const parsed = depositSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ||
            "Invalid deposit information.",
        },
        { status: 400 }
      );
    }

    const {
      amount,
      method,
      transactionReference,
      proofUrl,
    } = parsed.data;

    const normalizedTransactionReference =
      transactionReference?.trim() || null;

    const normalizedProofUrl =
      proofUrl?.trim() || null;

    // Prevent the same external transaction ID
    // from being submitted more than once.
    if (normalizedTransactionReference) {
      const existingDeposit =
        await db.orm.public.Deposit.first({
          transactionReference:
            normalizedTransactionReference,
        });

      if (existingDeposit) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This transaction reference has already been submitted.",
          },
          { status: 409 }
        );
      }
    }

    // Internal Aqua Trading reference.
    const depositReference =
      generateDepositReference();

    const deposit =
      await db.orm.public.Deposit.create({
        userId: user.id,
        amount: String(amount),
        method,
        reference: depositReference,
        transactionReference:
          normalizedTransactionReference,
        proofUrl: normalizedProofUrl,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Deposit submitted successfully. It is now pending verification.",

        deposit: {
          id: deposit.id,
          amount: Number(deposit.amount),
          method: deposit.method,
          reference: deposit.reference,
          transactionReference:
            deposit.transactionReference,
          proofUrl: deposit.proofUrl,
          status: deposit.status,
          createdAt: deposit.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE_DEPOSIT_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to submit deposit right now.",
      },
      { status: 500 }
    );
  }
}
