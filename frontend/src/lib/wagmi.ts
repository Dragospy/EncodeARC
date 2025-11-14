import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { defineChain } from "viem";

// TODO: Configure your chain
const chain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  name: "Ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://eth.llamarpc.com"],
    },
  },
});

export const config = getDefaultConfig({
  appName: "Payroll Platform",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [chain],
  transports: {
    [chain.id]: http(process.env.NEXT_PUBLIC_RPC_URL || "https://eth.llamarpc.com"),
  },
  ssr: true,
});

