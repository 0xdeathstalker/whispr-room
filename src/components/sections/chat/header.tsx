"use client";

import { useConvexMutation } from "@convex-dev/react-query";
import { type UseMutateFunction, useMutation } from "@tanstack/react-query";
import { ChevronDown, EllipsisVertical, LoaderCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { usePostHog } from "posthog-js/react";
import * as React from "react";
import { toast } from "sonner";
import { useScramble } from "use-scramble";
import CopyButton from "@/components/copy-button";
import LeaveButton from "@/components/sections/chat/leave-button";
import Timer from "@/components/timer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaveRoom } from "@/context/leave-context";
import useParticipantsQuery from "@/lib/hooks/useParticipantsQuery";
import useRoomQuery from "@/lib/hooks/useRoomQuery";
import type { ButtonState, Participants } from "@/lib/types";
import { formSchema } from "@/lib/validation/room";
import { api } from "../../../../convex/_generated/api";

export default function ChatHeader({ roomId }: { roomId: string }) {
  const [username] = useQueryState("username", { defaultValue: "" });
  const router = useRouter();
  const posthog = usePostHog();

  const { isLeaving } = useLeaveRoom();

  const { ref, replay } = useScramble({
    text: `#${roomId}`,
    speed: 0.4,
  });

  const [leaveButtonState, setLeaveButtonState] = React.useState<ButtonState>("idle");

  const validationResult = formSchema.safeParse({ username, roomId });

  const { data: participants, isLoading: isParticipantsLoading } = useParticipantsQuery({ roomId });
  const { data: room, isLoading: isRoomLoading } = useRoomQuery({ roomId });

  const { mutate: leaveRoom, isPending: isLeaveRoomMutationPending } = useMutation({
    mutationKey: ["leaveRoom", roomId],
    mutationFn: useConvexMutation(api.rooms.leaveRoom),
    onSuccess: () => {
      setLeaveButtonState("idle");
      posthog.capture("room_left", { roomId, username });
      router.push("/");
    },
    onError: (error) => {
      posthog.capture("room_leave_failed", {
        roomId,
        username,
        error: error.message,
      });
    },
  });

  const { mutate: joinRoom } = useMutation({
    mutationKey: ["joinRoom"],
    mutationFn: useConvexMutation(api.participants.joinRoom),
    onSuccess: (data: { roomId: string }) => {
      toast.success(`success: joined room ${data.roomId}`);
      posthog.capture("joined_room", { username, roomId });
    },
    onError: (error) => {
      toast.error(`error: failed to join room:: ${error.message}`);
      posthog.capture("room_join_failed", { username, roomId });
      router.push("/");
    },
  });

  function handleLeaveRoom() {
    isLeaving.current = true;
    leaveRoom({ roomId, username });
  }

  // const handleBeforeUnload = React.useCallback(() => {
  //   if (roomId && username) {
  //     isLeaving.current = true;
  //     leaveRoom({ roomId, username });
  //   }
  // }, [roomId, username, leaveRoom]);

  // auto join room when the user visits the url with valid username and room id
  React.useEffect(() => {
    if (isParticipantsLoading || !participants || isLeaving.current) return;

    const participantAlreadyExists = participants.find((p) => p.username === username);

    if (!participantAlreadyExists && validationResult.success) {
      joinRoom({ username, roomId });
    } else if (!validationResult.success) {
      toast.error(`error: Unable to join the room, username:'${username}' or roomId:'${roomId}' not validated`);
    }
    // doing nothing if participant already exists
  }, [username, roomId, participants, isParticipantsLoading]);

  // auto leave room when user closes tab/window
  // React.useEffect(() => {
  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [handleBeforeUnload]);

  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <div className="flex items-center gap-1">
        <h1
          ref={ref}
          onMouseOver={replay}
          onFocus={replay}
        />
        <CopyButton textToCopy={roomId} />
      </div>

      <div className="flex items-center gap-4">
        <div className="text-muted-foreground inline-flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isParticipantsLoading ? (
                <Skeleton className="h-9 w-14" />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden items-center gap-1 rounded-sm py-1 font-mono text-xs sm:flex sm:text-sm"
                >
                  <Users className="h-2 w-2" />
                  {participants?.length}
                  <ChevronDown className="h-1 w-1 md:h-2 md:w-2" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-muted-foreground p-1 font-mono text-xs">
                Participants
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants ? (
                participants.map((p) => (
                  <DropdownMenuItem
                    key={p._id}
                    className="font-mono text-xs"
                  >
                    {p.username === username ? `you(${p.username})` : p.username}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="text-xs">No participants</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isRoomLoading ? (
            <Skeleton className="h-9 w-[74px]" />
          ) : room ? (
            <Button
              variant="ghost"
              size="sm"
            >
              <Timer
                startTimestamp={room.createdAt}
                stopTimestamp={room.expiresAt}
              />
            </Button>
          ) : null}

          <LeaveButton
            buttonState={leaveButtonState}
            setButtonState={setLeaveButtonState}
            isLeaveRoomMutationPending={isLeaveRoomMutationPending}
            leaveRoom={handleLeaveRoom}
          />

          <MobileDropdown
            roomId={roomId}
            participants={participants}
            isParticipantsLoading={isParticipantsLoading}
            isLeaveRoomMutationPending={isLeaveRoomMutationPending}
            leaveRoom={leaveRoom}
          />
        </div>
      </div>
    </div>
  );
}

type MobileDropdownProps = {
  roomId: string;
  participants: Participants;
  isParticipantsLoading: boolean;
  isLeaveRoomMutationPending: boolean;
  leaveRoom: UseMutateFunction<
    null,
    Error,
    {
      roomId: string;
      username: string;
    },
    unknown
  >;
};

function MobileDropdown({
  roomId,
  participants,
  isParticipantsLoading,
  isLeaveRoomMutationPending,
  leaveRoom,
}: MobileDropdownProps) {
  const [username] = useQueryState("username", { defaultValue: "" });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="sm:hidden"
      >
        <Button
          variant="ghost"
          size="icon"
          className="size-[32px]"
        >
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {isParticipantsLoading ? (
                <Skeleton className="h-9 w-14" />
              ) : (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1 font-mono">
                    <Users className="h-2 w-2" />
                    {participants?.length}
                  </div>
                  <ChevronDown className="h-1 w-1 md:h-2 md:w-2" />
                </div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel className="text-muted-foreground px-1 py-1 font-mono text-xs">
                Participants
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {participants ? (
                participants.map((p) => (
                  <DropdownMenuItem
                    key={p._id}
                    className="font-mono text-xs"
                  >
                    {p.username === username ? `you(${p.username})` : p.username}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="font-mono text-xs">No participants</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => leaveRoom({ roomId, username })}>
          {isLeaveRoomMutationPending ? (
            <LoaderCircle className="h-3 w-3 animate-spin" />
          ) : (
            <div className="flex w-full items-center justify-between font-mono">
              <span>Leave</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>
              </svg>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
