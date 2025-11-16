// deposit.js
import { parseUnits } from "viem";
import { account, walletClient, publicClient, ARC_USDC, GATEWAY_WALLET } from "./arc-setup.js";
import { erc20Abi, gatewayWalletAbi } from "./abis.js";

async function main() {
  const amount = parseUnits("1", 6); // 1 USDC (6 decimals)

  console.log("🔍 Checking ERC20 USDC balance on Arc...");
  const balance = await publicClient.readContract({
    address: ARC_USDC,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account.address]
  });
  console.log("USDC ERC20 balance:", Number(balance) / 1e6, "USDC");

  if (balance < amount) {
    console.log("❌ Not enough USDC to deposit.");
    return;
  }

  console.log("\n📝 Approving GatewayWallet to spend 1 USDC...");
  const approveTx = await walletClient.writeContract({
    address: ARC_USDC,
    abi: erc20Abi,
    functionName: "approve",
    args: [GATEWAY_WALLET, amount]
  });
  console.log("Approval tx:", approveTx);
  await publicClient.waitForTransactionReceipt({ hash: approveTx });
  console.log("✅ Approval confirmed.");

  console.log("\n💰 Depositing 1 USDC into GatewayWallet...");
  const depositTx = await walletClient.writeContract({
    address: GATEWAY_WALLET,
    abi: gatewayWalletAbi,
    functionName: "deposit",
    args: [ARC_USDC, amount]
  });
  console.log("Deposit tx:", depositTx);
  const receipt = await publicClient.waitForTransactionReceipt({ hash: depositTx });
  console.log("✅ Deposit confirmed in block:", receipt.blockNumber);
  console.log("🎉 1 USDC deposited into Gateway unified balance.");
}

main().catch(console.error);
