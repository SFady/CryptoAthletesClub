import sql from "@/lib/db";

export async function GET() {
  const [row] = await sql`SELECT value FROM app_config WHERE key = 'last_notification' LIMIT 1`.catch(() => []);
  if (!row?.value) return Response.json([]);

  const notif = JSON.parse(row.value);
  if (new Date() > new Date(notif.expiresAt)) return Response.json([]);

  return Response.json([notif]);
}
