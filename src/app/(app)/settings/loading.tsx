import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-rise space-y-8">
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-28 rounded-md" />
        ))}
      </div>
      <div className="rounded-lg border bg-card">
        <div className="space-y-2 border-b p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-16 rounded-md" />
            <Skeleton className="h-16 rounded-md" />
          </div>
          <Skeleton className="h-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
