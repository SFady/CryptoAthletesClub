import sql from '@/lib/db';

export async function GET(req) {
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
