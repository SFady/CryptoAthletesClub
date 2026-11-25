"use client";

import { useState } from "react";

export default function Home() {
  const items = [
    { amount: 25,  src: "/images/amazon-25.png",  width: 241 },
    { amount: 50,  src: "/images/amazon-50.png",  width: 240, popular: true },
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
          <div className="p-4 sm:p-6">
            <p className="text-white/60 text-sm mb-5">Gift cards</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item) => (
                <div
                  key={item.amount}
                  className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {item.popular && (
                    <span className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-center bg-gradient-to-br from-white/[0.08] to-transparent px-6 py-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={`Carte cadeau Amazon ${item.amount}€`}
                      width={item.width}
                      height={145}
                      className="w-full max-w-[220px] h-auto drop-shadow-xl transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-3 p-4 border-t border-white/10">
                    <div className="flex items-baseline justify-between gap-2">
                      <div>
                        <p className="text-white font-semibold">Amazon Gift Card</p>
                        <p className="text-white/50 text-xs">Digital code · Delivered by email</p>
                      </div>
                      <p className="text-[#D6C48A] text-xl font-bold whitespace-nowrap">{item.amount} €</p>
                    </div>
                    <button
                      onClick={() => setPending(item)}
                      className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {pending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setPending(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1a1325] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg font-bold mb-4">Confirm purchase</h3>
            <div className="flex items-center gap-4 mb-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pending.src} alt="" width={pending.width} height={145} className="w-28 h-auto" />
              <div>
                <p className="text-white font-semibold text-sm">Amazon Gift Card</p>
                <p className="text-[#D6C48A] text-lg font-bold">{pending.amount} €</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPending(null)}
                className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuy}
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-opacity"
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
