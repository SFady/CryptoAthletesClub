import { encrypt, decrypt } from "@/lib/crypto";
import sql from "@/lib/db";

export async function GET(req) {
  const url    = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const token  = url.searchParams.get("token");

  if (userId) {
    const encrypted = encrypt(userId);
    return Response.json({ link: `${url.origin}/api/strava/auth?token=${encrypted}` });
  }

  const id = decrypt(token);
  if (!id) return Response.json({ error: "token invalide" }, { status: 400 });

  const [row] = await sql`SELECT token FROM users WHERE id = ${id}`;
  const stored = row?.token ? JSON.parse(row.token) : {};
  const clientId = stored.client_id ?? process.env.STRAVA_CLIENT_ID;

  const params = new URLSearchParams({
    client_id:       clientId,
    redirect_uri:    process.env.STRAVA_REDIRECT_URI,
    response_type:   "code",
    approval_prompt: "force",
    scope:           "activity:read_all",
    state:           encrypt(id),
  });

  return Response.redirect(`https://www.strava.com/oauth/authorize?${params}`);
}
