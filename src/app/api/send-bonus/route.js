export const runtime     = "nodejs";
export const maxDuration = 30;

import sql from '@/lib/db';
import { ethers } from 'ethers';

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
const RPC_URLS = [
  'https://base.drpc.org',
  'https://base-rpc.publicnode.com',
  'https://mainnet.base.org',
  'https://base.gateway.tenderly.co',
  'https://1rpc.io/base',
];

async function pickRpc() {
  return Promise.any(
    RPC_URLS.map(url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] }),
        signal: AbortSignal.timeout(4000),
      })
        .then(r => r.json())
        .then(json => { if (!json.result) throw new Error('no result'); return url; })
    )
  ).catch(() => { throw new Error('Aucun RPC disponible'); });
}

async function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout ${label}`)), ms)),
  ]);
}

async function sendUsdc(usdc, toAddress, amountUsdc, nonce, feeData) {
  if (!toAddress || amountUsdc <= 0) return null;
  const tx = await withTimeout(
    usdc.transfer(toAddress, BigInt(Math.round(amountUsdc * 1e6)), {
      nonce,
      maxFeePerGas:         feeData.maxFeePerGas         * 2n,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2n,
    }),
    15000,
    `transfer vers ${toAddress}`
  );
  return tx.hash;
}

export async function POST() {
  try {
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) return Response.json({ error: 'WALLET_PRIVATE_KEY manquant' }, { status: 500 });

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

    const rpcUrl  = await pickRpc();
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer   = new ethers.Wallet(privateKey, provider);
    const usdc     = new ethers.Contract(
      USDC_ADDRESS,
      ['function transfer(address to, uint256 amount) returns (bool)'],
      signer
    );

    const [feeData, startNonce] = await Promise.all([
      withTimeout(provider.getFeeData(), 8000, 'getFeeData'),
      withTimeout(provider.getTransactionCount(signer.address, 'pending'), 8000, 'getNonce'),
    ]);

    const results = [];
    let nonce = startNonce;

    for (const row of pending) {
      const tx_bonus2 = await sendUsdc(usdc, user1Wallet, Number(row.bonus2), nonce++, feeData).catch(() => null);
      const tx_bonus3 = await sendUsdc(usdc, user1Wallet, Number(row.bonus3), nonce++, feeData).catch(() => null);
      await sql`
        UPDATE user_activities
        SET tx_bonus2 = COALESCE(${tx_bonus2}, tx_bonus2),
            tx_bonus3 = COALESCE(${tx_bonus3}, tx_bonus3)
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
