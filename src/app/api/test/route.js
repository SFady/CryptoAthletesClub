import sql from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const result = await sql`SELECT sum(defit_amount*participation_percentage/100) from user_activities where user_id=2;`;
    return Response.json({ message: '✅ Connected to Neon', result: result[0] });
  } catch (err) {
    console.error('❌ DB connection error:', err);
    return Response.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
