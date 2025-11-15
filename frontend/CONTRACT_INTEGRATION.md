# MainContract Integration Guide

The MainContract has been integrated into your frontend. Here's how to use it.

## Contract Address

The contract is deployed at: `0xB914aE2b301FF9aaB799Fb5111fA3c7bb0BA9595`

## Files Created

1. **`src/lib/contract.ts`** - Contract address and ABI definitions
2. **`src/hooks/useMainContract.ts`** - React hooks for interacting with the contract
3. **`src/lib/contract-example.tsx`** - Example components showing usage

## Quick Start

### Reading Contract Data

```tsx
import { useMainContractRead } from "@/hooks/useMainContract";

function MyComponent() {
  const { useFeeBps, usePausedP2P } = useMainContractRead();

  const { data: feeBps } = useFeeBps();
  const { data: isPaused } = usePausedP2P();

  return (
    <div>
      <p>Fee: {feeBps?.toString()} bps</p>
      <p>Paused: {isPaused ? "Yes" : "No"}</p>
    </div>
  );
}
```

### Sending a P2P Transfer

```tsx
import { useMainContract } from "@/hooks/useMainContract";
import { Address } from "viem";

function SendPayment() {
  const { sendP2P, isPending, isConfirmed, hash } = useMainContract();

  const handleSend = async () => {
    const to = "0x..." as Address;
    const amount = BigInt(1000000); // 1 USDC (6 decimals)
    const memo = "Payment for services";

    await sendP2P(to, amount, memo, false);
  };

  return (
    <button onClick={handleSend} disabled={isPending}>
      {isPending ? "Sending..." : "Send Payment"}
    </button>
  );
}
```

### Creating a Payroll Schedule

```tsx
import { useMainContract } from "@/hooks/useMainContract";
import { Address } from "viem";

function CreatePayroll() {
  const { createPayroll, isPending } = useMainContract();

  const handleCreate = async () => {
    const employees: Address[] = ["0x..." as Address, "0x..." as Address];
    const amounts: bigint[] = [
      BigInt(1000000), // 1 USDC
      BigInt(2000000), // 2 USDC
    ];
    const interval = 7 * 24 * 60 * 60; // 7 days in seconds

    await createPayroll(employees, amounts, interval, false);
  };

  return (
    <button onClick={handleCreate} disabled={isPending}>
      Create Payroll
    </button>
  );
}
```

### Getting Payroll Information

```tsx
import { useMainContractRead } from "@/hooks/useMainContract";

function PayrollInfo({ payrollId }: { payrollId: bigint }) {
  const { useGetPayroll } = useMainContractRead();
  const { data, isLoading } = useGetPayroll(payrollId);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No payroll found</div>;

  const [employer, employees, amounts, interval, nextRun, active, privacy] = data;

  return (
    <div>
      <p>Employer: {employer}</p>
      <p>Employees: {employees.length}</p>
      <p>Active: {active ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Available Functions

### Read Functions (via `useMainContractRead`)

- `useUSDC()` - Get USDC token address
- `useFeeBps()` - Get fee in basis points
- `useMinFee()` - Get minimum fee
- `usePausedP2P()` - Check if P2P is paused
- `usePausedPayroll()` - Check if payroll is paused
- `useQuoteP2P(amount)` - Get quote for P2P transfer
- `useGetPayroll(id)` - Get payroll schedule details
- `useGetEmployees(id)` - Get employees for a payroll
- `useGetEmployerSchedules(employer)` - Get all schedules for an employer

### Write Functions (via `useMainContract`)

- `sendP2P(to, amount, memo, requestPrivacy)` - Send P2P transfer
- `createPayroll(employees, amounts, interval, privacy)` - Create payroll schedule
- `addEmployee(id, employee, amount)` - Add employee to payroll
- `removeEmployee(id, index)` - Remove employee from payroll
- `updateSalary(id, index, newAmount)` - Update employee salary
- `cancelPayroll(id)` - Cancel payroll schedule

## Transaction States

All write functions return:

- `isPending` - Transaction is being sent
- `isConfirming` - Waiting for confirmation
- `isConfirmed` - Transaction confirmed
- `hash` - Transaction hash
- `writeError` - Error if transaction failed

## Important Notes

1. **USDC Decimals**: USDC uses 6 decimals. 1 USDC = 1,000,000 (BigInt)
2. **BigInt Usage**: All amounts must be BigInt values
3. **Address Types**: Use `Address` type from `viem` for addresses
4. **Approval Required**: Before sending P2P transfers, users must approve USDC spending
5. **ABI Updates**: If you update the contract, regenerate the ABI from `contracts/out/MainContract.sol/MainContract.json`

## Generating ABI from Foundry

To get the complete ABI after compiling:

```bash
cd contracts
forge build
# ABI will be in contracts/out/MainContract.sol/MainContract.json
```

Then copy the `abi` field from the JSON file to `src/lib/contract.ts`.
