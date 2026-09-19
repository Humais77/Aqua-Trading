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

    const existing =
      await db.orm.public.Plan.first({
        id,
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found.",
        },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = String(
        body.name
      ).trim();
    }

    if (body.tagline !== undefined) {
      updateData.tagline = String(
        body.tagline
      ).trim();
    }

    if (body.image !== undefined) {
      updateData.image = String(
        body.image
      ).trim();
    }

    if (body.investment !== undefined) {
      updateData.investment = String(
        Number(body.investment) || 0
      );
    }

    if (body.dailyProfit !== undefined) {
      updateData.dailyProfit = String(
        Number(body.dailyProfit) || 0
      );
    }

    if (body.days !== undefined) {
      updateData.days = Number(body.days);
    }

    if (body.totalProfit !== undefined) {
      updateData.totalProfit = String(
        Number(body.totalProfit) || 0
      );
    }

    if (body.referBonus !== undefined) {
      updateData.referBonus = String(
        Number(body.referBonus) || 0
      );
    }

    if (body.isActive !== undefined) {
      updateData.isActive =
        Boolean(body.isActive);
    }

    const updated =
      await db.orm.public.Plan
        .where({ id })
        .update(updateData);

    return NextResponse.json({
      success: true,
      message: "Plan updated successfully.",
      plan: updated
        ? {
            id: updated.id,
            name: updated.name,
            tagline: updated.tagline,
            image: updated.image,
            investment: Number(updated.investment),
            dailyProfit: Number(updated.dailyProfit),
            days: updated.days,
            totalProfit: Number(updated.totalProfit),
            referBonus: Number(updated.referBonus),
            isActive: updated.isActive,
          }
        : null,
    });
  } catch (error) {
    console.error("ADMIN_PLAN_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update plan.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
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

    const existing =
      await db.orm.public.Plan.first({
        id,
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan not found.",
        },
        { status: 404 }
      );
    }

    await db.orm.public.Plan
      .where({ id })
      .delete();

    return NextResponse.json({
      success: true,
      message: "Plan deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_PLAN_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete plan.",
      },
      { status: 500 }
    );
  }
}