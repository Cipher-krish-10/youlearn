import {
  LayoutDashboard,
  Library,
  FolderKanban,
  StickyNote,
  Layers,
  MessagesSquare,
  BookMarked,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Videos", href: "/library", icon: Library },
  { label: "Collections", href: "/collections", icon: FolderKanban },
  { label: "Saved Notes", href: "/notes", icon: StickyNote },
  { label: "Flashcards", href: "/flashcards", icon: Layers },
  { label: "AI Chats", href: "/chats", icon: MessagesSquare },
  { label: "Resources", href: "/resources", icon: BookMarked },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings },
];
