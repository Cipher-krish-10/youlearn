"use client";

import Link from "next/link";
import { FolderKanban, FolderPlus, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  useAddVideoToCollection,
  useCollections,
} from "@/features/collections/use-collections";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AddToCollection({ videoId }: { videoId: string }) {
  const { data: collections, isLoading } = useCollections();
  const add = useAddVideoToCollection();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {add.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FolderPlus className="size-4" />
          )}
          Add to collection
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Add to collection</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="px-2 py-3 text-xs text-muted-foreground">Loading…</div>
        ) : collections && collections.length > 0 ? (
          collections.map((c) => (
            <DropdownMenuItem
              key={c.id}
              onClick={() =>
                add.mutate(
                  { collectionId: c.id, videoId },
                  {
                    onSuccess: () => toast.success(`Added to “${c.name}”`),
                    onError: (e) => toast.error(e.message),
                  },
                )
              }
            >
              <FolderKanban />
              <span className="truncate">{c.name}</span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-3 text-xs text-muted-foreground">
            No collections yet.
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/collections">
            <Plus />
            New collection
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
