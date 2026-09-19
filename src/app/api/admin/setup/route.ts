import { NextResponse } from "next/server";

import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-admin-setup-secret");

    if (
      !secret ||
      secret !== process.env.ADMIN_SETUP_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    const user = await db.orm.public.User.first({
      email,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const updatedUser =
      await db.orm.public.User
        .where({
          id: user.id,
        })
        .update({
          role: "ADMIN",
        });

    return NextResponse.json({
      success: true,
      message: "User promoted to admin.",
      user: {
        id: updatedUser?.id,
        email: updatedUser?.email,
        role: updatedUser?.role,
      },
    });
  } catch (error) {
    console.error("ADMIN_SETUP_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to promote user.",
      },
      { status: 500 }
    );
  }
}