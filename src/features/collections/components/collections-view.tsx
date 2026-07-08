"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderKanban, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
} from "@/features/collections/use-collections";
import { cn, focusRing } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function NewCollectionDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const create = useCreateCollection();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(
      { name: name.trim(), description: description.trim() || null },
      {
        onSuccess: () => {
          setOpen(false);
          setName("");
          setDescription("");
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="c-name">Name</Label>
            <Input
              id="c-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Frontend Mastery"
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="c-desc">Description (optional)</Label>
            <Textarea
              id="c-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this collection for?"
              rows={2}
              maxLength={200}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || create.isPending}>
              {create.isPending && <Loader2 className="size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CollectionsView() {
  const { data: collections, isLoading } = useCollections();
  const remove = useDeleteCollection();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        title="Collections"
        description="Group related videos into focused courses"
        action={
          <NewCollectionDialog
            trigger={
              <Button>
                <Plus className="size-4" />
                New collection
              </Button>
            }
          />
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : !collections || collections.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No collections yet"
          description="Create your first collection to organize videos by topic."
          action={
            <NewCollectionDialog
              trigger={
                <Button>
                  <Plus className="size-4" />
                  New collection
                </Button>
              }
            />
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div
              key={c.id}
              className="group relative flex flex-col rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20"
            >
              <Link
                href={`/collections/${c.id}`}
                aria-label={`Open ${c.name}`}
                className={cn("absolute inset-0 rounded-lg", focusRing)}
              />
              <div className="flex items-start justify-between">
                <span className="flex size-9 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                  <FolderKanban className="size-[18px]" />
                </span>
                <button
                  onClick={() => remove.mutate(c.id)}
                  aria-label="Delete collection"
                  className={cn(
                    "relative z-10 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive focus-visible:opacity-100 group-hover:opacity-100",
                    focusRing,
                  )}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <h3 className="mt-4 font-medium">{c.name}</h3>
              {c.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {c.description}
                </p>
              )}
              <span className="mt-4 text-xs text-muted-foreground tabular-nums">
                {c.videoCount} {c.videoCount === 1 ? "video" : "videos"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
