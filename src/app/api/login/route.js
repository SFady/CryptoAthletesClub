const USERS = {
  usopp:    process.env.PASSWORD_USOPP     ?? "usopp2024",
  nicor:    process.env.PASSWORD_NICOR     ?? "nicor2024",
  dteach:   process.env.PASSWORD_DTEACH    ?? "dteach2024",
  jinbe:    process.env.PASSWORD_JINBE     ?? "jinbe2024",
};

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(req) {
  try {
    const { user, password } = await req.json();
    const expected = USERS[user];
    if (!expected) return Response.json({ ok: false }, { status: 401 });

    const [h1, h2] = await Promise.all([sha256(password), sha256(expected)]);
    if (h1 !== h2) return Response.json({ ok: false }, { status: 401 });

    const token = await sha256(expected + Date.now());
    return Response.json({ ok: true, token, user });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
