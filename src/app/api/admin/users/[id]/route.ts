import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
      await db.orm.public.User.first({
        id,
      });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.fullName !== undefined) {
      updateData.fullName = String(
        body.fullName
      ).trim();
    }

    if (body.username !== undefined) {
      updateData.username = String(
        body.username
      )
        .trim()
        .toLowerCase();
    }

    if (body.email !== undefined) {
      updateData.email = String(body.email)
        .trim()
        .toLowerCase();
    }

    if (body.balance !== undefined) {
      updateData.balance = String(
        Number(body.balance) || 0
      );
    }

    if (body.isVerified !== undefined) {
      updateData.isVerified =
        Boolean(body.isVerified);
    }

    if (body.role === "USER" || body.role === "ADMIN") {
      updateData.role = body.role;
    }

    if (
      body.password &&
      String(body.password).length >= 6
    ) {
      updateData.passwordHash =
        await bcrypt.hash(
          String(body.password),
          12
        );
    }

    const updated =
      await db.orm.public.User
        .where({ id })
        .update(updateData);

    return NextResponse.json({
      success: true,
      message: "User updated successfully.",
      user: updated
        ? {
            id: updated.id,
            fullName: updated.fullName,
            username: updated.username,
            email: updated.email,
            balance: Number(updated.balance),
            role: updated.role,
            isVerified: updated.isVerified,
          }
        : null,
    });
  } catch (error) {
    console.error("ADMIN_USER_UPDATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update user.",
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

    if (id === admin.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot delete your own admin account.",
        },
        { status: 400 }
      );
    }

    const user =
      await db.orm.public.User.first({
        id,
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

    /*
     * Demo application:
     * remove the user's deposit records first
     * because Deposit has a foreign key to User.
     */
    await db.orm.public.Deposit
      .where({ userId: id })
      .deleteAll();

    await db.orm.public.User
      .where({ id })
      .delete();

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_USER_DELETE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete user.",
      },
      { status: 500 }
    );
  }
}