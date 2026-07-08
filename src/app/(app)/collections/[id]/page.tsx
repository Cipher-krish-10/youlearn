import type { Metadata } from "next";
import { CollectionDetailView } from "@/features/collections/components/collection-detail-view";

export const metadata: Metadata = { title: "Collection" };

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CollectionDetailView id={id} />;
}
