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

    const plans = await db.orm.public.Plan
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
        isActive: plan.isActive,
        createdAt: plan.createdAt.toString(),
      })),
    });
  } catch (error) {
    console.error("ADMIN_PLANS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load plans.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const tagline = String(
      body.tagline ?? ""
    ).trim();
    const image = String(
      body.image ?? ""
    ).trim();

    const investment = Number(body.investment);
    const dailyProfit = Number(body.dailyProfit);
    const days = Number(body.days);
    const totalProfit = Number(body.totalProfit);
    const referBonus = Number(body.referBonus);

    if (
      !name ||
      !tagline ||
      !image ||
      !Number.isFinite(investment) ||
      !Number.isFinite(dailyProfit) ||
      !Number.isInteger(days) ||
      days <= 0 ||
      !Number.isFinite(totalProfit) ||
      !Number.isFinite(referBonus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid plan information.",
        },
        { status: 400 }
      );
    }

    const existing =
      await db.orm.public.Plan.first({
        name,
      });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A plan with this name already exists.",
        },
        { status: 409 }
      );
    }

    const plan =
      await db.orm.public.Plan.create({
        name,
        tagline,
        image,
        investment: String(investment),
        dailyProfit: String(dailyProfit),
        days,
        totalProfit: String(totalProfit),
        referBonus: String(referBonus),
      });

    return NextResponse.json(
      {
        success: true,
        message: "Plan created successfully.",
        plan: {
          id: plan.id,
          name: plan.name,
          tagline: plan.tagline,
          image: plan.image,
          investment: Number(plan.investment),
          dailyProfit: Number(plan.dailyProfit),
          days: plan.days,
          totalProfit: Number(plan.totalProfit),
          referBonus: Number(plan.referBonus),
          isActive: plan.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_PLAN_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create plan.",
      },
      { status: 500 }
    );
  }
}