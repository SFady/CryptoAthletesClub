import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALG     = "aes-256-gcm";
const KEY     = Buffer.from(process.env.APP_SECRET_KEY, "hex");

export function encrypt(text) {
  const iv     = randomBytes(12);
  const cipher = createCipheriv(ALG, KEY, iv);
  const enc    = Buffer.concat([cipher.update(String(text), "utf8"), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decrypt(token) {
  try {
    const buf     = Buffer.from(token, "base64url");
    const iv      = buf.subarray(0, 12);
    const tag     = buf.subarray(12, 28);
    const enc     = buf.subarray(28);
    const decipher = createDecipheriv(ALG, KEY, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}
