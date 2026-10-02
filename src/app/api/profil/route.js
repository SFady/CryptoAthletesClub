import sql from "@/lib/db";
import { requireAuth, isReadOnly } from "@/lib/auth";

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });
  const [row] = await sql`SELECT email, token, wallet_address, strava_start_date FROM users WHERE id = ${id}`;
  const token = row?.token ? JSON.parse(row.token) : null;
  return Response.json({
    email:           row?.email ?? "",
    walletAddress:   row?.wallet_address ?? "",
    stravaConnected: !!(token?.refresh_token),
    stravaClientId:  token?.client_id ?? "",
    stravaStartDate: row?.strava_start_date ? row.strava_start_date.toISOString().slice(0, 10) : "",
  });
}

export async function POST(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });
  if (isReadOnly(username)) return Response.json({ error: 'Accès en lecture seule' }, { status: 403 });

  const { id, email, walletAddress, stravaClientId, stravaClientSecret, stravaStartDate } = await req.json();
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });

  if (stravaClientId) {
    const [row] = await sql`SELECT token FROM users WHERE id = ${id}`;
    const existing = row?.token ? JSON.parse(row.token) : {};
    const updated = { ...existing, client_id: stravaClientId };
    if (stravaClientSecret) updated.client_secret = stravaClientSecret;
    await sql`UPDATE users SET token = ${JSON.stringify(updated)} WHERE id = ${id}`;
  }

  if (email !== undefined) {
    if (username !== 'usopp') return Response.json({ error: 'Non autorisé' }, { status: 403 });
    await sql`UPDATE users SET email = ${email} WHERE id = ${id}`;
  }

  if (walletAddress !== undefined) {
    await sql`UPDATE users SET wallet_address = ${walletAddress} WHERE id = ${id}`;
  }

  if (stravaStartDate !== undefined) {
    const val = stravaStartDate === "" ? null : stravaStartDate;
    await sql`UPDATE users SET strava_start_date = ${val} WHERE id = ${id}`;
  }

  return Response.json({ ok: true });
}
