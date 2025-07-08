"use client";

import RoomIdInput from "@/components/sections/roomid-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useConvexMutation } from "@convex-dev/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "../../../convex/_generated/api";

const formSchema = z.object({
  username: z.string().min(3, { message: "username should be atleast 3 characters" }),
  roomId: z.string().length(6, { message: "roomId should be 6 characters" }).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function MainForm() {
  const router = useRouter();

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
        router.push(`/room/${data.roomId}?username=${encodeURIComponent(form.getValues("username"))}`);
      }
    },
  });

  const { mutate: joinRoom, isPending: isJoinRoomMutationPending } = useMutation({
    mutationKey: ["joinRoom"],
    mutationFn: useConvexMutation(api.participants.joinRoom),
    onSuccess: (data: { roomId: string }) => {
      if (data?.roomId) {
        router.push(`/room/${data.roomId}?username=${encodeURIComponent(form.getValues("username"))}`);
      }
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

                    <div className="w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled={isJoinRoomMutationPending}
                        onClick={form.handleSubmit(handleJoinRoom)}
                      >
                        {isJoinRoomMutationPending ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <ArrowRight className="xs:hidden h-3 w-3" />
                        )}
                        <span className="xs:inline hidden">join</span>
                      </Button>
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
            <Button
              className="w-full"
              type="submit"
              disabled={isCreateRoomMutationPending}
            >
              {isCreateRoomMutationPending ? <LoaderCircle className="animate-spin" /> : null}
              create a room
            </Button>

            <Label className="text-muted-foreground mt-2 text-center text-xs">
              create room and share it with others.
            </Label>
          </div>
        </form>
      </Form>
    </div>
  );
}
