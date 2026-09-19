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

    const users = await db.orm.public.User.all();
    const deposits = await db.orm.public.Deposit.all();
    const plans = await db.orm.public.Plan.all();

    const pendingDeposits = deposits.filter(
      (deposit) => deposit.status === "PENDING"
    ).length;

    const approvedDeposits = deposits.filter(
      (deposit) => deposit.status === "APPROVED"
    );

    const approvedDepositAmount =
      approvedDeposits.reduce(
        (total, deposit) =>
          total + Number(deposit.amount),
        0
      );

    return NextResponse.json({
      success: true,
      stats: {
        users: users.length,
        plans: plans.length,
        deposits: deposits.length,
        pendingDeposits,
        approvedDepositAmount,
      },
    });
  } catch (error) {
    console.error("ADMIN_DASHBOARD_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load dashboard.",
      },
      { status: 500 }
    );
  }
}