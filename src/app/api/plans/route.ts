import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const plans = await db.orm.public.Plan
      .where({
        isActive: true,
      })
      .orderBy((plan) => plan.createdAt.asc())
      .all();

    return NextResponse.json({
      success: true,
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        tagline: plan.tagline,
        image: plan.image,
        investment: Number(plan.investment),
        dailyProfit: Number(plan.dailyProfit),
        days: plan.days,
        totalProfit: Number(plan.totalProfit),
        referBonus: Number(plan.referBonus),
      })),
    });
  } catch (error) {
    console.error("PUBLIC_PLANS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load plans.",
      },
      { status: 500 }
    );
  }
}