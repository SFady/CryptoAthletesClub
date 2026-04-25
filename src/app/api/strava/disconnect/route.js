import sql from "@/lib/db";

async function getAccessToken(refreshToken) {
  const res = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id:     process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type:    "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error("refresh failed");
  return data.access_token;
}

export async function POST(req) {
  const { userId } = await req.json();
  if (!userId) return Response.json({ error: "missing userId" }, { status: 400 });

  const [user] = await sql`SELECT token FROM users WHERE id = ${userId}`;

  await sql`UPDATE users SET token = NULL WHERE id = ${userId}`;

  if (user?.token) {
    try {
      const { access_token, refresh_token } = JSON.parse(user.token);
      const token = access_token ?? await getAccessToken(refresh_token);
      await fetch("https://www.strava.com/oauth/deauthorize", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  }

  return Response.json({ ok: true });
}
