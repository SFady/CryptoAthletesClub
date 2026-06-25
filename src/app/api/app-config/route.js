import sql from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });

  const key = new URL(req.url).searchParams.get('key');
  if (!key) return Response.json({ error: 'key requis' }, { status: 400 });
  try {
    const [row] = await sql`SELECT value FROM app_config WHERE key = ${key} LIMIT 1`;
    return Response.json({ key, value: row?.value ?? null });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const { key, value } = await req.json();
    if (!key) return Response.json({ error: 'key requis' }, { status: 400 });
    await sql`
      INSERT INTO app_config (key, value) VALUES (${key}, ${String(value)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
