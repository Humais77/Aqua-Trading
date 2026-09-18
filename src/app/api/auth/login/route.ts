import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { createSession } from "@/src/lib/auth";
import { loginSchema } from "@/src/lib/validation";
import { db } from "@/src/prisma/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your login details.",
        },
        { status: 400 }
      );
    }

    const { identifier, password } = parsed.data;

    const normalizedIdentifier = identifier.trim().toLowerCase();

    // Try email first
    let user = await db.orm.public.User.first({
      email: normalizedIdentifier,
    });

    // If not found, try username
    if (!user) {
      user = await db.orm.public.User.first({
        username: normalizedIdentifier,
      });
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username/email or password.",
        },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username/email or password.",
        },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.fullName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to login right now.",
      },
      { status: 500 }
    );
  }
}