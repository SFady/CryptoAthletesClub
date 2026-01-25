import sql from '@/lib/db';

export async function POST(req) {
  try {

    const formData = await req.formData();

    const dt = formData.get("date_sell");
    const total_defit_amount = formData.get("defit_amount");

    let result = await sql`SELECT * FROM user_activities where date_claimed<=${dt} and defit_value is null and user_id=1 order by date_claimed`;

    let total=0;
    let id=-1;
    let difference=0;
    for (const row of result) {
      total+=Number(row.defit_amount);
      if (total>Number(total_defit_amount)){
        id=Number(row.id);
        if (total!=Number(total_defit_amount))
        {
          difference=total-Number(total_defit_amount);
        }
        break; 
      }   
    }

    if (id!=-1)
    {
       result = await sql`update user_activities set defit_value=1, defit_difference=0 where date_claimed<=${dt} and defit_value is null and user_id=1 and id<${id}`;  
       if (difference != 0 )
       {
          result = await sql`update user_activities set defit_value=1, defit_difference=${difference} where date_claimed<=${dt} and defit_value is null and user_id=1 and id=${id}`;   
       }
    }
    



    return Response.json({ message: '✅ Calc OK', result: id });
    
  } catch (err) {
    console.error('❌ DB error:', err);
    return new Response(JSON.stringify({ result: 0, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

