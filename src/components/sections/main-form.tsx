"use client";

import CreateButton from "@/components/sections/create-button";
import JoinButton from "@/components/sections/join-button";
import RoomIdInput from "@/components/sections/roomid-input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import getErrorMessage from "@/lib/actions/getErrorMessage";
import type { ButtonState } from "@/lib/types";
import { formSchema, type FormValues } from "@/lib/validation/room";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";

export default function MainForm() {
  const [createButtonState, setCreateButtonState] = React.useState<ButtonState>("idle");
  const [joinButtonState, setJoinButtonState] = React.useState<ButtonState>("idle");

  const router = useRouter();
  const posthog = usePostHog();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      roomId: "",
    },
  });

  const { mutate: createRoom, isPending: isCreateRoomMutationPending } = useMutation({
    mutationKey: ["createRoom"],
    mutationFn: useConvexMutation(api.rooms.createRoom),
    onSuccess: (data: { roomId: string }) => {
      if (data?.roomId) {
        setCreateButtonState("success");
        posthog.capture("room_created", { roomId: data.roomId, username: form.getValues("username") });
        router.push(`/room/${data.roomId}?username=${encodeURIComponent(form.getValues("username"))}`);
      }
    },
    onError: (error) => {
      setCreateButtonState("idle");
      toast(`error: ${error.message}`);
      posthog.capture("room_creation_failed", { username: form.getValues("username"), error: error.message });
    },
  });

  const { mutate: joinRoom, isPending: isJoinRoomMutationPending } = useMutation({
    mutationKey: ["joinRoom"],
    mutationFn: useConvexMutation(api.participants.joinRoom),
    onSuccess: (data: { roomId: string }) => {
      if (data?.roomId) {
        setJoinButtonState("success");
        router.push(`/room/${data.roomId}?username=${encodeURIComponent(form.getValues("username"))}`);
        posthog.capture("room_joined", { roomId: data.roomId, username: form.getValues("username") });
      }
    },
    onError: (error) => {
      setJoinButtonState("idle");
      const errorMessage = getErrorMessage(error);
      toast(`error: ${errorMessage}`);
      posthog.capture("room_joining_failed", { username: form.getValues("username"), error: error.message });
    },
  });

  function handleCreateRoom(data: FormValues) {
    if (!data.username) {
      toast.error("error: username is required to create room");
      return;
    }

    createRoom({ username: data.username });
  }

  function handleJoinRoom(data: FormValues) {
    if (!data.username || !data.roomId) {
      toast.error("error: both username and room Id is required");
      return;
    }

    joinRoom({ roomId: data.roomId, username: data.username });
  }

  return (
    <div className="mt-6 flex w-full flex-col items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateRoom)}
          className="flex w-full flex-col items-center gap-6 font-mono"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-muted-foreground">username</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="enter username or alias..."
                    className="font-mono text-sm placeholder:font-mono"
                    autoComplete="off"
                  />
                </FormControl>

                {/* <FormDescription className="text-muted-foreground text-xs">
                  this is your public display name.
                </FormDescription> */}

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-muted-foreground text-left text-sm">enter room id:</FormLabel>

                <FormControl>
                  <div className="flex items-center gap-2">
                    <RoomIdInput
                      value={field.value}
                      onChange={field.onChange}
                    />

                    <div className="w-full overflow-y-hidden">
                      <JoinButton
                        buttonState={joinButtonState}
                        setButtonState={setJoinButtonState}
                        isJoinRoomMutationPending={isJoinRoomMutationPending}
                        onClick={form.handleSubmit(handleJoinRoom)}
                      />
                    </div>
                  </div>
                </FormControl>

                {/* <FormDescription className="text-muted-foreground text-xs">
                  create a room if you don&apos;t have one.
                </FormDescription> */}

                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />

          <div className="w-full">
            <CreateButton
              buttonState={createButtonState}
              setButtonState={setCreateButtonState}
              isCreateRoomMutationPending={isCreateRoomMutationPending}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
