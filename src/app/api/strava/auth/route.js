import { encrypt, decrypt } from "@/lib/crypto";

export async function GET(req) {
  const url    = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const token  = url.searchParams.get("token");

  // Mode génération : retourne le lien sécurisé
  if (userId) {
    const encrypted = encrypt(userId);
    return Response.json({ link: `${url.origin}/api/strava/auth?token=${encrypted}` });
  }

  // Mode OAuth : déchiffre le token et redirige vers Strava
  const id = decrypt(token);
  if (!id) return Response.json({ error: "token invalide" }, { status: 400 });

  const params = new URLSearchParams({
    client_id:       process.env.STRAVA_CLIENT_ID,
    redirect_uri:    process.env.STRAVA_REDIRECT_URI,
    response_type:   "code",
    approval_prompt: "auto",
    scope:           "activity:read_all",
    state:           encrypt(id),
  });

  return Response.redirect(`https://www.strava.com/oauth/authorize?${params}`);
}
