import { ethers } from "ethers";

export const runtime     = "nodejs";
export const maxDuration = 60;

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

export async function POST(request) {
  const secret = request.headers.get("x-transfer-secret");
  if (!process.env.TRANSFER_API_SECRET || secret !== process.env.TRANSFER_API_SECRET) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body JSON invalide" }, { status: 400 });
  }

  const { to, amount } = body ?? {};

  if (!ethers.isAddress(to)) {
    return Response.json({ error: "Adresse destinataire invalide" }, { status: 400 });
  }

  const amountNum = Number(amount);
  if (!amountNum || amountNum <= 0) {
    return Response.json({ error: "Montant invalide" }, { status: 400 });
  }

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    return Response.json({ error: "Clé privée non configurée (WALLET_PRIVATE_KEY)" }, { status: 500 });
  }

  try {
    const rpcUrl  = await pickRpc();
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet   = new ethers.Wallet(privateKey, provider);
    const usdc     = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, wallet);

    const rawAmount = ethers.parseUnits(amountNum.toString(), USDC_DECIMALS);

    const balance = await usdc.balanceOf(wallet.address);
    if (balance < rawAmount) {
      return Response.json({
        error:     "Solde USDC insuffisant",
        balance:   ethers.formatUnits(balance, USDC_DECIMALS),
        requested: amountNum,
      }, { status: 400 });
    }

    const tx      = await usdc.transfer(to, rawAmount);
    const receipt = await tx.wait();

    return Response.json({
      success:     true,
      txHash:      receipt.hash,
      from:        wallet.address,
      to,
      amount:      amountNum,
      blockNumber: receipt.blockNumber,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
