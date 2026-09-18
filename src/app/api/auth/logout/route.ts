import { destroySession } from "@/src/lib/auth";
import { NextResponse } from "next/server";


export const runtime = "nodejs";

export async function POST() {
  await destroySession();

  return NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });
}