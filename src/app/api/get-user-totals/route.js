import sql from '@/lib/db';

export async function GET(req) {
  try {

    const url = new URL(req.url);
    const id = Number(url.searchParams.get('id')) || 0;

    let result;

    if (id === 1) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount*uas.participation_percentage/100), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;
      `;
    } else if (id === 2) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(MONTH FROM uas.date_claimed) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;  
      `;
    } else if (id === 3) {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
        AND EXTRACT(WEEK FROM uas.date_claimed) = EXTRACT(WEEK FROM CURRENT_DATE) AND EXTRACT(MONTH FROM uas.date_claimed) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM uas.date_claimed) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY uss.id, uss.name
        ORDER BY uss.id;    
      `;
    }
    else {
      result = await sql`
        SELECT
            uss.name AS name,
            COALESCE(SUM(uas.kilometers), 0)    AS kilometers,
            COALESCE(SUM(uas.defit_amount), 0)  AS defit_amount,
            COALESCE(SUM(uas.boost), 0)         AS boost
        FROM users uss
        LEFT JOIN user_activities uas
          ON uas.user_id = uss.id
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
      JSON.stringify({ euros: 0, defits: 0, error: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// SELECT 
//     COALESCE(t.value1, 0) AS value1,
//     uas.*
// FROM user_activities uas
// LEFT JOIN LATERAL (
//     SELECT uts.value1
//     FROM user_transactions uts
//     WHERE uts.user_id = uas.user_id
//       AND uts.transaction_date > uas.date_claimed  -- prochaine transaction
//     ORDER BY uts.transaction_date ASC             -- la plus proche après
//     LIMIT 1
// ) t ON TRUE
// WHERE uas.user_id = 1
// ORDER BY uas.date_claimed ASC;

// SELECT 
//     COALESCE(t.value1, -1) AS value1,
//     COALESCE(t.value2, -1) AS value2,
//     CASE 
//         WHEN t.value1 IS NULL OR t.value1 = 0 THEN -1
//         ELSE t.value2 / t.value1
//     END AS ratio,
//     uas.*
// FROM user_activities uas
// LEFT JOIN LATERAL (
//     SELECT 
//         uts.value1,
//         uts.value2
//     FROM user_transactions uts
//     WHERE uts.user_id = uas.user_id
//       AND uts.transaction_date > uas.date_claimed
//     ORDER BY uts.transaction_date ASC
//     LIMIT 1
// ) t ON TRUE
// WHERE uas.user_id = 1
// ORDER BY uas.date_claimed ASC;

