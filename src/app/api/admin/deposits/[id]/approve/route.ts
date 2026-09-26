import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const result = await db.transaction(async (tx) => {
      const deposit =
        await tx.orm.public.Deposit.first({
          id,
        });

      if (!deposit) {
        throw new Error("DEPOSIT_NOT_FOUND");
      }

      // Prevent approving the same deposit twice.
      if (deposit.status !== "PENDING") {
        throw new Error("DEPOSIT_ALREADY_PROCESSED");
      }

      const user = await tx.orm.public.User.first({
        id: deposit.userId,
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      const currentBalance = Number(user.balance);
      const depositAmount = Number(deposit.amount);

      const newBalance =
        currentBalance + depositAmount;

      // Update deposit status.
      const approvedDeposit =
        await tx.orm.public.Deposit
          .where({
            id: deposit.id,
          })
          .update({
            status: "APPROVED",
            updatedAt: Temporal.Now.instant(),
          });
          if (!approvedDeposit) {
  throw new Error("DEPOSIT_UPDATE_FAILED");
}
      // Update user's balance.
      const updatedUser =
        await tx.orm.public.User
          .where({
            id: user.id,
          })
          .update({
           balance: newBalance.toString(),
            updatedAt: Temporal.Now.instant(),
          });
          if (!updatedUser) {
  throw new Error("USER_UPDATE_FAILED");
}
      return {
        deposit: approvedDeposit,
        user: updatedUser,
      };
    });

    return NextResponse.json({
      success: true,
      message:
        "Deposit approved and user balance updated successfully.",
      deposit: {
        id: result.deposit.id,
        status: result.deposit.status,
        amount: Number(result.deposit.amount),
      },
      user: {
        id: result.user.id,
        balance: Number(result.user.balance),
      },
    });
  } catch (error) {
    console.error("APPROVE_DEPOSIT_ERROR:", error);

    if (
      error instanceof Error &&
      error.message === "DEPOSIT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Deposit not found.",
        },
        { status: 404 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "DEPOSIT_ALREADY_PROCESSED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This deposit has already been processed.",
        },
        { status: 409 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The user associated with this deposit no longer exists.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Unable to approve deposit.",
      },
      { status: 500 }
    );
  }
}