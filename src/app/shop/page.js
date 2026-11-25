"use client";

export default function Home() {
  const Card = ({ icon, title, children }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <h2 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h2>
      </div>
      <div className="bg-white/[0.05] backdrop-blur-md">{children}</div>
    </div>
  );

  return (
    <main className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-10">
      <div className="w-full md:max-w-[900px] xl:max-w-[1100px] mx-auto flex flex-col gap-6">
        <Card icon="🛍️" title="Shop (Coming soon)">
          <div className="flex justify-center p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/amazon-25.png"
              alt="Carte cadeau Amazon 25€"
              width={241}
              height={145}
              className="w-full max-w-[241px] h-auto"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
