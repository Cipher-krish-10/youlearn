import { WorkspaceView } from "@/features/workspace/components/workspace-view";
import { PlayerProvider } from "@/features/workspace/player-context";

const TABS = ["transcript", "summary", "notes", "flashcards", "quiz", "tutor"];

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ videoId: string }>;
  searchParams: Promise<{ tab?: string; t?: string }>;
}) {
  const { videoId } = await params;
  const { tab, t } = await searchParams;
  const initialTab = tab && TABS.includes(tab) ? tab : "transcript";
  const parsedT = Number(t);
  const startSec =
    Number.isFinite(parsedT) && parsedT > 0 ? Math.floor(parsedT) : undefined;
  return (
    <PlayerProvider>
      <WorkspaceView
        videoId={videoId}
        initialTab={initialTab}
        startSec={startSec}
      />
    </PlayerProvider>
  );
}
