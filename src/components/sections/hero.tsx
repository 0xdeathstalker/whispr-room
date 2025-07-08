import Link from "next/link";

export default function Hero() {
  return (
    <div>
      <Link href="/">
        <h1 className="text-center font-mono">/whisprroom</h1>
      </Link>

      <p className="text-muted-foreground text-center font-sans text-sm">just create, share, and whisprrr.</p>
    </div>
  );
}
