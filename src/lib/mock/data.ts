/**
 * Frontend mock data. Realistic learning content used across the UI until the
 * backend (Milestone 5+) replaces it. No Lorem Ipsum — everything reads like a
 * real product seeded with real videos.
 */

export type VideoCategory =
  | "Engineering"
  | "AI & ML"
  | "Design"
  | "Product"
  | "Career";

export interface MockVideo {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  category: VideoCategory;
  durationSec: number;
  progress: number; // 0–100, how far the user has watched
  thumbnail: string;
  addedAgo: string;
  tags: string[];
}

const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const mockVideos: MockVideo[] = [
  {
    id: "v_transformers",
    youtubeId: "wjZofJX0v4M",
    title: "Transformers, explained: how LLMs actually work",
    channel: "3Blue1Brown",
    category: "AI & ML",
    durationSec: 1620,
    progress: 64,
    thumbnail: thumb("wjZofJX0v4M"),
    addedAgo: "2 hours ago",
    tags: ["Attention", "Neural Networks", "GPT"],
  },
  {
    id: "v_designsystems",
    youtubeId: "wARbgs5fmuQ",
    title: "Building a design system from scratch",
    channel: "Figma",
    category: "Design",
    durationSec: 2735,
    progress: 100,
    thumbnail: thumb("wARbgs5fmuQ"),
    addedAgo: "Yesterday",
    tags: ["Tokens", "Components", "Figma"],
  },
  {
    id: "v_rsc",
    youtubeId: "T8TZQ6k4SLE",
    title: "React Server Components, end to end",
    channel: "Vercel",
    category: "Engineering",
    durationSec: 2190,
    progress: 38,
    thumbnail: thumb("T8TZQ6k4SLE"),
    addedAgo: "2 days ago",
    tags: ["Next.js", "RSC", "Streaming"],
  },
  {
    id: "v_systemdesign",
    youtubeId: "bUHFg8CZFws",
    title: "System design interview: design a URL shortener",
    channel: "ByteByteGo",
    category: "Engineering",
    durationSec: 1485,
    progress: 0,
    thumbnail: thumb("bUHFg8CZFws"),
    addedAgo: "3 days ago",
    tags: ["Scalability", "Hashing", "Databases"],
  },
  {
    id: "v_postgres",
    youtubeId: "qw--VYLpxG4",
    title: "Database indexing deep dive — B-trees and beyond",
    channel: "Hussein Nasser",
    category: "Engineering",
    durationSec: 3015,
    progress: 21,
    thumbnail: thumb("qw--VYLpxG4"),
    addedAgo: "Last week",
    tags: ["PostgreSQL", "Indexes", "Performance"],
  },
  {
    id: "v_pm",
    youtubeId: "lOjMrFB7c4o",
    title: "How great product teams decide what to build",
    channel: "Lenny's Podcast",
    category: "Product",
    durationSec: 3680,
    progress: 12,
    thumbnail: thumb("lOjMrFB7c4o"),
    addedAgo: "Last week",
    tags: ["Roadmaps", "Prioritization", "Strategy"],
  },
];

export const continueWatching = mockVideos.filter(
  (v) => v.progress > 0 && v.progress < 100,
);

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  videoCount: number;
  color: string; // tailwind-ish accent expressed as oklch
}

export const mockCollections: MockCollection[] = [
  {
    id: "c_frontend",
    name: "Frontend Mastery",
    description: "React, Next.js, and modern web architecture",
    videoCount: 14,
    color: "oklch(0.62 0.19 265)",
  },
  {
    id: "c_ai",
    name: "AI Foundations",
    description: "From perceptrons to transformers",
    videoCount: 9,
    color: "oklch(0.65 0.17 300)",
  },
  {
    id: "c_interview",
    name: "Interview Prep",
    description: "System design and data structures",
    videoCount: 21,
    color: "oklch(0.66 0.15 230)",
  },
];

export interface ActivityItem {
  id: string;
  type: "summary" | "quiz" | "flashcards" | "note" | "completed";
  title: string;
  detail: string;
  time: string;
}

export const mockActivity: ActivityItem[] = [
  {
    id: "a1",
    type: "quiz",
    title: "Scored 9/10 on a quiz",
    detail: "Transformers, explained",
    time: "2h ago",
  },
  {
    id: "a2",
    type: "summary",
    title: "Generated a summary",
    detail: "React Server Components, end to end",
    time: "5h ago",
  },
  {
    id: "a3",
    type: "completed",
    title: "Finished a video",
    detail: "Building a design system from scratch",
    time: "Yesterday",
  },
  {
    id: "a4",
    type: "flashcards",
    title: "Reviewed 18 flashcards",
    detail: "Database indexing deep dive",
    time: "Yesterday",
  },
  {
    id: "a5",
    type: "note",
    title: "Added a note at 12:04",
    detail: "System design interview",
    time: "2 days ago",
  },
];

export const mockUser = {
  name: "Kris Uppal",
  email: "krishuppal@gmail.com",
  initials: "KU",
  plan: "Pro",
  avatar: "",
};

export const weeklyStreak = [
  { day: "Mon", minutes: 45, active: true },
  { day: "Tue", minutes: 62, active: true },
  { day: "Wed", minutes: 0, active: false },
  { day: "Thu", minutes: 38, active: true },
  { day: "Fri", minutes: 71, active: true },
  { day: "Sat", minutes: 25, active: true },
  { day: "Sun", minutes: 0, active: false },
];

export const learningStats = {
  videosCompleted: 47,
  hoursStudied: 128,
  flashcardsMastered: 312,
  currentStreak: 5,
};
