import { ListPageSkeleton } from "@/components/shared/skeletons";

export default function Loading() {
  return <ListPageSkeleton count={4} className="max-w-5xl" />;
}
