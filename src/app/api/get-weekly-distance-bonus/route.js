import sql from '@/lib/db';

export async function GET() {
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


