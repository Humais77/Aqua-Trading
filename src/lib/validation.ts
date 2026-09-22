import { z } from "zod";

const normalizeUsername = (value: string) =>
  value.trim().toLowerCase();

const normalizeEmail = (value: string) =>
  value.trim().toLowerCase();

const normalizeName = (value: string) =>
  value.trim().replace(/\s+/g, " ");

const normalizeReferralCode = (value: string) =>
  value.trim().toUpperCase();

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username or email is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .transform(normalizeName)
    .pipe(
      z
        .string()
        .min(2, "Full name must be at least 2 characters.")
        .max(80, "Full name is too long.")
    ),

  username: z
    .string()
    .transform(normalizeUsername)
    .pipe(
      z
        .string()
        .min(3, "Username must be at least 3 characters.")
        .max(30, "Username must be 30 characters or less.")
        .regex(
          /^[a-z0-9_]+$/,
          "Username can only contain letters, numbers and underscores."
        )
    ),

  email: z
    .string()
    .transform(normalizeEmail)
    .pipe(
      z
        .string()
        .email("Please enter a valid email address.")
    ),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be 72 characters or less."),

  referralCode: z
    .string()
    .optional()
    .default("")
    .transform(normalizeReferralCode)
    .refine(
      (value) => value === "" || /^[A-Z0-9]+$/.test(value),
      {
        message: "Invalid referral code.",
      }
    ),
});