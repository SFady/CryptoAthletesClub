import sql from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });

  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return Response.json({ error: "userId requis" }, { status: 400 });

  try {
    const [row] = await sql`
      SELECT id, boost, bonus, benef, bonus2, bonus3
      FROM user_activities
      WHERE user_id = ${userId}
      ORDER BY date_claimed DESC, id DESC
      LIMIT 1
    `;
    return Response.json({
      activityId: row?.id ?? null,
      boost:      row ? Number(row.boost)  : 0,
      bonus:      row ? Number(row.bonus)  : 0,
      benef:      row ? Number(row.benef)  : 0,
      bonus2:     row ? Number(row.bonus2) : 0,
      bonus3:     row ? Number(row.bonus3) : 0,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
