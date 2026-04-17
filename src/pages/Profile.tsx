/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import {
  useEditProfileMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

export default function Profile() {
  const { data, isLoading, isError, error } = useUserInfoQuery(undefined);
  const [editProfile, { isLoading: isUpdating }] = useEditProfileMutation();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || "/tours";

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const err = error as FetchBaseQueryError;
  const user = data?.data?.data;


  // ✅ Sync API → form
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, form]);

  const { dirtyFields } = form.formState;

  // ✅ Submit
  const onSubmit = async (values: any) => {
    // 2. Create an object containing ONLY changed fields
    const updatedData = Object.keys(dirtyFields).reduce((acc: any, key) => {
      acc[key] = values[key];
      return acc;
    }, {});

    // 3. Optional: Don't even call the API if nothing changed
    if (Object.keys(updatedData).length === 0) {
      toast.info("No changes made.");
      return;
    }

    try {
      const res = await editProfile({
        userId: user._id,
        data: updatedData,
      }).unwrap();

      if (res.success) {
        toast.success("Profile has been successfully updated!");
      }
      navigate(from);
    } catch (err) {
      console.log("Update failed", err);
      toast.error("Something went wrong!");
    }
  };

  // ✅ Loading
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 min-h-screen">
        <Button disabled size="sm">
          <Spinner data-icon="inline-start" />
          Loading...
        </Button>
      </div>
    );
  }

  // ✅ Unauthorized
  if (isError && err?.status === 403) {
    return (
      <div className="flex justify-center items-center my-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
            <CardDescription>
              You need to login to view your profile
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <Card className={cn("w-full max-w-lg my-4")}>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="flex justify-center">
            <Avatar className="w-20 h-20 mx-auto">
              <AvatarImage src={user?.picture} />
              <AvatarFallback>
                {user?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <Form {...form}>
            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email (disabled) */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter phone number" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter address" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() =>
              form.reset({
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
                address: user?.address || "",
              })
            }
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
