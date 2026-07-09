"use client";

import { createContext, useContext, useMemo, useRef } from "react";

/** What the mounted YouTube player exposes to the rest of the workspace. */
export interface PlayerHandle {
  seekTo(sec: number): void;
  getCurrentTime(): number;
}

interface PlayerContextValue {
  register(handle: PlayerHandle | null): void;
  seekTo(sec: number): void;
  /** Null until the player is ready. */
  getCurrentTime(): number | null;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const detached: PlayerContextValue = {
  register: () => {},
  seekTo: () => {},
  getCurrentTime: () => null,
};

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const handleRef = useRef<PlayerHandle | null>(null);

  const value = useMemo<PlayerContextValue>(
    () => ({
      register: (handle) => {
        handleRef.current = handle;
      },
      seekTo: (sec) => handleRef.current?.seekTo(sec),
      getCurrentTime: () => handleRef.current?.getCurrentTime() ?? null,
    }),
    [],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

/** No-ops outside a PlayerProvider so components stay reusable. */
export function usePlayer(): PlayerContextValue {
  return useContext(PlayerContext) ?? detached;
}
