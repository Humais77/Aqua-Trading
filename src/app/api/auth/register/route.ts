import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { registerSchema } from "@/src/lib/validation";
import { db } from "@/src/prisma/db";

function generateReferralCode(): string {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `AQUA${random}`;
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your information.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      username,
      email,
      password,
      referralCode,
    } = parsed.data;

    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedReferralCode =
      referralCode?.trim().toUpperCase() || null;

    // Check email
    const existingEmail = await db.orm.public.User.first({
      email: normalizedEmail,
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Check username
    const existingUsername = await db.orm.public.User.first({
      username: normalizedUsername,
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "This username is already taken.",
        },
        { status: 409 }
      );
    }

    // Validate referral code
    let referredById: string | null = null;

    if (normalizedReferralCode) {
      const referrer = await db.orm.public.User.first({
        referralCode: normalizedReferralCode,
      });

      if (!referrer) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid referral code.",
          },
          { status: 400 }
        );
      }

      referredById = referrer.id;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate unique referral code
    let newReferralCode = generateReferralCode();

    while (
      await db.orm.public.User.first({
        referralCode: newReferralCode,
      })
    ) {
      newReferralCode = generateReferralCode();
    }

    // Create user
    const user = await db.orm.public.User.create({
      fullName: name.trim(),
      username: normalizedUsername,
      email: normalizedEmail,
      passwordHash,
      referralCode: newReferralCode,
      referredById,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please login.",
        user: {
          id: user.id,
          name: user.fullName,
          username: user.username,
          email: user.email,
          referralCode: user.referralCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}