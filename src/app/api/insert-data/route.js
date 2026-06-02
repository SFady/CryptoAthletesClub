import sql from '@/lib/db';
import { sqrtPercent } from '@/lib/percent';

export async function POST(req) {
  try {

    const formData = await req.formData();

    const user_id = formData.get("user_id");
    const rawDate = formData.get("date_claimed"); // "2025-12-25"
    const rawTime = formData.get("time_claimed") ?? "00:00";
    const date_claimed = `${rawDate}T${rawTime}:00`;
    const defit_amount = Number(formData.get("defit_amount"));
    const activity_type = formData.get("activity_type");
    const participation_percentage = formData.get("participation_percentage");
    const kilometers = formData.get("kilometers");
    let current_liquidity = Number(formData.get("current_liquidity"));
    const duration = (Number(formData.get("duration_h") || 0) * 3600)
      + (Number(formData.get("duration_m") || 0) * 60)
      + (Number(formData.get("duration_s") || 0));


    // Valeur du pool CLM + USDC wallet (en parallèle)

    const origin = new URL(req.url).origin;
    const [clmRes, walletRes, walletPoolRes] = await Promise.all([
      fetch(`${origin}/api/clm`),
      fetch(`${origin}/api/wallet`),
      fetch(`${origin}/api/wallet-pool`),
    ]);
    const clmData = await clmRes.json();
    const walletData = await walletRes.json();
    const walletPoolData = await walletPoolRes.json();
    const walletPool = Number(clmData.totalPoolUSD ?? 0) + Number(walletPoolData.usdc ?? 0) + Number(walletPoolData.wethUSD ?? 0);
    const walletUSDC = Number(walletData.usdc ?? 0);


    // Initial liquidity

    const [row0] = await sql`
      SELECT starting_offered_liquidity
      FROM users
      WHERE id=${user_id}
      LIMIT 1;
    `;
    const starting_offered_liquidity = Number(row0?.starting_offered_liquidity ?? 0);

    const [row3] = await sql`
      SELECT COALESCE(SUM(i.price), 0) AS initial_liquidity
      FROM user_items ui
      JOIN items i ON ui.item = i.id
      WHERE ui.user = ${user_id}
    `;
    const initial_user_liquidity = Number(row3?.initial_liquidity ?? 0);

    const allUsersInvest = await sql`
      SELECT u.id, COALESCE(SUM(i.price), 0) AS initial_liquidity
      FROM users u
      LEFT JOIN user_items ui ON ui.user = u.id
      LEFT JOIN items i ON ui.item = i.id
      GROUP BY u.id
    `;
    const allInvestValues = allUsersInvest.map(r => Number(r.initial_liquidity));
    const sum_initials_liquidity = allInvestValues.reduce((a, b) => a + b, 0);

    const percent_global = 1;
    const percent = sqrtPercent(initial_user_liquidity, allInvestValues);


    // Coefficients :
    // Course : 1
    // Natation : 0.85
    // Velo : 0.7
    // Marche : 0.4


    // Distributed

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

    const [row10] = await sql`
      SELECT sum(amount) as bonus
      FROM app_transactions
      WHERE transaction_type=2 and transaction_date2 is null
      LIMIT 1
    `;
    const distributed_bonus_to_credit = Number(row10?.bonus ?? 0);

    const [row11] = await sql`
      SELECT sum(liquidity_repair) as liquidity_repair
      FROM user_activities
      WHERE liquidity_repair_treated IS NULL
      LIMIT 1
    `;
    const liquidity_repair = Number(row11?.boost ?? 0);

    // Available fees

    const [row4] = await sql`
      SELECT max_defits
      FROM users
      WHERE id=${user_id}
      LIMIT 1;
    `;
    const max_defits = Number(row4?.max_defits ?? 0);
    const defit_percentage = defit_amount > max_defits ? 1 : defit_amount / max_defits;

    // let available_fees = walletUSDC;
    // available_fees = available_fees - (distributed_upgrade + distributed_bonus + distributed_boost + distributed_bonus_to_credit + liquidity_repair);
    // available_fees = available_fees * defit_percentage;
    // if (available_fees < 0) available_fees = 0;
    // New
    let available_fees = walletUSDC;
    available_fees = available_fees * defit_percentage;
    if (available_fees < 0) available_fees = 0;


    // Fees spread

    let benef = 0.20 * percent * percent_global * available_fees;
    //let upgrade = 0.10 * percent * percent_global * available_fees;
    let upgrade = 0;
    let bonus = 0.10 * percent * percent_global * available_fees;
    let boost = 0.50 * percent * percent_global * available_fees;
    //let repair = 0.10 * percent * percent_global * available_fees;
    let repair = 0;
    benef = Math.floor(benef * 100) / 100;
    upgrade = Math.floor(upgrade * 100) / 100;
    bonus = Math.floor(bonus * 100) / 100;
    boost = Math.floor(boost * 100) / 100;
    repair = Math.floor(repair * 100) / 100;



    // Defits to add

    const defitsToAdd = defit_amount * Number(participation_percentage) / 100;


    // New liquidity

    // let new_liquidity = initial_user_liquidity * ( weth_value / 2332 );
    // if (new_liquidity > initial_user_liquidity) new_liquidity = initial_user_liquidity;
    //let new_liquidity = (walletPool / (2084.99 + 10 + 50)) * initial_user_liquidity;
    let new_liquidity = (walletPool / (sum_initials_liquidity)) * initial_user_liquidity;
    //let new_liquidity = ((2084.99 + 10 + 50) / (2084.99 + 10 + 50)) * initial_user_liquidity;
    if (new_liquidity > initial_user_liquidity) new_liquidity = initial_user_liquidity;


    // Insert

    const result = await sql`
      INSERT INTO user_activities (user_id, date_claimed, defit_amount, activity_type, participation_percentage, kilometers, current_liquidity, boost, weth_value, benef, upgrade, bonus, liquidity_repair, pool_usdc, pool_weth, rewards_usdc, rewards_weth, duration)
        VALUES ( ${user_id}, ${date_claimed}, ${defit_amount}, ${activity_type}, ${participation_percentage}, ${kilometers}, ${current_liquidity}, ${boost}, ${0}, ${benef}, ${upgrade}, ${bonus}, ${repair}, ${walletUSDC}, ${0}, ${0}, ${0}, ${duration});
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

    return Response.json({ message: '✅ Insert OK', starting_offered_liquidity, initial_user_liquidity, percent_global, percent, defit_percentage, available_fees, benef, upgrade, bonus, fees: boost, new_liquidity, walletUSDC, distributed_bonus_to_credit, walletPool });

  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
