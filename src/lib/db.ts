import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

function resolveSqlitePath(): string {
  const raw = process.env.DATABASE_URL ?? "file:./dev.db";
  const filePath = raw.startsWith("file:") ? raw.slice("file:".length) : raw;

  // On Vercel, use a writable /tmp copy of the bundled seed database.
  if (process.env.VERCEL) {
    const bundled = path.join(process.cwd(), "data", "fungal.db");
    const tmp = path.join("/tmp", "fungal.db");
    if (!fs.existsSync(tmp) && fs.existsSync(bundled)) {
      fs.copyFileSync(bundled, tmp);
    }
    return tmp;
  }

  return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: resolveSqlitePath() });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/** In dev, avoid a long-lived Prisma client that predates schema/client regeneration. */
export const db =
  process.env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ??= createPrismaClient())
    : createPrismaClient();

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prisma = db;
}
