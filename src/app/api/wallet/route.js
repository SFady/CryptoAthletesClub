const WETH_ADDRESS = "0x4200000000000000000000000000000000000006";
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const WALLET       = "0xaf96ca0b19b3966105bf2f28a05c10d586692499";

const RPC_URLS = [
  "https://base-rpc.publicnode.com",
  "https://base.drpc.org",
  "https://1rpc.io/base",
  "https://mainnet.base.org",
];

const CACHE_TTL_MS = 25_000;
if (!global._walletCache) global._walletCache = { data: null, time: 0 };

function balanceOfData(wallet) {
  return "0x70a08231" + wallet.toLowerCase().replace("0x", "").padStart(64, "0");
}

async function getBalances() {
  const calldata = balanceOfData(WALLET);
  const batch = [
    { jsonrpc: "2.0", method: "eth_call", params: [{ to: WETH_ADDRESS, data: calldata }, "latest"], id: 0 },
    { jsonrpc: "2.0", method: "eth_call", params: [{ to: USDC_ADDRESS, data: calldata }, "latest"], id: 1 },
  ];
  let lastError;
  for (const url of RPC_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
      });
      const json = await res.json();
      if (json.error) throw new Error(JSON.stringify(json.error));
      const weth = Number(BigInt(json[0].result)) / 1e18;
      const usdc = Number(BigInt(json[1].result)) / 1e6;
      return { weth, usdc };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
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
    const [{ weth, usdc }, ethPrice] = await Promise.all([getBalances(), getEthPrice()]);
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
