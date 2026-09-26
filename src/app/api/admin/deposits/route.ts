import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

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

    const deposits =
      await db.orm.public.Deposit.all();

    const users =
      await db.orm.public.User.all();

    const userMap = new Map(
      users.map((user) => [
        user.id,
        user,
      ])
    );

    const result = deposits
      .sort(
        (a, b) =>
         new Date(String(b.createdAt)).getTime() -
          new Date(String(a.createdAt)).getTime()
      )
      .map((deposit) => {
        const user =
          userMap.get(deposit.userId);

        return {
          id: deposit.id,
          userId: deposit.userId,

          amount: Number(
            deposit.amount
          ),

          method: deposit.method,

          reference:
            deposit.reference,

          transactionReference:
            deposit.transactionReference ??
            null,

          proofUrl:
            deposit.proofUrl ?? null,

          verificationType:
            deposit.proofUrl
              ? "SCREENSHOT"
              : deposit.transactionReference
              ? "TRANSACTION_ID"
              : null,

          status: deposit.status,

          createdAt:
            deposit.createdAt,

          updatedAt:
            deposit.updatedAt,

          user: user
            ? {
                id: user.id,
                fullName:
                  user.fullName,
                username:
                  user.username,
                email: user.email,
                balance: Number(
                  user.balance
                ),
              }
            : null,
        };
      });

    return NextResponse.json({
      success: true,
      deposits: result,
    });
  } catch (error) {
    console.error(
      "ADMIN_DEPOSITS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load deposits.",
      },
      { status: 500 }
    );
  }
}