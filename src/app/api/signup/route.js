import sql from "@/lib/db";
import { randomBytes } from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "Crypto Athletes Club <onboarding@resend.dev>";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function POST(req) {
  const { username, email } = await req.json();

  if (!username?.trim() || !email?.trim()) {
    return Response.json({ error: "Username and email are required" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return Response.json({ error: "This email is already registered" }, { status: 409 });
    }

    const token = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + TOKEN_TTL_MS);

    await sql`
      INSERT INTO users (name, email, email_verified, verification_token, verification_token_expiry)
      VALUES (${username.trim()}, ${email.trim()}, false, ${token}, ${expiry})
    `;

    const origin = new URL(req.url).origin;
    const verifyUrl = `${origin}/api/verify-email?token=${token}`;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email.trim(),
      subject: "Verify your email — Crypto Athletes Club",
      html: `<p>Welcome to the Crypto Athletes Club!</p><p>Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 24 hours.</p>`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
