import type { Metadata } from "next";
import {
  BookOpen,
  FileText,
  Github,
  Globe,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Resources" };

interface Resource {
  title: string;
  source: string;
  type: string;
  icon: LucideIcon;
  href: string;
}

const groups: { heading: string; items: Resource[] }[] = [
  {
    heading: "From “Transformers, explained”",
    items: [
      {
        title: "Attention Is All You Need",
        source: "arXiv · original paper",
        type: "Paper",
        icon: FileText,
        href: "#",
      },
      {
        title: "The Illustrated Transformer",
        source: "jalammar.github.io",
        type: "Article",
        icon: Globe,
        href: "#",
      },
      {
        title: "nanoGPT",
        source: "github.com/karpathy",
        type: "Repository",
        icon: Github,
        href: "#",
      },
    ],
  },
  {
    heading: "From “Database indexing deep dive”",
    items: [
      {
        title: "Use The Index, Luke",
        source: "use-the-index-luke.com",
        type: "Guide",
        icon: BookOpen,
        href: "#",
      },
      {
        title: "PostgreSQL Indexes documentation",
        source: "postgresql.org/docs",
        type: "Docs",
        icon: Globe,
        href: "#",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <PageHeader
        title="Resources"
        description="Curated reading and practice for the videos you're studying"
      />

      {groups.map((group) => (
        <section key={group.heading} className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <GraduationCap className="size-4" />
            {group.heading}
          </h2>
          <div className="space-y-3">
            {group.items.map((r) => (
              <a
                key={r.title}
                href={r.href}
                className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-foreground/20"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-muted-foreground">
                  <r.icon className="size-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium">{r.title}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.source}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {r.type}
                </Badge>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
