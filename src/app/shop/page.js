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
        <Card icon="🛍️" title="Boutique (A venir)">
          <table className="w-full table-auto text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.06] border-b-2 border-white/20 text-white/60 text-xs uppercase tracking-wide">
                <th className="py-2 px-5 font-semibold">Article</th>
                <th className="py-2 px-5 font-semibold text-right">Prix</th>
                <th className="py-2 px-5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.name} className={`border-b border-white/10 text-sm ${idx % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"}`}>
                  <td className="py-2.5 px-3 sm:px-5 text-white font-semibold">{item.name}</td>
                  <td className="py-2.5 px-3 sm:px-5 text-[#D6C48A] font-bold text-right whitespace-nowrap">{item.price}</td>
                  <td className="py-2.5 px-2 sm:px-5">
                    <div className="flex justify-center gap-1 sm:gap-2">
                      <button className="bg-purple-500/80 hover:bg-purple-600 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">Acheter</button>
                      <button className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg transition-colors border border-white/20 whitespace-nowrap">Vendre</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </main>
  );
}
