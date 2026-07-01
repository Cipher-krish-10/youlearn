import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* --- Building blocks --------------------------------------------------- */

export function VideoCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  );
}

export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-5">
      <Skeleton className="size-10 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <Skeleton className="h-3 w-12 shrink-0" />
    </div>
  );
}

function PageHeaderSkeleton({ withAction = true }: { withAction?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      {withAction && <Skeleton className="h-10 w-32 rounded-md" />}
    </div>
  );
}

/* --- Full-screen loaders ---------------------------------------------- */

export function GridPageSkeleton({
  count = 8,
  withFilters = false,
}: {
  count?: number;
  withFilters?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl animate-fade-rise space-y-8">
      <PageHeaderSkeleton />
      {withFilters && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function ListPageSkeleton({
  count = 5,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("mx-auto max-w-4xl animate-fade-rise space-y-8", className)}
    >
      <PageHeaderSkeleton withAction={false} />
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <ListRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-fade-rise space-y-10">
      <div className="space-y-2.5">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-xl border bg-card p-3">
            <Skeleton className="aspect-video w-40 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2 py-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}

export function WorkspaceSkeleton() {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="h-4 w-32" />
        <div className="ml-auto flex gap-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
      <div className="grid min-h-0 flex-1 xl:grid-cols-[1fr_400px]">
        <div className="overflow-hidden">
          <div className="mx-auto max-w-3xl animate-fade-rise space-y-8 px-4 py-6 sm:px-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
        <div className="hidden border-l p-4 xl:block">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="ml-auto h-12 w-2/3 rounded-lg" />
            <Skeleton className="h-20 w-5/6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
