import { z } from "zod";

export const depositSchema = z.object({
  amount: z.coerce
    .number()
    .finite()
    .min(310, "Minimum deposit is Rs. 310.")
    .max(10000000, "Maximum demo deposit is Rs. 10,000,000."),

  method: z.enum([
    "BANK_TRANSFER",
    "EASYPAISA",
    "JAZZCASH",
    "RAAST",
  ]),
});

export type DepositMethod = z.infer<
  typeof depositSchema
>["method"];