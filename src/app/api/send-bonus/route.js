export const runtime     = "nodejs";
export const maxDuration = 30;

import sql from '@/lib/db';
import { ethers } from 'ethers';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const RPC_URLS = [
  'https://base.drpc.org',
  'https://base-rpc.publicnode.com',
  'https://mainnet.base.org',
];

async function sendUsdc(toAddress, amountUsdc) {
  if (!process.env.PRIVATE_KEY || !toAddress || amountUsdc <= 0) return null;
  for (const rpc of RPC_URLS) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const usdc = new ethers.Contract(
        USDC_ADDRESS,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        signer
      );
      const tx = await usdc.transfer(toAddress, BigInt(Math.round(amountUsdc * 1e6)));
      return tx.hash;
    } catch { /* essayer le suivant */ }
  }
  return null;
}

export async function POST() {
  try {
    const [user1Row] = await sql`SELECT wallet_address FROM users WHERE id = 1 LIMIT 1`;
    const user1Wallet = user1Row?.wallet_address ?? null;
    if (!user1Wallet) return Response.json({ error: 'Wallet user 1 introuvable' }, { status: 400 });

    const pending = await sql`
      SELECT id, bonus2, bonus3
      FROM user_activities
      WHERE (bonus2 > 0 OR bonus3 > 0)
        AND tx_bonus2 IS NULL
        AND tx_bonus3 IS NULL
      ORDER BY id
    `;

    if (pending.length === 0) return Response.json({ message: 'Rien à envoyer' });

    const results = [];
    for (const row of pending) {
      const [tx_bonus2, tx_bonus3] = await Promise.all([
        sendUsdc(user1Wallet, Number(row.bonus2)),
        sendUsdc(user1Wallet, Number(row.bonus3)),
      ]);
      await sql`
        UPDATE user_activities
        SET tx_bonus2 = ${tx_bonus2}, tx_bonus3 = ${tx_bonus3}
        WHERE id = ${row.id}
      `;
      results.push({ id: row.id, tx_bonus2, tx_bonus3 });
    }

    return Response.json({ ok: true, results });
  } catch (err) {
    console.error('send-bonus error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
