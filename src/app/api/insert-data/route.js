import sql from '@/lib/db';

export async function POST(req) {
  try {

    const formData = await req.formData();

    const user_id = formData.get("user_id");
    const rawDate = formData.get("date_claimed"); // "25/12/2025"
    const date_claimed = rawDate
    const defit_amount = Number(formData.get("defit_amount"));
    const activity_type = formData.get("activity_type");
    const participation_percentage = formData.get("participation_percentage");
    const kilometers = formData.get("kilometers");
    let current_liquidity = Number(formData.get("current_liquidity"));
    const weth_value = Number(formData.get("weth_value"));
    const pool_usdc = Number(formData.get("pool_usdc"));
    const pool_weth = Number(formData.get("pool_weth"));
    const rewards_usdc = Number(formData.get("rewards_usdc"));
    const rewards_weth = Number(formData.get("rewards_weth"));


    // Initilal liquidity

    const [row0] = await sql`
      SELECT starting_offered_liquidity
      FROM users
      where id=${user_id}
      LIMIT 1;
    `;
    const starting_offered_liquidity = Number(row0?.starting_offered_liquidity ?? 0);

    const [row3] = await sql`
      SELECT initial_liquidity
      FROM users
      where id=${user_id}
      LIMIT 1;
    `;
    const initial_user_liquidity = Number(row3?.initial_liquidity ?? 0);



    // Percentage allocated

    const percent_global = (110 + 135 + 885) / 2180.85;
    const percent = (starting_offered_liquidity + initial_user_liquidity) / (110 + 135 + 885);



    // Distributed

    const [row1] = await sql`
      SELECT sum(benef) as benef
      FROM user_activities
      WHERE benef_treated IS NULL
      LIMIT 1
    `;
    const distributed_benef = Number(row1?.benef ?? 0);

    const [row7] = await sql`
      SELECT sum(upgrade) as upgrade
      FROM user_activities
      WHERE upgrade_treated IS NULL
      LIMIT 1
    `;
    const distributed_upgrade = Number(row7?.upgrade ?? 0);

    const [row8] = await sql`
      SELECT sum(bonus) as bonus
      FROM user_activities
      WHERE bonus_treated IS NULL
      LIMIT 1
    `;
    const distributed_bonus = Number(row8?.bonus ?? 0);

    const [row9] = await sql`
      SELECT sum(boost) as boost
      FROM user_activities
      WHERE boost_treated IS NULL
      LIMIT 1
    `;
    const distributed_boost = Number(row9?.boost ?? 0);



    // Available fees

    const [row4] = await sql`
      SELECT max_defits
      FROM users
      where id=${user_id}
      LIMIT 1;
    `;
    const max_defits = Number(row4?.max_defits ?? 0);
    const defit_percentage = defit_amount / max_defits;

    const liquidity_adjusted = (pool_weth * 2332) + (rewards_weth * 2332) + pool_usdc + rewards_usdc;
    let available_fees = liquidity_adjusted - 2180.85;
    available_fees = available_fees - (distributed_benef + distributed_upgrade + distributed_bonus + distributed_boost);
    available_fees = available_fees * defit_percentage;
    if (available_fees < 0) available_fees = 0;


    // Fees spread  

    let benef = 0.20 * percent * percent_global * available_fees;
    let upgrade = 0.10 * percent * percent_global * available_fees;
    let bonus = 0.10 * percent * percent_global * available_fees;
    let boost = 0.50 * percent * percent_global * available_fees;
    let liquidity_repair = 0.10 * percent * percent_global * available_fees;
    benef = Math.floor(benef * 100) / 100;
    upgrade = Math.floor(upgrade * 100) / 100;
    bonus = Math.floor(bonus * 100) / 100;
    boost = Math.floor(boost * 100) / 100;



    // Defits to add

    const defitsToAdd = defit_amount * Number(participation_percentage) / 100;



    // New liquidity

    // let new_liquidity = initial_user_liquidity * ( weth_value / 2332 );
    // if (new_liquidity > initial_user_liquidity) new_liquidity = initial_user_liquidity;
    let new_liquidity = (current_liquidity / 3151) * initial_user_liquidity;
    if (new_liquidity > initial_user_liquidity) new_liquidity = initial_user_liquidity;





    // Insert

    const result = await sql`
      INSERT INTO user_activities (user_id, date_claimed, defit_amount, activity_type, participation_percentage, kilometers, current_liquidity, boost, weth_value, benef, upgrade, bonus, liquidity_repair, pool_usdc, pool_weth, rewards_usdc, rewards_weth) 
        VALUES ( ${user_id}, ${date_claimed}, ${defit_amount}, ${activity_type}, ${participation_percentage}, ${kilometers}, ${current_liquidity}, ${boost}, ${weth_value}, ${benef}, ${upgrade}, ${bonus}, ${liquidity_repair}, ${pool_usdc}, ${pool_weth}, ${rewards_usdc}, ${rewards_weth});
    `;

    const result2 = await sql`
      UPDATE USERS set dollars=dollars+${boost} where id=${user_id} 
    `;

    const result3 = await sql`
      UPDATE USERS set defits=defits+${defitsToAdd} where id=${user_id} 
    `;

    const result4 = await sql`
      UPDATE users
      SET liquidity = ${new_liquidity}
      WHERE id = ${user_id}
    `;

    return Response.json({ message: '✅ Insert OK', starting_offered_liquidity, initial_user_liquidity, percent_global, available_fees, benef, upgrade, bonus, fees: boost });

  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

