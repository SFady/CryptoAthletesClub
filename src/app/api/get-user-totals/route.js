import sql from '@/lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id')) || 0;
    const activity = Number(url.searchParams.get('activity')) || 0;

    // (activity = 0 OR activity_type = activity) → 0 = pas de filtre
    let result;

    if (id === 1) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)                                      AS kilometers,
            COALESCE(SUM(uas.defit_amount*uas.participation_percentage/100), 0)   AS defit_amount,
            COALESCE(SUM(uas.boost), 0)                                           AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
          AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
          AND (${activity} = 0 OR uas.activity_type = ${activity})
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
    } else if (id === 2) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)                                      AS kilometers,
            COALESCE(SUM(uas.defit_amount*uas.participation_percentage/100), 0)   AS defit_amount,
            COALESCE(SUM(uas.boost), 0)                                           AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
          AND EXTRACT(MONTH FROM uas.date_claimed) = EXTRACT(MONTH FROM CURRENT_DATE)
          AND EXTRACT(YEAR FROM uas.date_claimed)  = EXTRACT(YEAR FROM CURRENT_DATE)
          AND (${activity} = 0 OR uas.activity_type = ${activity})
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
    } else if (id === 3) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)                                      AS kilometers,
            COALESCE(SUM(uas.defit_amount*uas.participation_percentage/100), 0)   AS defit_amount,
            COALESCE(SUM(uas.boost), 0)                                           AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
          AND uas.date_claimed >= DATE_TRUNC('week', CURRENT_DATE)
          AND uas.date_claimed <  DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'
          AND (${activity} = 0 OR uas.activity_type = ${activity})
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
    } else {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)                                      AS kilometers,
            COALESCE(SUM(uas.defit_amount*uas.participation_percentage/100), 0)   AS defit_amount,
            COALESCE(SUM(uas.boost), 0)                                           AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
          AND (${activity} = 0 OR uas.activity_type = ${activity})
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
    }

    const response = result.map(row => ({
      name: row.name,
      kilometers: Number(row.kilometers ?? 0),
      defit_amount: Number(row.defit_amount ?? 0),
      boost: Number(row.boost ?? 0),
    }));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
