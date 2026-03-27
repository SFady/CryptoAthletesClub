"use client";

export default function Home() {
  const items = [
    { name: "Chaussettes", price: "10 $" },
    { name: "T-Shirt",     price: "25 $" },
    { name: "Short",       price: "50 $" },
    { name: "Chaussures",  price: "100 $" },
    { name: "Montre",      price: "200 $" },
    { name: "Personnage",  price: "400 $" },
  ];

  return (
    <main className="flex flex-col w-full max-w-screen-xl mx-auto px-4 md:px-8 pt-6 pb-6">
      <div className="max-w-[600px] w-full mx-auto">
        <div className="rounded-xl overflow-hidden shadow-lg border border-white/10">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 text-white text-xs uppercase tracking-wide">
                <th className="py-3.5 px-5 font-semibold">Article</th>
                <th className="py-3.5 px-5 font-semibold text-right">Prix</th>
                <th className="py-3.5 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.name}
                  className={`border-b border-white/10 text-sm ${idx % 2 === 0 ? "bg-[#5C42A6]" : "bg-[#4e3899]"}`}
                >
                  <td className="py-4 px-5 text-white font-semibold">{item.name}</td>
                  <td className="py-4 px-5 text-[#D6C48A] font-bold text-right">{item.price}</td>
                  <td className="py-4 px-5">
                    <div className="flex justify-center gap-2">
                      <button className="bg-purple-500/80 hover:bg-purple-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        Acheter
                      </button>
                      <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-white/20">
                        Vendre
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
