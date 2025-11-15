/**
 * Example usage of the MainContract hooks
 *
 * This file shows how to use the contract in your components
 */

import { useMainContract, useMainContractRead } from "@/hooks/useMainContract";
import { Address } from "viem";

// Example: Reading contract state
export function ExampleReadContract() {
  const { useUSDC, useFeeBps, usePausedP2P } = useMainContractRead();

  const { data: usdcAddress } = useUSDC();
  const { data: feeBps } = useFeeBps();
  const { data: isPaused } = usePausedP2P();

  return (
    <div>
      <p>USDC Address: {usdcAddress}</p>
      <p>Fee (bps): {feeBps?.toString()}</p>
      <p>P2P Paused: {isPaused ? "Yes" : "No"}</p>
    </div>
  );
}

// Example: Sending a P2P transfer
export function ExampleSendP2P() {
  const { sendP2P, isPending, isConfirmed, hash } = useMainContract();

  const handleSend = async () => {
    try {
      const to = "0x..." as Address; // recipient address
      const amount = BigInt(1000000); // 1 USDC (6 decimals)
      const memo = "Payment for services";

      await sendP2P(to, amount, memo, false);
    } catch (error) {
      console.error("Failed to send:", error);
    }
  };

  return (
    <div>
      <button onClick={handleSend} disabled={isPending}>
        {isPending ? "Sending..." : "Send Payment"}
      </button>
      {isConfirmed && <p>Transaction confirmed! Hash: {hash}</p>}
    </div>
  );
}

// Example: Creating a payroll schedule
export function ExampleCreatePayroll() {
  const { createPayroll, isPending, isConfirmed } = useMainContract();

  const handleCreatePayroll = async () => {
    try {
      const employees: Address[] = ["0x..." as Address, "0x..." as Address];
      const amounts: bigint[] = [
        BigInt(1000000), // 1 USDC
        BigInt(2000000), // 2 USDC
      ];
      const interval = 7 * 24 * 60 * 60; // 7 days in seconds
      const privacy = false;

      await createPayroll(employees, amounts, interval, privacy);
    } catch (error) {
      console.error("Failed to create payroll:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCreatePayroll} disabled={isPending}>
        {isPending ? "Creating..." : "Create Payroll"}
      </button>
      {isConfirmed && <p>Payroll created successfully!</p>}
    </div>
  );
}

// Example: Getting payroll information
export function ExampleGetPayroll({ payrollId }: { payrollId: bigint }) {
  const { useGetPayroll } = useMainContractRead();
  const { data, isLoading, error } = useGetPayroll(payrollId);

  if (isLoading) return <div>Loading payroll...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No payroll found</div>;

  const [employer, employees, amounts, interval, nextRun, active, privacy] = data as unknown as [
    Address,
    Address[],
    bigint[],
    bigint,
    bigint,
    boolean,
    boolean,
  ];

  return (
    <div>
      <h3>Payroll #{payrollId.toString()}</h3>
      <p>Employer: {employer}</p>
      <p>Employees: {employees.length}</p>
      <p>Active: {active ? "Yes" : "No"}</p>
      <p>Next Run: {new Date(Number(nextRun) * 1000).toLocaleString()}</p>
    </div>
  );
}

// Example: Getting employer schedules
export function ExampleGetEmployerSchedules({ employer }: { employer: Address }) {
  const { useGetEmployerSchedules } = useMainContractRead();
  const { data: scheduleIdsData, isLoading } = useGetEmployerSchedules(employer);

  if (isLoading) return <div>Loading schedules...</div>;

  const scheduleIds = scheduleIdsData as unknown as bigint[];
  if (!scheduleIds || scheduleIds.length === 0) {
    return <div>No payroll schedules found</div>;
  }

  return (
    <div>
      <h3>Payroll Schedules</h3>
      <ul>
        {scheduleIds.map((id) => (
          <li key={id.toString()}>Schedule #{id.toString()}</li>
        ))}
      </ul>
    </div>
  );
}

// Example: Getting a P2P quote
export function ExampleQuoteP2P({ amount }: { amount: bigint }) {
  const { useQuoteP2P } = useMainContractRead();
  const { data, isLoading } = useQuoteP2P(amount);

  if (isLoading) return <div>Calculating quote...</div>;
  if (!data) return <div>Unable to get quote</div>;

  const [fee, totalFromSender, amountToRecipient] = data as unknown as [bigint, bigint, bigint];

  return (
    <div>
      <h3>P2P Transfer Quote</h3>
      <p>Amount: {amount.toString()}</p>
      <p>Fee: {fee.toString()}</p>
      <p>Total from sender: {totalFromSender.toString()}</p>
      <p>Amount to recipient: {amountToRecipient.toString()}</p>
    </div>
  );
}
