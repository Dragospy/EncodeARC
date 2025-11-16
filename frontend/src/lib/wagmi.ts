import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";

// Configure Arc testnet chain
// Note: Arc testnet uses USDC as the native currency for gas fees
// This ensures low, predictable, and dollar-denominated fees
const chain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 5042002),
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6, // USDC has 6 decimals
    name: "USD Coin",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_RPC_URL ||
          "https://delicate-hidden-paper.arc-testnet.quiknode.pro/0c8bcf018580e3da5153d86749070e07c6cf83c9/",
      ],
    },
  },
});

export const config = getDefaultConfig({
  appName: "Payroll Platform",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [chain],
  transports: {
    [chain.id]: http(
      process.env.NEXT_PUBLIC_RPC_URL ||
        "https://delicate-hidden-paper.arc-testnet.quiknode.pro/0c8bcf018580e3da5153d86749070e07c6cf83c9/"
    ),
  },
  ssr: true,
});
