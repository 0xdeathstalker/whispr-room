export default function Home() {
  return (
    <div className="container mx-auto min-h-screen w-full max-w-[100ch] px-4">
      <div className="pt-20 pb-6">
        <h1 className="text-center font-sans">/whisprroom</h1>

        <p className="text-center font-mono">a disposable chat room</p>
      </div>

      <div className="mx-auto flex h-96 w-full max-w-md flex-col items-center justify-center rounded-md border border-neutral-800">
        <input
          className="mb-6 h-9 rounded-md border border-neutral-600 indent-2 placeholder:font-mono"
          placeholder="enter username"
        />
        <div className="space-y-4 font-mono">
          <button className="flex h-9 items-center justify-center rounded-md px-3 py-2 dark:bg-neutral-200 dark:text-neutral-900">
            create room
          </button>
          <button className="flex h-9 items-center justify-center rounded-md border border-neutral-500 px-3 py-2 hover:bg-neutral-800">
            join a room
          </button>
        </div>
      </div>
    </div>
  );
}
