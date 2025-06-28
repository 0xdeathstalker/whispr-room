"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Label } from "@/components/ui/label";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  console.log("[tasks] = ", { tasks });

  return (
    <div className="container mx-auto min-h-screen w-full max-w-[100ch] px-4">
      <div className="mx-auto mt-20 flex h-fit w-full max-w-lg flex-col items-center justify-between rounded-md border border-neutral-300 p-14 shadow-lg dark:shadow-none">
        <div>
          <h1 className="text-center font-mono">/whisprroom</h1>

          <p className="text-muted-foreground text-center font-sans text-sm">a disposable chat room</p>
        </div>

        <div className="mt-6 flex w-full flex-col items-center">
          <div className="flex w-full flex-col items-center gap-6 font-mono">
            <div className="w-full">
              <Label className="text-muted-foreground mb-2">username</Label>
              <Input
                placeholder="enter username or alias..."
                className="font-mono placeholder:font-mono"
              />
              <p className="text-muted-foreground mt-1 text-xs">this is your public display name.</p>
            </div>

            <div className="w-full">
              <div className="flex items-end justify-between">
                <div>
                  <Label className="text-muted-foreground mb-2">enter chatId:</Label>
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
              <Button className="w-full">create room</Button>
              <p className="text-muted-foreground mt-2 text-center text-xs">create room and share it with others.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
