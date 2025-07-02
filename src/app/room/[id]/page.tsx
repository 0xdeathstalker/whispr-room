import Chat from "@/components/sections/chat";
import Hero from "@/components/sections/hero";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const roomId = await params;

  return (
    <div className="container mx-auto min-h-screen w-full max-w-[100ch] px-4">
      <div className="mx-auto mt-20 flex h-fit w-full max-w-lg flex-col items-center justify-between rounded-md border border-neutral-300 p-14 shadow-lg dark:shadow-none">
        <Hero />

        <Chat roomId={roomId.id} />
      </div>
    </div>
  );
}
