// arc-setup.js
import "dotenv/config";
import { createWalletClient, createPublicClient, http, defineChain } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Arc Testnet chain config
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [
        "https://delicate-hidden-paper.arc-testnet.quiknode.pro/0c8bcf018580e3da5153d86749070e07c6cf83c9/"
      ]
    }
  },
  blockExplorers: {
    default: {
      name: "Arc Explorer",
      url: "https://testnet.arcscan.app"
    }
  }
});

// Addresses (from Arc docs)
export const ARC_DOMAIN = 26;
export const ARC_USDC = "0x3600000000000000000000000000000000000000";
export const GATEWAY_WALLET = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9";
export const GATEWAY_MINTER = "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B";

export const account = privateKeyToAccount(process.env.PRIVATE_KEY);

export const walletClient = createWalletClient({
  chain: arcTestnet,
  transport: http(),
  account
});

export const publicClient = createPublicClient({
  chain: arcTestnet,
  transport: http()
});

console.log("Using account:", account.address);
