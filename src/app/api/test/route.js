import sql from '@/lib/db';

export async function GET() {
  try {
    const result = await sql`SELECT sum(defit_amount*participation_percentage/100) from user_activities where user_id=2;`;
    return Response.json({ message: '✅ Connected to Neon', result: result[0] });
  } catch (err) {
    console.error('❌ DB connection error:', err);
    return Response.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
