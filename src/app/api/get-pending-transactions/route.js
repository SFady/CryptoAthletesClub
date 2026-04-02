import sql from '@/lib/db';

export async function GET() {
  try {
    const [row] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM app_transactions
      WHERE transaction_date2 IS NULL
    `;
    return Response.json({ total: Number(row.total) });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
