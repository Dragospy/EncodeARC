import { Address } from "viem";

// MainContract address
export const MAIN_CONTRACT_ADDRESS = "0xB914aE2b301FF9aaB799Fb5111fA3c7bb0BA9595" as Address;

// Contract ABI - This should be generated from your compiled contract
// For now, this includes the main functions you'll need
export const MAIN_CONTRACT_ABI = [
  // Read functions
  {
    inputs: [],
    name: "USDC",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "feeBps",
    outputs: [{ internalType: "uint16", name: "", type: "uint16" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minFee",
    outputs: [{ internalType: "uint96", name: "", type: "uint96" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pausedP2P",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pausedPayroll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "quoteP2P",
    outputs: [
      { internalType: "uint256", name: "fee", type: "uint256" },
      { internalType: "uint256", name: "totalFromSender", type: "uint256" },
      { internalType: "uint256", name: "amountToRecipient", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getPayroll",
    outputs: [
      { internalType: "address", name: "employer", type: "address" },
      { internalType: "address[]", name: "employees", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "uint40", name: "interval", type: "uint40" },
      { internalType: "uint40", name: "nextRun", type: "uint40" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "bool", name: "privacy", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getEmployees",
    outputs: [
      { internalType: "address[]", name: "employees", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "employer", type: "address" }],
    name: "getEmployerSchedules",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "schedules",
    outputs: [
      { internalType: "address", name: "employer", type: "address" },
      { internalType: "uint40", name: "interval", type: "uint40" },
      { internalType: "uint40", name: "nextRun", type: "uint40" },
      { internalType: "bool", name: "active", type: "bool" },
      { internalType: "bool", name: "privacy", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "string", name: "memo", type: "string" },
      { internalType: "bool", name: "requestPrivacy", type: "bool" },
    ],
    name: "send",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "employees", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "uint40", name: "interval", type: "uint40" },
      { internalType: "bool", name: "privacy", type: "bool" },
    ],
    name: "createPayroll",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "employee", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "addEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "index", type: "uint256" },
    ],
    name: "removeEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "index", type: "uint256" },
      { internalType: "uint256", name: "newAmount", type: "uint256" },
    ],
    name: "updateSalary",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "cancelPayroll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "fee", type: "uint256" },
      { indexed: false, internalType: "bytes32", name: "memoHash", type: "bytes32" },
      { indexed: false, internalType: "bool", name: "privacy", type: "bool" },
    ],
    name: "P2PTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      { indexed: true, internalType: "address", name: "employer", type: "address" },
      { indexed: false, internalType: "uint40", name: "interval", type: "uint40" },
      { indexed: false, internalType: "bool", name: "privacy", type: "bool" },
    ],
    name: "PayrollCreated",
    type: "event",
  },
] as const;
