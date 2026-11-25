"use client";

export default function Home() {
  return (
    <main className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-10">
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/amazon-25.png"
          alt="Carte cadeau Amazon 25€"
          width={241}
          height={145}
          className="w-full max-w-[241px] h-auto"
        />
      </div>
    </main>
  );
}
