import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";

// Configure Arc testnet chain
// Note: Gas fees are ALWAYS paid in the native currency (ETH/ARC), not USDC
// The USDC transfer happens inside the contract execution
const chain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
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
