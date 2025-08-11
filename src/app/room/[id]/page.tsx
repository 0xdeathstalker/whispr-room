import ChatContent from "@/components/sections/chat-content";

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const roomId = await params;

  return (
    <div className="container mx-auto flex min-h-screen w-full max-w-[100ch] flex-col items-center justify-center px-4">
      <ChatContent roomId={roomId.id} />
    </div>
  );
}
