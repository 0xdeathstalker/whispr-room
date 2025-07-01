"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MainForm() {
  const [username, setUsername] = React.useState<string>("");

  const router = useRouter();

  const { mutate: createRoom, isPending } = useMutation({
    mutationKey: ["createRoom", username],
    mutationFn: useConvexMutation(api.rooms.createRoom),
    onSuccess: (data: { roomId: string }) => {
      if (data?.roomId) {
        router.push(`/room/${data.roomId}?username=${username}`);
      }
    },
  });

  return (
    <div className="mt-6 flex w-full flex-col items-center">
      <div className="flex w-full flex-col items-center gap-6 font-mono">
        <div className="w-full">
          <Label className="text-muted-foreground mb-2">username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="enter username or alias..."
            className="font-mono placeholder:font-mono"
          />
          <p className="text-muted-foreground mt-1 text-xs">this is your public display name.</p>
        </div>

        <div className="w-full">
          <div className="flex items-end justify-between">
            <div>
              <Label className="text-muted-foreground mb-2">enter room id:</Label>
              <InputOTP
                maxLength={8}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              variant="outline"
              className="px-7"
            >
              join
            </Button>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">create a room if you don't have one.</p>
        </div>

        <Separator />

        <div className="w-full">
          <Button
            className="w-full"
            onClick={() => createRoom({ username })}
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : null}
            create a room
          </Button>
          <p className="text-muted-foreground mt-2 text-center text-xs">create room and share it with others.</p>
        </div>
      </div>
    </div>
  );
}
