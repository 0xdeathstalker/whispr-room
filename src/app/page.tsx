import Footer from "@/components/sections/footer";
import Hero from "@/components/sections/hero";
import MainForm from "@/components/sections/main-form";

export default function Home() {
  return (
    <div className="container mx-auto flex min-h-screen w-full max-w-[100ch] flex-col items-center justify-center px-4">
      <div className="mx-auto flex h-fit w-full max-w-md flex-col items-center justify-between rounded-md border p-7 shadow-lg sm:max-w-lg sm:p-14 dark:shadow-none">
        <Hero />

        <MainForm />
      </div>

      <Footer />
    </div>
  );
}
