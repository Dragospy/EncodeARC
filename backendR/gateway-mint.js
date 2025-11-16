import "dotenv/config";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// -------- FROM API STEP 1 --------
const ATTESTATION = process.env.ATTESTATION;
const PAYLOAD = process.env.PAYLOAD;

// -------- CHAIN & GATEWAY MINTER --------
const chain = {
  id: 5042002,
  name: "Arc Testnet",
  rpcUrls: { default: { http: ["https://delicate-hidden-paper.arc-testnet.quiknode.pro/0c8bcf018580e3da5153d86749070e07c6cf83c9/"] } }
};

// Arc Testnet GatewayMinter
const GATEWAY_MINTER = "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B";

const gatewayMinterAbi = [
  {
    name: "mintWithAttestation",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "attestation", type: "bytes" },
      { name: "message", type: "bytes" }
    ],
    outputs: []
  }
];

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain,
  transport: http()
});

const publicClient = createPublicClient({
  chain,
  transport: http()
});

async function main() {
  console.log("🌈 Minting USDC from Gateway on Arc Testnet...");

  const txHash = await walletClient.writeContract({
    address: GATEWAY_MINTER,
    abi: gatewayMinterAbi,
    functionName: "mintWithAttestation",
    args: [ATTESTATION, PAYLOAD],
  });

  console.log("TX sent:", txHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  console.log("🎉 Mint complete! Block:", receipt.blockNumber);
}

main().catch(console.error);
