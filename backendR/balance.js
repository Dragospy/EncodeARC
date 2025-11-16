import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);

// Gateway API endpoint for testnet
const GATEWAY_API = "https://gateway-api-testnet.circle.com/v1/balances";

// Domain IDs from Gateway API /v1/info
const DOMAINS = {
  ethereumSepolia: 0,
  avalancheFuji: 1,
  baseSepolia: 6,
  sonicTestnet: 13,
  worldchainSepolia: 14,
  seiAtlantic: 16,
  hyperevmTestnet: 19,
  arcTestnet: 26  // ✅ Found it!
};

async function checkGatewayBalance(depositor, domainIds) {
  console.log("🔍 Checking Gateway Balance via API...");
  console.log("Account:", depositor);
  console.log("");

  // Build sources array with correct format
  const sources = domainIds.map(domain => ({
    depositor: depositor,
    domain: domain,
    token: "USDC"
  }));

  try {
    const response = await fetch(GATEWAY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sources })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Raw API Response:");
    console.log(JSON.stringify(data, null, 2));

    // Parse and display balances
    if (data.balances && data.balances.length > 0) {
      console.log("\n📊 Gateway Balance Summary:");
      
      const domainNames = {
        0: "Ethereum Sepolia",
        1: "Avalanche Fuji", 
        6: "Base Sepolia",
        13: "Sonic Testnet",
        14: "Worldchain Sepolia",
        16: "Sei Atlantic",
        19: "HyperEVM Testnet",
        26: "Arc Testnet"
      };

      let totalBalance = 0n;
      let hasBalance = false;
      
      data.balances.forEach(balance => {
        const chainName = domainNames[balance.domain] || `Domain ${balance.domain}`;
        const amount = BigInt(balance.balance);
        
        if (amount > 0n) {
          console.log(`  ✅ ${chainName}: ${Number(amount) / 1e6} USDC`);
          totalBalance += amount;
          hasBalance = true;
        } else {
          console.log(`  ⚪ ${chainName}: 0 USDC`);
        }
      });

      console.log("\n" + "=".repeat(60));
      
      if (hasBalance) {
        console.log(`💰 TOTAL UNIFIED BALANCE: ${Number(totalBalance) / 1e6} USDC`);
        console.log("\n✨ This balance is available across ALL Gateway-supported chains!");
      } else {
        console.log("⚠️  No USDC balance found in Gateway");
        console.log("\nPossible reasons:");
        console.log("1. Deposit transaction is still being processed");
        console.log("2. Need to wait for finality (may take a few minutes)");
        console.log("3. Check your deposit transaction hash on the explorer");
      }
    } else {
      console.log("\n⚠️  No balance data returned from API");
    }

  } catch (error) {
    console.error("❌ Error checking Gateway balance:");
    console.error(error.message);
  }
}

async function checkArcOnly() {
  console.log("🎯 Checking Arc Testnet Balance Only...\n");
  await checkGatewayBalance(account.address, [DOMAINS.arcTestnet]);
}

async function checkAllChains() {
  console.log("🌐 Checking All Supported Chains...\n");
  await checkGatewayBalance(account.address, Object.values(DOMAINS));
}

async function main() {
  // First check just Arc
  await checkArcOnly();
  
  console.log("\n" + "=".repeat(60) + "\n");
  
  // Then check all chains to see unified balance
  await checkAllChains();
}

main().catch(console.error);