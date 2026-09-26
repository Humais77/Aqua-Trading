import "temporal-polyfill/global";

import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Params
) {
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

    const { id } = await params;
    const body = await request.json();
    const status = body.status;

    if (
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only APPROVED or REJECTED status is allowed.",
        },
        { status: 400 }
      );
    }

    /*
     * APPROVAL
     *
     * Deposit status and user balance are updated
     * inside the same database transaction.
     */
    if (status === "APPROVED") {
      const result = await db.transaction(async (tx) => {
        const deposit =
          await tx.orm.public.Deposit.first({
            id,
          });

        if (!deposit) {
          throw new Error("DEPOSIT_NOT_FOUND");
        }

        /*
         * A deposit can only be approved once.
         * This prevents the user's balance from
         * being increased multiple times.
         */
        if (deposit.status !== "PENDING") {
          throw new Error(
            "DEPOSIT_ALREADY_PROCESSED"
          );
        }

        const user =
          await tx.orm.public.User.first({
            id: deposit.userId,
          });

        if (!user) {
          throw new Error("USER_NOT_FOUND");
        }

        const currentBalance = Number(
          user.balance
        );

        const depositAmount = Number(
          deposit.amount
        );

        const newBalance =
          currentBalance + depositAmount;

        /*
         * Mark deposit as approved.
         */
        const updatedDeposit =
          await tx.orm.public.Deposit
            .where({
              id: deposit.id,
            })
            .update({
              status: "APPROVED",
              updatedAt:
                Temporal.Now.instant(),
            });

        if (!updatedDeposit) {
          throw new Error(
            "DEPOSIT_UPDATE_FAILED"
          );
        }

        /*
         * Add deposit amount to user's balance.
         *
         * Decimal fields in the Prisma ORM 8
         * contract expect string values.
         */
        const updatedUser =
          await tx.orm.public.User
            .where({
              id: user.id,
            })
            .update({
              balance: newBalance.toString(),
              updatedAt:
                Temporal.Now.instant(),
            });

        if (!updatedUser) {
          throw new Error(
            "USER_UPDATE_FAILED"
          );
        }

        return {
          deposit: updatedDeposit,
          user: updatedUser,
        };
      });

      return NextResponse.json({
        success: true,

        message:
          "Deposit approved and user balance updated successfully.",

        deposit: {
          id: result.deposit.id,
          amount: Number(result.deposit.amount),
          method: result.deposit.method,
          reference: result.deposit.reference,
          transactionReference:
            result.deposit.transactionReference,
          status: result.deposit.status,
        },

        user: {
          id: result.user.id,
          balance: Number(result.user.balance),
        },
      });
    }

    /*
     * REJECTION
     *
     * Rejection does not modify the user's balance.
     */
    const deposit =
      await db.orm.public.Deposit.first({
        id,
      });

    if (!deposit) {
      return NextResponse.json(
        {
          success: false,
          message: "Deposit not found.",
        },
        { status: 404 }
      );
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "This deposit has already been processed.",
        },
        { status: 409 }
      );
    }

    const updated =
      await db.orm.public.Deposit
        .where({
          id,
        })
        .update({
          status: "REJECTED",
          updatedAt: Temporal.Now.instant(),
        });

    if (!updated) {
      throw new Error("DEPOSIT_UPDATE_FAILED");
    }

    return NextResponse.json({
      success: true,

      message: "Deposit rejected successfully.",

      deposit: {
        id: updated.id,
        amount: Number(updated.amount),
        method: updated.method,
        reference: updated.reference,
        transactionReference:
          updated.transactionReference,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_DEPOSIT_UPDATE_ERROR:",
      error
    );

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
      error.message ===
        "DEPOSIT_ALREADY_PROCESSED"
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

    if (
      error instanceof Error &&
      error.message === "DEPOSIT_UPDATE_FAILED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to update the deposit.",
        },
        { status: 500 }
      );
    }

    if (
      error instanceof Error &&
      error.message === "USER_UPDATE_FAILED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to update the user's balance.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update deposit status.",
      },
      { status: 500 }
    );
  }
}