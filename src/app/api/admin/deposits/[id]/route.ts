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
      status !== "PENDING" &&
      status !== "APPROVED" &&
      status !== "REJECTED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deposit status.",
        },
        { status: 400 }
      );
    }

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

    /*
     * Only pending deposits can change state.
     */
    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only pending deposits can be updated.",
        },
        { status: 400 }
      );
    }

    /*
     * Demo balance handling:
     *
     * When approved, the amount is added to
     * the user's balance.
     *
     * When rejected, no balance change occurs.
     */

    if (status === "APPROVED") {
      const user =
        await db.orm.public.User.first({
          id: deposit.userId,
        });

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            message: "Deposit owner not found.",
          },
          { status: 404 }
        );
      }

      const newBalance =
        Number(user.balance) +
        Number(deposit.amount);

      await db.orm.public.User
        .where({
          id: user.id,
        })
        .update({
          balance: String(newBalance),
        });
    }

    const updated =
      await db.orm.public.Deposit
        .where({ id })
        .update({
          status,
        });

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Deposit approved and balance updated."
          : status === "REJECTED"
            ? "Deposit rejected."
            : "Deposit moved back to pending.",
      deposit: updated
        ? {
            id: updated.id,
            amount: Number(updated.amount),
            method: updated.method,
            reference: updated.reference,
            status: updated.status,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "ADMIN_DEPOSIT_UPDATE_ERROR:",
      error
    );

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