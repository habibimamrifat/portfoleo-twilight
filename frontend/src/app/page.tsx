"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Welcome
        </h1>

        <p className="text-white/50">
          Visit my portfolio
        </p>

        <button
          onClick={() => router.push("/portfolio")}
          className="
            rounded-2xl
            border border-white/20
            bg-white/10
            px-6 py-3
            text-sm font-medium
            text-white
            backdrop-blur-xl
            transition-all
            duration-300
            hover:border-white/30
            hover:bg-white/20
            active:scale-95
          "
        >
          Visit Portfolio
        </button>
      </div>
    </main>
  );
}