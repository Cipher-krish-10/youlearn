import { WorkspaceView } from "@/features/workspace/components/workspace-view";

const TABS = ["transcript", "summary", "notes", "flashcards", "quiz", "tutor"];

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { videoId } = await params;
  const { tab } = await searchParams;
  const initialTab = tab && TABS.includes(tab) ? tab : "transcript";
  return <WorkspaceView videoId={videoId} initialTab={initialTab} />;
}
