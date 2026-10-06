import sql from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  try {

    const result = await sql`
      SELECT sum(bonus)/2 as bonus
      FROM user_activities
      where bonus_treated is null
      LIMIT 1
      `;

    const response = result.map(row => ({
      bonus : row.bonus
    }));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    
    console.error('❌ DB error:', err);
    return new Response(
      JSON.stringify({ dollars : 0, error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  }
}


