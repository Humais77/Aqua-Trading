import "temporal-polyfill/global"; // 👈 Add this at the top

import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

// Remove the manual globalThis.Temporal assignment entirely
// The polyfill import handles it for you

export const db = postgres<Contract>({
  contractJson,
  url: process.env["DATABASE_URL"]!,
});