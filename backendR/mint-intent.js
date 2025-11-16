// mint-intent.js
import "dotenv/config";
import { walletClient, publicClient } from "./arc-setup.js";
import { gatewayMinterAbi, } from "./abis.js";
import { GATEWAY_MINTER } from "./arc-setup.js";

async function main() {
  const attestation = process.env.ATTESTATION;
  const sig = process.env.ATTESTATION_SIGNATURE;

  if (!attestation || !sig) {
    console.error("❌ ATTESTATION or ATTESTATION_SIGNATURE missing in .env");
    return;
  }

  console.log("🌈 Minting USDC on Arc via GatewayMinter...");
  const txHash = await walletClient.writeContract({
    address: GATEWAY_MINTER,
    abi: gatewayMinterAbi,
    functionName: "gatewayMint",
    args: [attestation, sig]
  });

  console.log("Mint tx:", txHash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("✅ Mint confirmed in block:", receipt.blockNumber);
  console.log("🎉 USDC should now be in your Arc wallet again.");
}

main().catch(console.error);
