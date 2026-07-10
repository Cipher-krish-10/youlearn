import "server-only";
import { prisma } from "@/core/providers/database/prisma-client";
import type {
  QuotaKind,
  QuotaRepository,
  UsageSnapshot,
} from "@/core/interfaces/repositories";

const COLUMN: Record<QuotaKind, "workspaceCount" | "chatCount" | "generationCount" | "exportCount"> = {
  workspace: "workspaceCount",
  chat: "chatCount",
  generation: "generationCount",
  export: "exportCount",
};

/**
 * Postgres-backed usage counters. The guarded `updateMany` makes the
 * check-and-increment atomic — two concurrent requests can't both pass a
 * `count < limit` check and overshoot the cap.
 */
export class PrismaQuotaRepository implements QuotaRepository {
  async consume(
    userId: string,
    kind: QuotaKind,
    limit: number,
    month: string,
  ): Promise<boolean> {
    const column = COLUMN[kind];

    // Lazy monthly reset — idempotent, so racing requests are harmless.
    await prisma.user.updateMany({
      where: { id: userId, NOT: { usageResetMonth: month } },
      data: {
        workspaceCount: 0,
        chatCount: 0,
        generationCount: 0,
        exportCount: 0,
        usageResetMonth: month,
      },
    });

    const res = await prisma.user.updateMany({
      where: { id: userId, [column]: { lt: limit } },
      data: { [column]: { increment: 1 } },
    });
    return res.count === 1;
  }

  async snapshot(userId: string, month: string): Promise<UsageSnapshot> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        usageResetMonth: true,
        workspaceCount: true,
        chatCount: true,
        generationCount: true,
        exportCount: true,
      },
    });
    const stale = !user || user.usageResetMonth !== month;
    return {
      plan: user?.plan ?? "free",
      month,
      counts: {
        workspace: stale ? 0 : user.workspaceCount,
        chat: stale ? 0 : user.chatCount,
        generation: stale ? 0 : user.generationCount,
        export: stale ? 0 : user.exportCount,
      },
    };
  }
}
