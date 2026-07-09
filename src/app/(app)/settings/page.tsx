"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  Bell,
  CreditCard,
  Palette,
  ShieldAlert,
  User as UserIcon,
  Check,
} from "lucide-react";
import { useAuthUser } from "@/features/auth/use-auth-user";
import { initials } from "@/features/auth/types";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceSettings } from "@/features/settings/components/appearance-settings";

function SettingsCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-5">
        <h2 className="font-medium">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-5">{children}</div>
      {footer && (
        <div className="flex justify-end gap-2 border-t bg-muted/30 px-5 py-3.5">
          {footer}
        </div>
      )}
    </div>
  );
}

const notifications = [
  {
    title: "Weekly learning summary",
    description: "A recap of what you studied and your streak.",
    on: true,
  },
  {
    title: "Flashcards due for review",
    description: "Get reminded when cards are ready for spaced repetition.",
    on: true,
  },
  {
    title: "Processing complete",
    description: "Know the moment a new video's workspace is ready.",
    on: true,
  },
  {
    title: "Product updates",
    description: "Occasional emails about new features and improvements.",
    on: false,
  },
];

export default function SettingsPage() {
  const authUser = useAuthUser();
  const [notif, setNotif] = useState(notifications);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata ?? {};
      if (typeof meta.name === "string") setName(meta.name);
      if (typeof meta.bio === "string") setBio(meta.bio);
    });
  }, []);

  async function saveProfile() {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Name can't be empty.");
      return;
    }
    setSavingProfile(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      data: { name: trimmed, bio: bio.trim() },
    });
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  }

  const save = () => toast.success("Changes saved");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account, appearance, and preferences"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto p-1">
          <TabsTrigger value="profile">
            <UserIcon />
            Profile
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <SettingsCard
            title="Profile"
            description="This information appears across your workspace."
            footer={
              <Button onClick={saveProfile} disabled={savingProfile}>
                {savingProfile ? "Saving…" : "Save changes"}
              </Button>
            }
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border text-lg">
                  <AvatarFallback>
                    {authUser ? initials(authUser) : ""}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change photo
                  </Button>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    JPG or PNG, up to 2MB.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    key={`email-${authUser?.id ?? "loading"}`}
                    defaultValue={authUser?.email ?? ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  placeholder="A line or two about what you're learning."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <SettingsCard
            title="Appearance"
            description="Choose how YouLearn looks on this device."
          >
            <AppearanceSettings />
          </SettingsCard>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <SettingsCard
            title="Notifications"
            description="Decide what we email you about."
            footer={<Button onClick={save}>Save preferences</Button>}
          >
            <div className="divide-y">
              {notif.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch
                    checked={item.on}
                    onCheckedChange={(v) =>
                      setNotif((prev) =>
                        prev.map((n, idx) =>
                          idx === i ? { ...n, on: v } : n,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </SettingsCard>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <SettingsCard title="Plan">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="brand" className="px-2.5 py-1">
                  Pro
                </Badge>
                <div>
                  <p className="text-sm font-medium">$12 / month</p>
                  <p className="text-xs text-muted-foreground">
                    Renews on July 26, 2026
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Manage billing</Button>
                <Button variant="ghost" className="text-muted-foreground">
                  Cancel plan
                </Button>
              </div>
            </div>
            <Separator className="my-6" />
            <ul className="grid gap-2 sm:grid-cols-2">
              {[
                "Unlimited videos",
                "AI tutor with citations",
                "Spaced-repetition flashcards",
                "Priority processing",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </SettingsCard>

          {/* Danger zone */}
          <div className="rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="border-b border-destructive/20 p-5">
              <h2 className="flex items-center gap-2 font-medium text-destructive">
                <ShieldAlert className="size-4" />
                Danger zone
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Irreversible actions for your account.
              </p>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Delete account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently remove your library, notes, and data.
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() =>
                  toast.error("Account deletion is disabled in the preview")
                }
              >
                Delete account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
