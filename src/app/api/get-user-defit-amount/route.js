import sql from '@/lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({ euros: 0, defits: 0 }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await sql`
      SELECT 
        COALESCE(dollars, 0) AS dollars,
        COALESCE(defits, 0) AS defits,
        COALESCE(liquidity, 0) AS user_liquidity
      FROM users
      WHERE id = ${id};
    `;

    return new Response(
      JSON.stringify({
        dollars: result[0]?.dollars ?? 0,
        defits: result[0]?.defits ?? 0,
        user_liquidity: result[0]?.user_liquidity ?? 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(
      JSON.stringify({ euros: 0, defits: 0, error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
