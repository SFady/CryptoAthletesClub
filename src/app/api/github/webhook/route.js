import { createHmac, timingSafeEqual } from "crypto";

function verify(secret, body, signature) {
  if (!signature) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(req) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "webhook secret not configured" }, { status: 500 });

  const body = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verify(secret, body, signature)) {
    return Response.json({ error: "signature invalide" }, { status: 401 });
  }

  const event = req.headers.get("x-github-event");
  const payload = JSON.parse(body);

  console.log(`GitHub event: ${event}`, payload?.action ?? "");

  return Response.json({ ok: true });
}
