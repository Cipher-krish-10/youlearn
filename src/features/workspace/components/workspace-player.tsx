"use client";

import { useEffect, useRef } from "react";
import { formatTimestamp } from "@/lib/utils";
import { usePlayer } from "@/features/workspace/player-context";

// The IFrame API script is a page-global; load it once across all players.
let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    });
  }
  return apiPromise;
}

export function WorkspacePlayer({
  youtubeId,
  title,
  channel,
  durationSec,
  startSec,
}: {
  youtubeId: string;
  title: string;
  channel: string | null;
  durationSec: number;
  startSec?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { register } = usePlayer();

  useEffect(() => {
    let player: YTPlayer | null = null;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT) return;
      // YT.Player replaces the element it's given, so mount on an inner div.
      const inner = document.createElement("div");
      mountRef.current.appendChild(inner);
      player = new window.YT.Player(inner, {
        videoId: youtubeId,
        playerVars: { rel: 0, ...(startSec ? { start: startSec } : {}) },
        events: {
          onReady: (event) => {
            if (cancelled) return;
            register({
              seekTo: (sec) => {
                event.target.seekTo(sec, true);
                event.target.playVideo();
              },
              getCurrentTime: () => event.target.getCurrentTime(),
            });
          },
        },
      });
    });

    return () => {
      cancelled = true;
      register(null);
      player?.destroy();
    };
  }, [youtubeId, startSec, register]);

  return (
    <div>
      <div className="overflow-hidden rounded-lg border bg-black">
        <div className="relative aspect-video">
          <div ref={mountRef} className="absolute inset-0 [&>iframe]:size-full" />
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-lg font-semibold leading-snug tracking-tight">
          {title}
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          {channel && <span className="text-foreground">{channel}</span>}
          {channel && durationSec > 0 && <span>·</span>}
          {durationSec > 0 && (
            <span className="tabular-nums">{formatTimestamp(durationSec)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
