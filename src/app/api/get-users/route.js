import sql from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const users = await sql`SELECT id, name, wallet_address FROM users ORDER BY id`;
    return Response.json(users);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
