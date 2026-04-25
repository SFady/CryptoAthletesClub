import sql from "@/lib/db";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });
  const [row] = await sql`SELECT email, token FROM users WHERE id = ${id}`;
  const token = row?.token ? JSON.parse(row.token) : null;
  return Response.json({
    email: row?.email ?? "",
    stravaConnected: !!(token?.refresh_token),
    stravaClientId: token?.client_id ?? "",
  });
}

export async function POST(req) {
  const { id, email, stravaClientId, stravaClientSecret } = await req.json();
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });

  if (stravaClientId && stravaClientSecret) {
    const [row] = await sql`SELECT token FROM users WHERE id = ${id}`;
    const existing = row?.token ? JSON.parse(row.token) : {};
    const updated = { ...existing, client_id: stravaClientId, client_secret: stravaClientSecret };
    await sql`UPDATE users SET token = ${JSON.stringify(updated)} WHERE id = ${id}`;
  }

  if (email !== undefined) {
    await sql`UPDATE users SET email = ${email} WHERE id = ${id}`;
  }

  return Response.json({ ok: true });
}
