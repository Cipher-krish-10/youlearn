import "server-only";
import { PrismaClient } from "@/generated/prisma";
import { singleton } from "@/core/lib/singleton";

/** Prisma client singleton (survives dev hot-reload). Used by Prisma repos + pgvector. */
export const prisma = singleton(
  "prisma",
  () =>
    new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    }),
);
