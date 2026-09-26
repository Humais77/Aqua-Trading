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

    await db.orm.public.Deposit
      .where({
        id,
      })
      .update({
        status: "REJECTED",
        updatedAt: Temporal.Now.instant(),
      });

    return NextResponse.json({
      success: true,
      message: "Deposit rejected successfully.",
    });
  } catch (error) {
    console.error("REJECT_DEPOSIT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to reject deposit.",
      },
      { status: 500 }
    );
  }
}