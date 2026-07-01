"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const options: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((opt) => {
        const active = mounted && theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "relative flex flex-col items-center gap-3 rounded-lg border bg-card p-5 transition-colors hover:border-foreground/20",
              active && "border-primary",
            )}
          >
            {active && (
              <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </span>
            )}
            <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
              <opt.icon className="size-5" />
            </span>
            <span className="text-sm font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
