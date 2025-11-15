import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";

// TODO: Configure your chain
const chain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  name: "USDC",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.testnet.arc.network"],
    },
  },
});

export const config = getDefaultConfig({
  appName: "Payroll Platform",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [chain],
  transports: {
    [chain.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.testnet.arc.network"),
  },
  ssr: true,
});

