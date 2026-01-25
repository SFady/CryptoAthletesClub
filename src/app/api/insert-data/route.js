import sql from '@/lib/db';

export async function POST(req) {
  try {

    const formData = await req.formData();

    const user_id = formData.get("user_id");

    const rawDate = formData.get("date_claimed"); // "25/12/2025"
    //const [day, month, year] = rawDate.split("/");
    const date_claimed = rawDate

    const defit_amount = formData.get("defit_amount");
    const activity_type = formData.get("activity_type");
    const participation_percentage = formData.get("participation_percentage");
    const kilometers = formData.get("kilometers");

//     const activityResult = await sql`
//   SELECT id FROM activity_type WHERE name = ${activityName} LIMIT 1;
// `;

//     const activity_type = activityResult[0]?.id;

    const result = await sql`
      INSERT INTO user_activities (user_id, date_claimed, defit_amount, activity_type, participation_percentage, kilometers) 
        VALUES ( ${user_id}, ${date_claimed}, ${defit_amount}, ${activity_type}, ${participation_percentage}, ${kilometers});
    `;

    return Response.json({ message: '✅ Insert OK', result: result[0] });

    // get fees f
    // Combien il en reste (-distributed)
    // pourcentage liquidité pour joueur : p
    // P2 : pourcentage par rapport au max defit
    // P2 


    // totalFees = formData.get("out_of_pool_usdc") + formData.get("usdc_fees") ;
    // liquidity_start=top 1 liquidity_start from liquidity order by liquidity_start desc
    // globalInitialLiquidity=top 1 initial_liquidity from liquidity order by liquidity_start desc
    // upgradePercentage=top 1 upgradePercentage from liquidity order by liquidity_start desc
    // distributedFees = sum(boost) where date_claimed>=liquidity_start 
    // remainingFees = totalFees - distributedFees
    // liquidityPercentage = users.initial_liquidity/globalInitialLiquidity
    // defitPercentage = formData.get("defit_amount") / users.max_defits
    // upgradeDollars=(liquidityPercentage*defitPercentage*remainingFees)*(upgradePercentage/100)
    // boost=(liquidityPercentage*defitPercentage*remainingFees)-upgradeDollars

    // ajouter boost dans user_activities
    // ajouter aux dollars
    // ajouter à upgradeDollars






  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

