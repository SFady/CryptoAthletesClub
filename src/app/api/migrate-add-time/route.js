import sql from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await sql`
      ALTER TABLE user_activities
      ADD COLUMN IF NOT EXISTS time_claimed TIME;
    `;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
