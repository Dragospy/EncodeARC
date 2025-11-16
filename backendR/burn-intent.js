// burn-intent.js
import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";
import { pad, maxUint256 } from "viem";
import { randomBytes } from "node:crypto";
import { ARC_DOMAIN, ARC_USDC, GATEWAY_WALLET, GATEWAY_MINTER } from "./arc-setup.js";

// Helper: address -> bytes32
function addressToBytes32(address) {
  return pad(address.toLowerCase(), { size: 32 });
}

// Build a single burn intent (Arc → Arc, 1 USDC)
function createBurnIntent({ account, amount }) {
  return {
    maxBlockHeight: maxUint256,
    maxFee: 2_010000n, // 2.01 USDC fee cap
    spec: {
      version: 1,
      sourceDomain: ARC_DOMAIN,
      destinationDomain: ARC_DOMAIN,
      sourceContract: GATEWAY_WALLET,
      destinationContract: GATEWAY_MINTER,
      sourceToken: ARC_USDC,
      destinationToken: ARC_USDC,
      sourceDepositor: account.address,
      destinationRecipient: account.address,
      sourceSigner: account.address,
      destinationCaller: "0x0000000000000000000000000000000000000000",
      value: BigInt(Math.floor(amount * 1e6)), // USDC → atomic units
      salt: "0x" + randomBytes(32).toString("hex"),
      hookData: "0x"
    }
  };
}

// Build EIP-712 typed data for BurnIntent
function burnIntentTypedData(intent) {
  return {
    domain: { name: "GatewayWallet", version: "1" },
    primaryType: "BurnIntent",
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" }
      ],
      TransferSpec: [
        { name: "version", type: "uint32" },
        { name: "sourceDomain", type: "uint32" },
        { name: "destinationDomain", type: "uint32" },
        { name: "sourceContract", type: "bytes32" },
        { name: "destinationContract", type: "bytes32" },
        { name: "sourceToken", type: "bytes32" },
        { name: "destinationToken", type: "bytes32" },
        { name: "sourceDepositor", type: "bytes32" },
        { name: "destinationRecipient", type: "bytes32" },
        { name: "sourceSigner", type: "bytes32" },
        { name: "destinationCaller", type: "bytes32" },
        { name: "value", type: "uint256" },
        { name: "salt", type: "bytes32" },
        { name: "hookData", type: "bytes" }
      ],
      BurnIntent: [
        { name: "maxBlockHeight", type: "uint256" },
        { name: "maxFee", type: "uint256" },
        { name: "spec", type: "TransferSpec" }
      ]
    },
    message: {
      ...intent,
      spec: {
        ...intent.spec,
        sourceContract: addressToBytes32(intent.spec.sourceContract),
        destinationContract: addressToBytes32(intent.spec.destinationContract),
        sourceToken: addressToBytes32(intent.spec.sourceToken),
        destinationToken: addressToBytes32(intent.spec.destinationToken),
        sourceDepositor: addressToBytes32(intent.spec.sourceDepositor),
        destinationRecipient: addressToBytes32(intent.spec.destinationRecipient),
        sourceSigner: addressToBytes32(intent.spec.sourceSigner),
        destinationCaller: addressToBytes32(intent.spec.destinationCaller)
      }
    }
  };
}

async function main() {
  const account = privateKeyToAccount(process.env.PRIVATE_KEY);
  const AMOUNT = 1; // 1 USDC

  console.log("📝 Creating burn intent...");
  const intent = createBurnIntent({ account, amount: AMOUNT });

  console.log("📝 Building typed-data...");
  const typedData = burnIntentTypedData(intent);

  console.log("📝 Signing burn intent...");
  const signature = await account.signTypedData(typedData);
  console.log("Signature:", signature);

  const payload = [
    {
      burnIntent: typedData.message,
      signature
    }
  ];

  console.log("📡 Sending burn intent to Gateway API...");

  const response = await fetch("https://gateway-api-testnet.circle.com/v1/transfer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload, (_, v) =>
      typeof v === "bigint" ? v.toString() : v
    )
  });

  const data = await response.json();
  console.log("Gateway Response:", data);

  if (data.success === false) {
    console.error("❌ Gateway API Error:", data);
    return;
  }

  console.log("🎉 Attestation received!");
  console.log(JSON.stringify(data, null, 2));

  console.log("\n👉 Copy these into your .env:");
  console.log("ATTESTATION=", data.attestation);
  console.log("ATTESTATION_SIGNATURE=", data.signature);
}

main().catch(console.error);


