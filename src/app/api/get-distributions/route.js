import sql from '@/lib/db';

export async function GET() {
  try {
    const [global] = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN benef_treated IS NULL THEN benef ELSE 0 END), 0) AS benef,
        COALESCE(SUM(CASE WHEN boost_treated IS NULL THEN boost ELSE 0 END), 0) AS boost,
        COALESCE(SUM(CASE WHEN bonus_treated IS NULL THEN bonus ELSE 0 END), 0) AS bonus
      FROM user_activities
    `;

    const byUser = await sql`
      SELECT
        u.id,
        u.name,
        COALESCE(SUM(CASE WHEN ua.benef_treated IS NULL THEN ua.benef ELSE 0 END), 0) AS benef,
        COALESCE(SUM(CASE WHEN ua.boost_treated IS NULL THEN ua.boost ELSE 0 END), 0) AS boost,
        COALESCE(SUM(CASE WHEN ua.bonus_treated IS NULL THEN ua.bonus ELSE 0 END), 0) AS bonus
      FROM users u
      LEFT JOIN user_activities ua ON ua.user_id = u.id
      GROUP BY u.id, u.name
      ORDER BY u.id
    `;

    const liquidity = await sql`
      SELECT id, starting_offered_liquidity, initial_liquidity
      FROM users
      ORDER BY id
    `;

    const benef = Number(global.benef);
    const boost = Number(global.boost);
    const bonus = Number(global.bonus);

    return Response.json({
      benef, boost, bonus,
      total: benef + boost + bonus,
      byUser: byUser.map(r => {
        const liq = liquidity.find(l => l.id === r.id);
        return {
          name: r.name,
          starting_offered_liquidity: Number(liq?.starting_offered_liquidity ?? 0),
          initial_liquidity: Number(liq?.initial_liquidity ?? 0),
          total: Number(r.benef) + Number(r.boost) + Number(r.bonus),
        };
      }),
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
