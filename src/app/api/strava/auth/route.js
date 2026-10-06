import { encrypt, decrypt } from "@/lib/crypto";
import sql from "@/lib/db";
import { requireAuth } from "@/lib/auth";

const USER_ID_MAP = { usopp: "1", dteach: "2", nicor: "3", jinbe: "4" };

export async function GET(req) {
  const url    = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const token  = url.searchParams.get("token");

  if (userId) {
    // Generating a link is the sensitive step: it must only be handed out to
    // Usopp (who manages everyone's Strava link) or to the athlete themselves.
    const username = await requireAuth(req);
    if (!username) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (username !== "usopp" && USER_ID_MAP[username] !== String(userId)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }

    const encrypted = encrypt(userId);
    return Response.json({ link: `${url.origin}/api/strava/auth?token=${encrypted}` });
  }

  const id = decrypt(token);
  if (!id) return Response.json({ error: "invalid token" }, { status: 400 });

  const [row] = await sql`SELECT token FROM users WHERE id = ${id}`;
  const stored = row?.token ? JSON.parse(row.token) : {};
  let clientId = stored.client_id ?? process.env.STRAVA_CLIENT_ID;
  if (!clientId) {
    const [usoppRow] = await sql`SELECT token FROM users WHERE id = 1`.catch(() => []);
    const usoppToken = usoppRow?.token ? JSON.parse(usoppRow.token) : {};
    clientId = usoppToken.client_id;
  }

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
