"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut, Settings, User as UserIcon } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { initials, type AuthUser } from "@/features/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="size-9 border">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          <AvatarFallback>{initials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex items-center gap-3 py-2 normal-case">
          <Avatar className="size-9 border">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>{initials(user)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            {user.name && (
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
            )}
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <UserIcon />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <CreditCard />
            Billing
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
