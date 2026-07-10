import "server-only";
import type {
  QuotaKind,
  QuotaRepository,
  UsageSnapshot,
} from "@/core/interfaces/repositories";

interface Row {
  month: string;
  counts: Record<QuotaKind, number>;
}

const emptyCounts = (): Record<QuotaKind, number> => ({
  workspace: 0,
  chat: 0,
  generation: 0,
  export: 0,
});

/** In-memory QuotaRepository. Held as a singleton by the factory. */
export class MemoryQuotaRepository implements QuotaRepository {
  private rows = new Map<string, Row>();

  async consume(
    userId: string,
    kind: QuotaKind,
    limit: number,
    month: string,
  ): Promise<boolean> {
    let row = this.rows.get(userId);
    if (!row || row.month !== month) {
      row = { month, counts: emptyCounts() };
      this.rows.set(userId, row);
    }
    if (row.counts[kind] >= limit) return false;
    row.counts[kind] += 1;
    return true;
  }

  async snapshot(userId: string, month: string): Promise<UsageSnapshot> {
    const row = this.rows.get(userId);
    const fresh = row && row.month === month;
    return {
      plan: "free",
      month,
      counts: fresh ? { ...row.counts } : emptyCounts(),
    };
  }
}
