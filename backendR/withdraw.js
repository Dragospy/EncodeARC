import "dotenv/config";
import { createWalletClient, createPublicClient, http, parseUnits, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// ---------------------------------------------------------
// Correct Gateway config
// ---------------------------------------------------------

// GatewayWallet on Arc Testnet
const GATEWAY = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9";

// USDC ERC-20 interface on Arc Testnet (6 decimals)
const ARC_USDC = "0x3600000000000000000000000000000000000000";

// Arc Testnet domain ID (correct! NOT 5042002)
const ARC_DOMAIN = 26;

// ---------------------------------------------------------
// Arc Testnet chain config
// ---------------------------------------------------------

const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [
        "https://delicate-hidden-paper.arc-testnet.quiknode.pro/0c8bcf018580e3da5153d86749070e07c6cf83c9/"
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: "https://testnet.arcscan.app",
    },
  },
});

// ---------------------------------------------------------
// Gateway ABI
// ---------------------------------------------------------

const gatewayAbi = [
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "token", type: "address" },
      { name: "destinationDomain", type: "uint32" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "addDelegate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "delegate", type: "address" }],
    outputs: [],
  },
];

// ---------------------------------------------------------
// Clients
// ---------------------------------------------------------

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

const walletClient = createWalletClient({
  chain: arcTestnet,     // WITHDRAWING FROM Arc Testnet
  transport: http(),
  account,
});

const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http(),
});

// ---------------------------------------------------------
// Main logic
// ---------------------------------------------------------

async function main() {
  const amount = parseUnits("1", 6); // 1 USDC (6 decimals)

  console.log("🔍 Withdrawal Details:");
  console.log("Source Chain: Arc Testnet");
  console.log("Destination Domain:", ARC_DOMAIN);
  console.log("Token:", ARC_USDC);
  console.log("Recipient:", account.address);
  console.log("Amount:", Number(amount) / 1e6, "USDC\n");

  console.log("💸 Withdrawing from Gateway unified balance → Arc Testnet...");

  try {
    const txHash = await walletClient.writeContract({
      address: GATEWAY,
      abi: gatewayAbi,
      functionName: "withdraw",
      args: [
        ARC_USDC,          // token address
        ARC_DOMAIN,        // destination domain (26 = Arc Testnet)
        account.address,   // recipient
        amount,            // amount in USDC (6 decimals)
      ],
    });

    console.log("✅ Withdrawal transaction sent:", txHash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    console.log("✅ Confirmed in block:", receipt.blockNumber);
    console.log("🎉 SUCCESS! USDC will be minted on Arc shortly.\n");

    console.log("🔗 Explorer:");
    console.log(`https://testnet.arcscan.app/tx/${txHash}`);

  } catch (error) {
    console.error("❌ Withdrawal failed:", error.message);

    if (error.message.includes("insufficient balance")) {
      console.log("\n💡 You do NOT have enough unified USDC balance.");
      console.log("Run your balance checker to verify.");
    }

    if (error.message.includes("delegate")) {
      console.log("\n💡 You must call addDelegate(yourAddress) first.");
    }
  }
}

main().catch(console.error);
