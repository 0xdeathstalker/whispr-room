import MainForm from "@/components/sections/main-form";

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen w-full max-w-[100ch] px-4">
      <div className="mx-auto mt-20 flex h-fit w-full max-w-lg flex-col items-center justify-between rounded-md border border-neutral-300 p-14 shadow-lg dark:shadow-none">
        <div>
          <h1 className="text-center font-mono">/whisprroom</h1>

          <p className="text-muted-foreground text-center font-sans text-sm">a disposable chat room</p>
        </div>

        <MainForm />
      </div>
    </div>
  );
}
