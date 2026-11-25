"use client";

import { useState } from "react";

export default function Home() {
  const items = [
    { amount: 25,  src: "/images/amazon-25.png",  width: 241 },
    { amount: 50,  src: "/images/amazon-50.png",  width: 240 },
    { amount: 100, src: "/images/amazon-100.png", width: 241 },
  ];

  const [pending, setPending] = useState(null);

  const Card = ({ icon, title, children }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 py-3 px-5 flex items-center gap-2">
        <span className="text-lg flex-shrink-0">{icon}</span>
        <h2 className="text-white text-sm font-bold uppercase tracking-widest">{title}</h2>
      </div>
      <div className="bg-white/[0.05] backdrop-blur-md">{children}</div>
    </div>
  );

  const confirmBuy = () => {
    // TODO: brancher la logique d'achat
    setPending(null);
  };

  return (
    <main className="flex flex-col w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-6 pb-10">
      <div className="w-full md:max-w-[900px] xl:max-w-[1100px] mx-auto flex flex-col gap-6">
        <Card icon="🛍️" title="Shop (Coming soon)">
          <div className="flex flex-col">
            {items.map((item, idx) => (
              <div
                key={item.amount}
                className={`flex items-center justify-between gap-4 px-4 sm:px-6 py-4 ${idx < items.length - 1 ? "border-b border-white/10" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={`Carte cadeau Amazon ${item.amount}€`}
                  width={item.width}
                  height={145}
                  className="w-1/2 sm:w-auto max-w-[241px] h-auto"
                />
                <button
                  onClick={() => setPending(item)}
                  className="bg-purple-500/80 hover:bg-purple-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={() => setPending(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1325] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-bold mb-2">Confirm purchase</h3>
            <p className="text-white/70 text-sm mb-6">
              Do you want to buy the Amazon gift card <span className="text-[#D6C48A] font-bold">{pending.amount} €</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPending(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuy}
                className="bg-purple-500/80 hover:bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
