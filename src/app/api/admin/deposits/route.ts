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
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    const deposits = await db.orm.public.Deposit
      .orderBy((deposit) => deposit.createdAt.desc())
      .all();

    const result = [];

    for (const deposit of deposits) {
      const user =
        await db.orm.public.User.first({
          id: deposit.userId,
        });

      result.push({
        id: deposit.id,
        userId: deposit.userId,
        user: user
          ? {
              fullName: user.fullName,
              username: user.username,
              email: user.email,
            }
          : null,
        amount: Number(deposit.amount),
        method: deposit.method,
        reference: deposit.reference,
        status: deposit.status,
        createdAt: deposit.createdAt.toString(),
      });
    }

    return NextResponse.json({
      success: true,
      deposits: result,
    });
  } catch (error) {
    console.error("ADMIN_DEPOSITS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load deposits.",
      },
      { status: 500 }
    );
  }
}