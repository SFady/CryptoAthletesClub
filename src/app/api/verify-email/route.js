import sql from "@/lib/db";

export async function GET(req) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.redirect(`${origin}/profil?verify=error`, 302);
  }

  try {
    const rows = await sql`
      SELECT id FROM users
      WHERE verification_token = ${token}
        AND verification_token_expiry > now()
        AND email_verified = false
    `;

    if (rows.length === 0) {
      return Response.redirect(`${origin}/profil?verify=expired`, 302);
    }

    await sql`
      UPDATE users
      SET email_verified = true, verification_token = NULL, verification_token_expiry = NULL
      WHERE id = ${rows[0].id}
    `;

    return Response.redirect(`${origin}/profil?verify=ok`, 302);
  } catch {
    return Response.redirect(`${origin}/profil?verify=error`, 302);
  }
}
