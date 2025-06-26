"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  console.log("[tasks] = ", { tasks });

  return (
    <div className="container mx-auto min-h-screen w-full max-w-[100ch] px-4">
      <div className="mx-auto mt-20 flex h-96 w-full max-w-md flex-col items-center justify-between rounded-md border border-neutral-800 p-14">
        <div>
          <h1 className="mb-2 text-center font-mono">/whisprroom</h1>

          <p className="text-muted-foreground text-center font-sans">a disposable chat room</p>
        </div>

        <div className="flex w-full flex-col items-center">
          <Input
            placeholder="enter username..."
            className="font-mono placeholder:font-mono"
          />

          <div className="mt-6 flex w-full flex-col items-center gap-4 font-mono">
            <Button className="w-full">create room</Button>

            <Separator />

            <Button
              variant="outline"
              className="w-full"
            >
              join a room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
