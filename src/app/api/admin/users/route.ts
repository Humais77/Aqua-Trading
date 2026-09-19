import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/src/prisma/db";
import { requireAdmin } from "@/src/lib/auth";

export const runtime = "nodejs";

function generateReferralCode() {
  const random = Math.floor(
    10000000 + Math.random() * 90000000
  );

  return `AQUA${random}`;
}

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

    const users = await db.orm.public.User
      .orderBy((user) => user.createdAt.desc())
      .all();

    return NextResponse.json({
      success: true,
      users: users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        balance: Number(user.balance),
        role: user.role,
        isVerified: user.isVerified,
        referralCode: user.referralCode,
        createdAt: user.createdAt.toString(),
      })),
    });
  } catch (error) {
    console.error("ADMIN_USERS_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load users.",
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

    const fullName = String(body.fullName ?? "").trim();
    const username = String(body.username ?? "")
      .trim()
      .toLowerCase();
    const email = String(body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(body.password ?? "");

    if (
      !fullName ||
      !username ||
      !email ||
      password.length < 6
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, username, email and a password of at least 6 characters are required.",
        },
        { status: 400 }
      );
    }

    const existingEmail =
      await db.orm.public.User.first({
        email,
      });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is already registered.",
        },
        { status: 409 }
      );
    }

    const existingUsername =
      await db.orm.public.User.first({
        username,
      });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    let referralCode = generateReferralCode();

    while (
      await db.orm.public.User.first({
        referralCode,
      })
    ) {
      referralCode = generateReferralCode();
    }

    const user =
      await db.orm.public.User.create({
        fullName,
        username,
        email,
        passwordHash,
        referralCode,
      });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        user: {
          id: user.id,
          fullName: user.fullName,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_USER_CREATE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create user.",
      },
      { status: 500 }
    );
  }
}