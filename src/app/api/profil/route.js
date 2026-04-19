import sql from "@/lib/db";

export async function GET(req) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });
  const [row] = await sql`SELECT email FROM users WHERE id = ${id}`;
  return Response.json({ email: row?.email ?? "" });
}

export async function POST(req) {
  const { id, email } = await req.json();
  if (!id) return Response.json({ error: "missing id" }, { status: 400 });
  await sql`UPDATE users SET email = ${email} WHERE id = ${id}`;
  return Response.json({ ok: true });
}
