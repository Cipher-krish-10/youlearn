import { watchUrl } from "@/lib/youtube";

/** The video that always has a bundled transcript for a guaranteed demo. */
export const SAMPLE_YOUTUBE_ID = "wjZofJX0v4M";
export const SAMPLE_URL = watchUrl(SAMPLE_YOUTUBE_ID);

/** Store id of the seeded sample video, and its workspace path. */
export const SAMPLE_VIDEO_ID = "v_transformers";
export const SAMPLE_WORKSPACE_PATH = `/workspace/${SAMPLE_VIDEO_ID}`;
