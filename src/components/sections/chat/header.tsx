"use client";

import CopyButton from "@/components/copy-button";
import Timer from "@/components/timer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronDown, EllipsisVertical, LoaderCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { api } from "../../../../convex/_generated/api";

export default function ChatHeader(props: { roomId: string }) {
  const router = useRouter();
  const [username] = useQueryState("username", { defaultValue: "" });

  const { data: participants, isLoading: isParticipantsLoading } = useQuery(
    convexQuery(api.participants.getParticipants, { roomId: props.roomId }),
  );

  const { data: room, isLoading: isRoomLoading } = useQuery(convexQuery(api.rooms.getRoom, { roomId: props.roomId }));

  const { mutate: leaveRoom, isPending: isLeaveRoomMutationPending } = useMutation({
    mutationKey: ["leaveRoom", props.roomId],
    mutationFn: useConvexMutation(api.rooms.leaveRoom),
    onSuccess: () => {
      router.push("/");
    },
  });

  return (
    <div className="flex items-center justify-between px-2 pb-2">
      <div className="flex items-center gap-1">
        <h1>#{props.roomId}</h1>
        <CopyButton textToCopy={props.roomId} />
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

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10 hover:text-destructive hidden size-[32px] transition-all ease-in-out sm:inline-flex"
            onClick={() => leaveRoom({ roomId: props.roomId, username })}
          >
            {isLeaveRoomMutationPending ? (
              <LoaderCircle className="h-3 w-3 animate-spin" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M124,216a12,12,0,0,1-12,12H48a12,12,0,0,1-12-12V40A12,12,0,0,1,48,28h64a12,12,0,0,1,0,24H60V204h52A12,12,0,0,1,124,216Zm108.49-96.49-40-40a12,12,0,0,0-17,17L195,116H112a12,12,0,0,0,0,24h83l-19.52,19.51a12,12,0,0,0,17,17l40-40A12,12,0,0,0,232.49,119.51Z"></path>
              </svg>
            )}
          </Button>

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
              <DropdownMenuItem onClick={() => leaveRoom({ roomId: props.roomId, username })}>
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
        </div>
      </div>
    </div>
  );
}
