import { createHmac, timingSafeEqual } from "crypto";
import sql from "@/lib/db";

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

  if (event === "ping") {
    console.log("Ping reçu depuis GitHub Actions");
  }

  if (event === "workflow_run" && payload.action === "completed" && payload.workflow_run.conclusion === "success") {
    const { workflow_run } = payload;
    const notification = {
      key: `deploy_${workflow_run.id}`,
      title: "Mise à jour disponible",
      message: `Déploiement "${workflow_run.name}" effectué avec succès.`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    };
    await sql`
      INSERT INTO app_config (key, value)
      VALUES ('last_notification', ${JSON.stringify(notification)})
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  return Response.json({ ok: true });
}
