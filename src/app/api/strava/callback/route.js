import sql from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export async function GET(req) {
  const url    = new URL(req.url);
  const code   = url.searchParams.get("code");
  const userId = decrypt(url.searchParams.get("state"));
  const error  = url.searchParams.get("error");

  if (error || !code || !userId) {
    return Response.redirect(new URL("/profil?strava=error", url.origin));
  }

  try {
    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id:     process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
      }),
    });

    const data = await res.json();
    if (!data.refresh_token) throw new Error("No refresh_token in response");

    const token = JSON.stringify({
      refresh_token: data.refresh_token,
      access_token:  data.access_token,
      expires_at:    data.expires_at,
      athlete_id:    data.athlete?.id,
    });

    await sql`UPDATE users SET token = ${token} WHERE id = ${userId}`;

    return Response.redirect(new URL("/profil?strava=ok", url.origin));
  } catch (err) {
    console.error("Strava callback error:", err.message);
    return Response.redirect(new URL("/profil?strava=error", url.origin));
  }
}
