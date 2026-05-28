import sql from "@/lib/db";

export async function GET() {
  try {
    const users = await sql`
      SELECT id, name, wallet_address
      FROM users
      ORDER BY id
    `;
    return Response.json(users);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
