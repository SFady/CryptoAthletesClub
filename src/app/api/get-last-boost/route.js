import sql from "@/lib/db";

export async function GET(req) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return Response.json({ error: "userId requis" }, { status: 400 });

  try {
    const [row] = await sql`
      SELECT id, boost, bonus
      FROM user_activities
      WHERE user_id = ${userId}
      ORDER BY date_claimed DESC, id DESC
      LIMIT 1
    `;
    return Response.json({
      activityId: row?.id ?? null,
      boost:      row ? Number(row.boost) : 0,
      bonus:      row ? Number(row.bonus) : 0,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
