import sql from '@/lib/db';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = Number(url.searchParams.get("userId")) || 0;

    let result;
    
    if (userId === 0) {
      result = await sql`
        select 
          uac.id, 
          uac.date_claimed, 
          usr.name as user_name, 
          act.name as activity_name, 
          uac.defit_amount, 
          uac.participation_percentage,
          uac.boost
        from user_activities uac
        inner join users usr on uac.user_id = usr.id
        inner join activity_type act on uac.activity_type = act.id
        order by uac.date_claimed desc;
      `;
    } else {
      result = await sql`
        select 
          uac.id, 
          uac.date_claimed, 
          usr.name as user_name, 
          act.name as activity_name, 
          uac.defit_amount, 
          uac.participation_percentage,
          uac.boost
        from user_activities uac
        inner join users usr on uac.user_id = usr.id
        inner join activity_type act on uac.activity_type = act.id
        where uac.user_id = ${userId}
        order by uac.date_claimed desc;
      `;
    }

    return new Response(JSON.stringify({ result: result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
//     uac.id, 
//     uac.date_claimed, 
//     usr.name AS user_name, 
//     act.name AS activity_name, 
//     uac.defit_amount, 
//     uac.participation_percentage,
//     CASE 
//         WHEN t.value1 IS NULL OR t.value1 = 0 THEN -1
//         ELSE t.value2 / t.value1
//     END AS ratio
// FROM user_activities uac
// INNER JOIN users usr 
//     ON uac.user_id = usr.id
// INNER JOIN activity_type act 
//     ON uac.activity_type = act.id
// LEFT JOIN LATERAL (
//     SELECT 
//         uts.value1,
//         uts.value2
//     FROM user_transactions uts
//     WHERE uts.user_id = uac.user_id
//       AND uts.transaction_date > uac.date_claimed
//     ORDER BY uts.transaction_date ASC
//     LIMIT 1
// ) t ON TRUE
// ORDER BY uac.date_claimed DESC;