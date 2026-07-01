import type { Metadata } from "next";
import { Plus, FolderKanban } from "lucide-react";
import { mockCollections } from "@/lib/mock/data";
import { cn, focusRing } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Collections" };

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Collections"
        description="Group related videos into focused courses"
        action={
          <Button>
            <Plus className="size-4" />
            New collection
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCollections.map((c) => (
          <button
            key={c.id}
            className={cn(
              "group flex flex-col rounded-lg border bg-card p-5 text-left transition-colors hover:border-foreground/20",
              focusRing,
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
              <FolderKanban className="size-[18px]" />
            </span>
            <h3 className="mt-4 font-medium">{c.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
            <span className="mt-4 text-xs text-muted-foreground tabular-nums">
              {c.videoCount} videos
            </span>
          </button>
        ))}

        {/* Create new */}
        <button
          className={cn(
            "flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
            focusRing,
          )}
        >
          <Plus className="size-5" />
          <span className="text-sm font-medium">New collection</span>
        </button>
      </div>
    </div>
  );
}
