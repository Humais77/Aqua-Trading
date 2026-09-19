import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/lib/auth";
import { depositSchema } from "@/src/lib/deposit-validation";

export const runtime = "nodejs";

function generateDepositReference() {
  const timestamp = Date.now().toString().slice(-8);

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `DEP-${timestamp}-${random}`;
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
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const parsed = depositSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Invalid deposit information.",
        },
        {
          status: 400,
        }
      );
    }

    const { amount, method } = parsed.data;

    let reference = generateDepositReference();

    let existingReference =
      await db.orm.public.Deposit.first({
        reference,
      });

    while (existingReference) {
      reference = generateDepositReference();

      existingReference =
        await db.orm.public.Deposit.first({
          reference,
        });
    }

    const deposit =
      await db.orm.public.Deposit.create({
        userId: user.id,
        amount: String(amount),
        method,
        reference,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Demo deposit request submitted successfully.",
        deposit: {
          id: deposit.id,
          amount: Number(deposit.amount),
          method: deposit.method,
          reference: deposit.reference,
          status: deposit.status,
          createdAt: deposit.createdAt,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("DEPOSIT_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to submit your deposit request.",
      },
      {
        status: 500,
      }
    );
  }
}