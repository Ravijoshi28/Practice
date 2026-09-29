// src/lib/prisma.js
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js"; // keep your correct path

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

// Prints only the host—not your password
console.log(
  "Runtime database host:",
  new URL(connectionString).hostname
);

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
});

export default prisma;
