import type { VideoDTO } from "@/features/ingestion/types";

export interface CollectionDTO {
  id: string;
  name: string;
  description: string | null;
  videoCount: number;
  createdAt: string;
}

export interface CollectionDetailDTO {
  collection: CollectionDTO;
  videos: VideoDTO[];
}
