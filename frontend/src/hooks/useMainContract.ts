import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MAIN_CONTRACT_ADDRESS, MAIN_CONTRACT_ABI } from "@/lib/contract";
import { Address } from "viem";

/**
 * Hook to interact with the MainContract
 */
export function useMainContract() {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read contract state
  const useContractRead = <T = any>(
    functionName: string,
    args?: readonly unknown[],
    options?: { enabled?: boolean }
  ) => {
    return useReadContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: functionName as any,
      args: args as any,
      query: {
        enabled: options?.enabled ?? true,
      },
    });
  };

  // Write contract functions
  const sendP2P = async (
    to: Address,
    amount: bigint,
    memo: string = "",
    requestPrivacy: boolean = false
  ) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "send",
      args: [to, amount, memo, requestPrivacy],
    });
  };

  const createPayroll = async (
    employees: Address[],
    amounts: bigint[],
    interval: number, // uint40 - seconds
    privacy: boolean = false
  ) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "createPayroll",
      args: [employees, amounts, interval, privacy],
    });
  };

  const addEmployee = async (id: bigint, employee: Address, amount: bigint) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "addEmployee",
      args: [id, employee, amount],
    });
  };

  const removeEmployee = async (id: bigint, index: bigint) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "removeEmployee",
      args: [id, index],
    });
  };

  const updateSalary = async (id: bigint, index: bigint, newAmount: bigint) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "updateSalary",
      args: [id, index, newAmount],
    });
  };

  const cancelPayroll = async (id: bigint) => {
    return writeContract({
      address: MAIN_CONTRACT_ADDRESS,
      abi: MAIN_CONTRACT_ABI,
      functionName: "cancelPayroll",
      args: [id],
    });
  };

  return {
    // Read functions
    useContractRead,
    // Write functions
    sendP2P,
    createPayroll,
    addEmployee,
    removeEmployee,
    updateSalary,
    cancelPayroll,
    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    writeError,
  };
}

/**
 * Hook to read specific contract values
 */
export function useMainContractRead() {
  const { useContractRead } = useMainContract();

  return {
    useUSDC: () => useContractRead<Address>("USDC"),
    useFeeBps: () => useContractRead<bigint>("feeBps"),
    useMinFee: () => useContractRead<bigint>("minFee"),
    usePausedP2P: () => useContractRead<boolean>("pausedP2P"),
    usePausedPayroll: () => useContractRead<boolean>("pausedPayroll"),
    useQuoteP2P: (amount: bigint, enabled: boolean = true) =>
      useContractRead<[bigint, bigint, bigint]>("quoteP2P", [amount], { enabled }),
    useGetPayroll: (id: bigint, enabled: boolean = true) =>
      useContractRead<[Address, Address[], bigint[], bigint, bigint, boolean, boolean]>(
        "getPayroll",
        [id],
        { enabled }
      ),
    useGetEmployees: (id: bigint, enabled: boolean = true) =>
      useContractRead<[Address[], bigint[]]>("getEmployees", [id], { enabled }),
    useGetEmployerSchedules: (employer: Address, enabled: boolean = true) =>
      useContractRead<bigint[]>("getEmployerSchedules", [employer], { enabled }),
  };
}
