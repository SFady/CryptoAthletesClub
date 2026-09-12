import { requireAuth } from '@/lib/auth';

export async function GET(req) {
  const username = await requireAuth(req);
  if (!username) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, user: username });
}
