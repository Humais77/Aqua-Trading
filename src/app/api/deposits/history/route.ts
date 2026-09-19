import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { getCurrentUser } from "@/src/lib/auth";

export const runtime = "nodejs";

export async function GET() {
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

    const deposits =
      await db.orm.public.Deposit
        .where({
          userId: user.id,
        })
        .orderBy((deposit) =>
          deposit.createdAt.desc()
        )
        .all();

    return NextResponse.json({
      success: true,
      deposits: deposits.map((deposit) => ({
        id: deposit.id,
        amount: Number(deposit.amount),
        method: deposit.method,
        reference: deposit.reference,
        status: deposit.status,
        createdAt: deposit.createdAt.toString(),
      })),
    });
  } catch (error) {
    console.error("DEPOSIT_HISTORY_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load deposit history.",
      },
      {
        status: 500,
      }
    );
  }
}