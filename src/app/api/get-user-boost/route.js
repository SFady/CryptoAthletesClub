import sql from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get('userId')) || 1;

    const [row] = await sql`
      SELECT COALESCE(SUM(boost), 0) AS boost_pending
      FROM user_activities
      WHERE user_id = ${userId}
        AND boost_treated IS NULL
    `;

    return Response.json({ boost_pending: Number(row.boost_pending ?? 0) });
  } catch (err) {
    console.error('❌ DB error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
