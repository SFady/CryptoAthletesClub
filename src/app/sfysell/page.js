export default function Sfy1024() {
  return (
    <main className="flex flex-col items-start min-h-screen text-white bg-[#5f3dc4] px-6 py-6">
      <h1 className="text-2xl mb-4">Ajouter une donnée</h1>

      <form
        action="/api/insert-sell"
        method="POST"
        className="flex flex-col gap-4 w-full max-w-sm"
      >

        <input
          type="text"
          name="date_sell"
          placeholder="date_sell"
          required
          className="px-3 py-2 rounded text-black"
        />

        <input
          type="text"
          name="defit_amount"
          placeholder="defit_amount"
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

