import sql from "@/lib/db";

async function getAccessToken(stored) {
  const clientId     = stored.client_id     ?? process.env.STRAVA_CLIENT_ID;
  const clientSecret = stored.client_secret ?? process.env.STRAVA_CLIENT_SECRET;

  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id:     clientId,
      client_secret: clientSecret,
      refresh_token: stored.refresh_token,
      grant_type:    "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("Impossible de rafraîchir le token");
  return data.access_token;
}

export async function GET(req) {
  const userId = new URL(req.url).searchParams.get("userId");
  if (!userId) return Response.json({ error: "missing userId" }, { status: 400 });

  const [user] = await sql`SELECT token, strava_start_date FROM users WHERE id = ${userId}`;
  if (!user?.token) return Response.json({ error: "Strava non connecté" }, { status: 400 });

  const stored = JSON.parse(user.token);
  if (!stored.refresh_token) return Response.json({ error: "Strava non connecté" }, { status: 400 });

  if (!stored.client_id || !stored.client_secret) {
    const [usoppRow] = await sql`SELECT token FROM users WHERE id = 1`.catch(() => []);
    const usoppToken = usoppRow?.token ? JSON.parse(usoppRow.token) : {};
    stored.client_id     = stored.client_id     ?? usoppToken.client_id;
    stored.client_secret = stored.client_secret ?? usoppToken.client_secret;
  }

  const accessToken = await getAccessToken(stored);

  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  const startDate    = user.strava_start_date ? Math.floor(new Date(user.strava_start_date).getTime() / 1000) : 0;
  const after        = Math.max(sevenDaysAgo, startDate);
  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=50`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  return Response.json(await res.json());
}
