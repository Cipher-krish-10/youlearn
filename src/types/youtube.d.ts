// Minimal typings for the YouTube IFrame Player API (loaded at runtime).
interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  playVideo(): void;
  destroy(): void;
}

interface YTPlayerOptions {
  videoId: string;
  playerVars?: Record<string, string | number>;
  events?: { onReady?: (event: { target: YTPlayer }) => void };
}

interface Window {
  YT?: { Player: new (el: HTMLElement, options: YTPlayerOptions) => YTPlayer };
  onYouTubeIframeAPIReady?: () => void;
}
