export const runtime     = "nodejs";
export const maxDuration = 30;

const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const WALLET       = "0xaf96ca0b19b3966105bf2f28a05c10d586692499";

const RPC_URLS = [
  "https://base.drpc.org",
  "https://base-rpc.publicnode.com",
  "https://mainnet.base.org",
  "https://base.gateway.tenderly.co",
  "https://1rpc.io/base",
];

const CACHE_TTL_MS = 120_000; // 2 minutes
if (!global._walletCache) global._walletCache = { data: null, time: 0 };

function balanceOfData(wallet) {
  return "0x70a08231" + wallet.toLowerCase().replace("0x", "").padStart(64, "0");
}

async function pickRpc() {
  for (const url of RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_blockNumber", params: [] }),
        signal: AbortSignal.timeout(4000),
      });
      const json = await res.json();
      if (json.result) return url;
    } catch { /* essayer le suivant */ }
  }
  throw new Error("Aucun RPC disponible");
}

async function getBalances(rpcUrl) {
  const calldata = balanceOfData(WALLET);
  const batch = [
    { jsonrpc: "2.0", method: "eth_call", params: [{ to: WETH_ADDRESS, data: calldata }, "latest"], id: 0 },
    { jsonrpc: "2.0", method: "eth_call", params: [{ to: USDC_ADDRESS, data: calldata }, "latest"], id: 1 },
  ];
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(batch),
    signal: AbortSignal.timeout(5000),
  });
  const json = await res.json();
  if (json.error) throw new Error(JSON.stringify(json.error));
  const weth = Number(BigInt(json[0].result)) / 1e18;
  const usdc = Number(BigInt(json[1].result)) / 1e6;
  return { weth, usdc };
}

async function getEthPrice() {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    { headers: { Accept: "application/json" } }
  );
  const json = await res.json();
  return json.ethereum.usd;
}

export async function GET() {
  const c = global._walletCache;
  if (c.data && Date.now() - c.time < CACHE_TTL_MS) {
    return Response.json(c.data);
  }
  try {
    const rpcUrl = await pickRpc();
    const [{ weth, usdc }, ethPrice] = await Promise.all([getBalances(rpcUrl), getEthPrice()]);
    const wethUSD  = weth * ethPrice;
    const totalUSD = wethUSD + usdc;
    const payload = {
      weth:     weth.toFixed(6),
      usdc:     usdc.toFixed(2),
      wethUSD:  wethUSD.toFixed(2),
      totalUSD: totalUSD.toFixed(2),
      ethPrice: ethPrice.toFixed(2),
    };
    global._walletCache = { data: payload, time: Date.now() };
    return Response.json(payload);
  } catch (err) {
    if (global._walletCache.data) return Response.json(global._walletCache.data);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
