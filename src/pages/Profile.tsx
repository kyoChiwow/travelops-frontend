"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ProfileFormData {
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
}

interface SettingsProfile1Props {
  defaultValues?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  className?: string;
}

export default function Profile({
  defaultValues = {
    name: "Alex Morgan",
    email: "alex.morgan@email.com",
    username: "alexmorgan",
    avatar:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/avatar/avatar8.jpg",
    bio: "Product designer with 8+ years of experience crafting intuitive digital experiences. Currently focused on design systems and accessibility.",
  },
  className,
}: SettingsProfile1Props) {
  const initials = defaultValues.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              defaultValue={defaultValues.name}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              defaultValue={defaultValues.username}
              placeholder="Enter username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            defaultValue={defaultValues.email}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={4}
            defaultValue={defaultValues.bio}
            placeholder="Tell us about yourself"
          />
          <p className="text-xs text-muted-foreground">
            Brief description for your profile. Max 160 characters.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
}
