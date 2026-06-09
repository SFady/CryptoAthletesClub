export const runtime     = "nodejs";
export const maxDuration = 15;

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const WALLET       = process.env.WALLET_BONUS;

const RPC_URLS = [
  "https://base.drpc.org",
  "https://base-rpc.publicnode.com",
  "https://mainnet.base.org",
  "https://base.gateway.tenderly.co",
  "https://1rpc.io/base",
];

const CACHE_TTL_MS = 120_000;
if (!global._walletBonusCache) global._walletBonusCache = { data: null, time: 0 };

function hexToBigInt(hex) {
  if (!hex || hex === "0x" || hex === "0x0") return 0n;
  return BigInt(hex);
}

async function getUsdc(rpcUrl) {
  const calldata = "0x70a08231" + WALLET.toLowerCase().replace("0x", "").padStart(64, "0");
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_call", params: [{ to: USDC_ADDRESS, data: calldata }, "latest"], id: 1 }),
    signal: AbortSignal.timeout(5000),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? "RPC error");
  return Number(hexToBigInt(json.result)) / 1e6;
}

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

export async function GET() {
  if (!WALLET) return Response.json({ error: "WALLET_BONUS non configuré" }, { status: 500 });
  const c = global._walletBonusCache;
  if (c.data && Date.now() - c.time < CACHE_TTL_MS) return Response.json(c.data);
  try {
    const rpcUrl = await pickRpc();
    const usdc   = await getUsdc(rpcUrl);
    const payload = { usdc: usdc.toFixed(2) };
    global._walletBonusCache = { data: payload, time: Date.now() };
    return Response.json(payload);
  } catch (err) {
    if (global._walletBonusCache.data) return Response.json(global._walletBonusCache.data);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
