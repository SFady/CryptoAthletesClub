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

const USDC_ABI = ['function transfer(address to, uint256 amount) returns (bool)'];

async function sendUsdc(privateKey, toAddress, amountUsdc, nonce, feeData) {
  if (!toAddress || amountUsdc <= 0) return null;
  const raw = BigInt(Math.round(amountUsdc * 1e6));
  const overrides = {
    nonce,
    gasLimit:             100_000n,
    maxFeePerGas:         feeData.maxFeePerGas         * 2n,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2n,
  };
  return Promise.any(
    RPC_URLS.map(async url => {
      const provider = new ethers.JsonRpcProvider(url);
      const signer   = new ethers.Wallet(privateKey, provider);
      const usdc     = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);
      return withTimeout(
        usdc.transfer(toAddress, raw, overrides).then(tx => tx.hash),
        12000,
        `transfer ${url}`
      );
    })
  ).catch(() => null);
}

export async function POST(req) {
  try {
    const { activityId, minNonce } = await req.json().catch(() => ({}));
    if (!activityId) return Response.json({ error: 'activityId requis' }, { status: 400 });

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) return Response.json({ error: 'WALLET_PRIVATE_KEY manquant' }, { status: 500 });

    const [user1Row] = await sql`SELECT wallet_address FROM users WHERE id = 1 LIMIT 1`;
    const user1Wallet = user1Row?.wallet_address ?? null;
    if (!user1Wallet) return Response.json({ error: 'Wallet user 1 introuvable' }, { status: 400 });

    const pending = await sql`
      SELECT id, bonus2, bonus3
      FROM user_activities
      WHERE id = ${activityId}
        AND (bonus2 > 0 OR bonus3 > 0)
        AND tx_bonus2 IS NULL
        AND tx_bonus3 IS NULL
    `;

    if (pending.length === 0) {
      const [row] = await sql`SELECT id, bonus2, bonus3, tx_bonus2, tx_bonus3 FROM user_activities WHERE id = ${activityId} LIMIT 1`;
      return Response.json({ message: 'Rien à envoyer', debug: row ?? null });
    }

    const rpcUrl   = await pickRpc();
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signerAddr = new ethers.Wallet(privateKey).address;

    const [feeData, pendingNonce] = await Promise.all([
      withTimeout(provider.getFeeData(), 8000, 'getFeeData'),
      withTimeout(provider.getTransactionCount(signerAddr, 'pending'), 8000, 'getNonce'),
    ]);
    const startNonce = (minNonce != null && minNonce > pendingNonce) ? minNonce : pendingNonce;

    const results = [];
    let nonce = startNonce;

    for (const row of pending) {
      const tx_bonus2 = await sendUsdc(privateKey, user1Wallet, Number(row.bonus2), nonce++, feeData);
      if (tx_bonus2) await sql`UPDATE user_activities SET tx_bonus2 = ${tx_bonus2} WHERE id = ${row.id}`;

      const tx_bonus3 = await sendUsdc(privateKey, user1Wallet, Number(row.bonus3), nonce++, feeData);
      if (tx_bonus3) await sql`UPDATE user_activities SET tx_bonus3 = ${tx_bonus3} WHERE id = ${row.id}`;

      results.push({ id: row.id, tx_bonus2, tx_bonus3 });
    }

    return Response.json({ ok: true, results });
  } catch (err) {
    console.error('send-bonus error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
