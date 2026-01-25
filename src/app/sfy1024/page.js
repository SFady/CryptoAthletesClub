export default function Sfy1024() {
  return (
    <main className="flex flex-col items-start min-h-screen text-white bg-[#5f3dc4] px-6 py-6">
      <h1 className="text-2xl mb-4">Ajouter une donnée</h1>

      <form
        action="/api/insert-data"
        method="POST"
        className="flex flex-col gap-4 w-full max-w-sm"
      >

        <select name="user_id" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Usopp</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Nico Robin</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">DTeach</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Jinbe</option>
        </select>

        <input
          type="date"
          name="date_claimed"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="defit_amount"
          placeholder="defit_amount"
          required
          className="px-3 py-2 rounded text-black"
        />

        <select name="activity_type" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="1" className="bg-[#8d6bf2] text-[#f3f0ff]">Running</option>
          <option value="2" className="bg-[#8d6bf2] text-[#f3f0ff]">Marche</option>
          <option value="3" className="bg-[#8d6bf2] text-[#f3f0ff]">Cyclisme</option>
          <option value="4" className="bg-[#8d6bf2] text-[#f3f0ff]">Natation</option>
        </select>

        <select name="participation_percentage" className="bg-white/10 text-white px-3 py-2 rounded-lg border border-white/20 
               focus:outline-none focus:ring-2 focus:ring-white/30
               md:px-4 md:py-2 md:text-base">
          <option value="50" className="bg-[#8d6bf2] text-[#f3f0ff]">50%</option>
          <option value="100" className="bg-[#8d6bf2] text-[#f3f0ff]">100%</option>
        </select>

          <input
          type="text"
          name="kilometers"
          placeholder="kilometers"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="out_of_pool_usdc"
          placeholder="out_of_pool_usdc"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="weth_liquidity"
          placeholder="weth_liquidity"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="usdc_liquidity"
          placeholder="usdc_liquidity"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="usdc_fees"
          placeholder="usdc_fees"
          required
          className="px-3 py-2 rounded text-black"
        />

        <button
          type="submit"
          className="bg-white text-[#5f3dc4] font-semibold py-2 rounded hover:bg-gray-200"
        >
          Envoyer
        </button>
      </form>
    </main>
  );
}

