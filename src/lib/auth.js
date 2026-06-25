import sql from './db';

export async function requireAuth(req) {
  const header = req.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  if (!token) return null;
  try {
    const [row] = await sql`SELECT username FROM auth_sessions WHERE token = ${token} LIMIT 1`;
    return row?.username ?? null;
  } catch {
    return null;
  }
}
