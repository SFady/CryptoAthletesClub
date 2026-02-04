import sql from '@/lib/db';

export async function POST(req) {
  try {

    const formData = await req.formData();

    const user_id = formData.get("user_id");

    const rawDate = formData.get("date_claimed"); // "25/12/2025"
    //const [day, month, year] = rawDate.split("/");
    const date_claimed = rawDate

    const defit_amount = Number(formData.get("defit_amount"));
    const activity_type = formData.get("activity_type");
    const participation_percentage = formData.get("participation_percentage");
    const kilometers = formData.get("kilometers");
    const current_liquidity = Number(formData.get("current_liquidity"));
    const out_of_pool_usdc = formData.get("out_of_pool_usdc");
    const pool_usdc = formData.get("pool_usdc");

    const [row1] = await sql`
      SELECT sum(boost) as boost
      FROM user_activities
      WHERE boost_treated IS NULL
      LIMIT 1;
    `;
    const distributed_fees=Number(row1?.boost ?? 0);
    const available_fees = Number(out_of_pool_usdc) + Number(pool_usdc) - Number(distributed_fees)

    const [row2]  = await sql`
      SELECT initial_liquidity
      FROM liquidity
      LIMIT 1;
    `;
    const initial_liquidity=Number(row2?.initial_liquidity ?? 0);
    
    const [row3]  = await sql`
      SELECT initial_liquidity
      FROM users
      where id=${user_id}
      LIMIT 1;
    `;
    const initial_user_liquidity=Number(row3?.initial_liquidity ?? 0);
    
    const liquidity_percentage=initial_user_liquidity/initial_liquidity;

    const [row4]  = await sql`
      SELECT max_defits
      FROM users
      where id=${user_id}
      LIMIT 1;
    `;
    const max_defits=Number(row4?.max_defits ?? 0);
    const defit_percentage=defit_amount/max_defits;

    const boost=liquidity_percentage*defit_percentage*0.5*available_fees;

    const result = await sql`
      INSERT INTO user_activities (user_id, date_claimed, defit_amount, activity_type, participation_percentage, kilometers, current_liquidity, boost, out_of_pool_usdc, pool_usdc) 
        VALUES ( ${user_id}, ${date_claimed}, ${defit_amount}, ${activity_type}, ${participation_percentage}, ${kilometers}, ${current_liquidity}, ${boost}, ${out_of_pool_usdc}, ${pool_usdc});
    `;

    return Response.json({ message: '✅ Insert OK', result: result[0] });

  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

