import "server-only";
import type {
  QuotaKind,
  QuotaRepository,
  UsageSnapshot,
} from "@/core/interfaces/repositories";
import { QuotaExceededError } from "@/core/errors/provider-errors";
import { logger } from "@/core/logging/logger";

/** Monthly allowances per plan. "pro" is unmetered until billing exists. */
export const PLAN_LIMITS: Record<string, Record<QuotaKind, number>> = {
  free: { workspace: 5, chat: 50, generation: 15, export: 5 },
};

const FRIENDLY: Record<QuotaKind, string> = {
  workspace: "learning workspaces",
  chat: "AI chat messages",
  generation: "AI generations",
  export: "exports",
};

export function currentMonth(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

/**
 * Enforces per-user monthly quotas. Called by routes before any metered work;
 * throws QuotaExceededError (HTTP 402) when the plan's allowance is spent.
 */
export class QuotaService {
  constructor(private readonly quotas: QuotaRepository) {}

  async consume(userId: string, kind: QuotaKind): Promise<void> {
    const month = currentMonth();
    const snapshot = await this.quotas.snapshot(userId, month);
    const limits = PLAN_LIMITS[snapshot.plan];
    if (!limits) return; // unmetered plan (e.g. "pro")

    const allowed = await this.quotas.consume(userId, kind, limits[kind], month);
    logger.info("quota.consume", { operation: kind, allowed, month });
    if (!allowed) {
      throw new QuotaExceededError(
        `You've used all ${limits[kind]} ${FRIENDLY[kind]} on the free plan this month. Upgrade to keep going.`,
      );
    }
  }

  /**
   * Give back a unit that was consumed for work that ended up failing, so a
   * bad URL or a provider error doesn't permanently cost the user a slot of
   * their monthly allowance.
   */
  async release(userId: string, kind: QuotaKind): Promise<void> {
    const month = currentMonth();
    const snapshot = await this.quotas.snapshot(userId, month);
    if (!PLAN_LIMITS[snapshot.plan]) return; // unmetered plan never consumed

    await this.quotas.release(userId, kind, month);
    logger.info("quota.release", { operation: kind, month });
  }

  async usage(
    userId: string,
  ): Promise<UsageSnapshot & { limits: Record<QuotaKind, number> | null }> {
    const snapshot = await this.quotas.snapshot(userId, currentMonth());
    return { ...snapshot, limits: PLAN_LIMITS[snapshot.plan] ?? null };
  }
}
