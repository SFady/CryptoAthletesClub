import { ethers } from "ethers";
import sql from "@/lib/db";

export const runtime     = "nodejs";
export const maxDuration = 30;

const USDC_ADDRESS  = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const USDC_DECIMALS = 6;

const RPC_URLS = [
  "https://base.drpc.org",
  "https://base-rpc.publicnode.com",
  "https://mainnet.base.org",
  "https://base.gateway.tenderly.co",
  "https://1rpc.io/base",
];

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
];

async function pickRpc() {
  return Promise.any(
    RPC_URLS.map(url =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
        signal: AbortSignal.timeout(4000),
      })
        .then(r => r.json())
        .then(json => { if (!json.result) throw new Error("no result"); return url; })
    )
  ).catch(() => { throw new Error("Aucun RPC disponible"); });
}

async function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout ${label}`)), ms)),
  ]);
}

const USDC_ABI = ["function transfer(address to, uint256 amount) returns (bool)"];

async function sendUsdc(privateKey, to, amount, nonce, feeData) {
  const raw = ethers.parseUnits(Number(amount).toFixed(USDC_DECIMALS), USDC_DECIMALS);
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
        usdc.transfer(to, raw, overrides).then(tx => tx.hash),
        12000,
        `transfer ${url}`
      );
    })
  ).catch(err => { throw new Error(`Tous les RPCs ont échoué : ${err.errors?.[0]?.message ?? err.message}`); });
}

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: "Body JSON invalide" }, { status: 400 });
    }

    const { userId, activityId, boostAmount, bonusAmount, benefAmount } = body ?? {};

    if (!userId)     return Response.json({ error: "userId requis" },     { status: 400 });
    if (!activityId) return Response.json({ error: "activityId requis" }, { status: 400 });

    const boost = Number(boostAmount);
    const bonus = Number(bonusAmount);
    const benef = Number(benefAmount);
    if (boost <= 0 && bonus <= 0 && benef <= 0) {
      return Response.json({ error: "Montants invalides" }, { status: 400 });
    }

    const [user]  = await sql`SELECT wallet_address, name FROM users WHERE id = ${userId}`;
    const [user1] = await sql`SELECT wallet_address FROM users WHERE id = 1`;

    if (boost > 0 && !user?.wallet_address) {
      return Response.json({ error: "Wallet non configuré pour cet utilisateur" }, { status: 400 });
    }
    if (benef > 0 && !user1?.wallet_address) {
      return Response.json({ error: "Wallet non configuré pour l'utilisateur 1" }, { status: 400 });
    }

    const bonusWallet = process.env.WALLET_BONUS;
    if (bonus > 0 && !bonusWallet) {
      return Response.json({ error: "Clé WALLET_BONUS non configurée" }, { status: 400 });
    }

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
      return Response.json({ error: "Clé privée non configurée (WALLET_PRIVATE_KEY)" }, { status: 500 });
    }

    const rpcUrl   = await pickRpc();
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet   = new ethers.Wallet(privateKey, provider);
    const usdcRead = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

    const totalRaw = ethers.parseUnits((boost + bonus + benef).toFixed(USDC_DECIMALS), USDC_DECIMALS);
    const [balance, feeData, startNonce] = await Promise.all([
      withTimeout(usdcRead.balanceOf(wallet.address), 8000, "balanceOf"),
      withTimeout(provider.getFeeData(), 8000, "getFeeData"),
      withTimeout(provider.getTransactionCount(wallet.address, "pending"), 8000, "getNonce"),
    ]);
    if (balance < totalRaw) {
      return Response.json({
        error:     "Solde USDC insuffisant",
        balance:   ethers.formatUnits(balance, USDC_DECIMALS),
        requested: boost + bonus + benef,
      }, { status: 400 });
    }

    let txBoost = null;
    let txBonus = null;
    let txBenef = null;
    let nonce = startNonce;

    if (boost > 0) {
      txBoost = await sendUsdc(privateKey, user.wallet_address, boost, nonce++, feeData);
      await sql`UPDATE user_activities SET tx_boost = ${txBoost} WHERE id = ${activityId}`;
    }
    if (bonus > 0 && bonusWallet) {
      txBonus = await sendUsdc(privateKey, bonusWallet, bonus, nonce++, feeData);
      await sql`UPDATE user_activities SET tx_bonus = ${txBonus} WHERE id = ${activityId}`;
    }
    if (benef > 0 && user1?.wallet_address) {
      txBenef = await sendUsdc(privateKey, user1.wallet_address, benef, nonce++, feeData);
      await sql`UPDATE user_activities SET tx_benef = ${txBenef} WHERE id = ${activityId}`;
    }

    return Response.json({ success: true, user: user.name, txBoost, txBonus, txBenef, nextNonce: nonce });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
