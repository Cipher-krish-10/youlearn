import { WorkspaceView } from "@/features/workspace/components/workspace-view";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ videoId: string }>;
}) {
  const { videoId } = await params;
  return <WorkspaceView videoId={videoId} />;
}
