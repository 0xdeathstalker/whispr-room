import Chat from "@/components/sections/chat";
import Hero from "@/components/sections/hero";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const roomId = await params;

  return (
    <div className="container mx-auto flex min-h-screen w-full max-w-[100ch] flex-col items-center justify-center px-4">
      <div className="mx-auto flex h-fit w-full max-w-md flex-col items-center justify-between rounded-md border border-neutral-300 p-7 shadow-lg sm:max-w-lg sm:p-14 dark:shadow-none">
        <Hero />

        <Chat roomId={roomId.id} />
      </div>
    </div>
  );
}
