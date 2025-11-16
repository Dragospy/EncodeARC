import { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useMainContract, useMainContractRead } from "@/hooks/useMainContract";
import { Address } from "viem";
import { MAIN_CONTRACT_ADDRESS, MAIN_CONTRACT_ABI } from "@/lib/contract";

interface SendPayoutProps {
  defaults?: {
    walletAddress?: string;
    amount?: string;
    memo?: string;
    currency?: string;
  };
}

// Helper function to validate Ethereum address format
const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export function SendPayout({ defaults }: SendPayoutProps) {
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState(defaults?.walletAddress || "");
  const [amount, setAmount] = useState(defaults?.amount || "");
  const [currency, setCurrency] = useState(defaults?.currency || "USDC");
  const [memo, setMemo] = useState(defaults?.memo || "");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  // Use refs to track transaction state for polling
  const hashRef = useRef<string | undefined>(undefined);
  const writeErrorRef = useRef<any>(null);

  const { sendP2P, isPending, isConfirming, isConfirmed, writeError, hash } = useMainContract();

  // Update refs when hook values change
  useEffect(() => {
    hashRef.current = hash;
  }, [hash]);

  useEffect(() => {
    writeErrorRef.current = writeError;
  }, [writeError]);
  const { useUSDC } = useMainContractRead();
  const { data: usdcAddress } = useUSDC();
  const publicClient = usePublicClient();
  const { writeContract: writeContractApprove, data: approveHash } = useWriteContract();
  const { isLoading: isApproving, isSuccess: isApproved } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  // Monitor transaction status
  useEffect(() => {
    if (hash) {
      console.log("Transaction hash received:", hash);
      setTransactionHash(hash);
      toast.info("Transaction submitted! Waiting for confirmation...");
    }
  }, [hash]);

  // Debug: Log confirmation state changes
  useEffect(() => {
    console.log("Transaction state:", {
      isPending,
      isConfirming,
      isConfirmed,
      hash,
      writeError: writeError ? "Error present" : "No error",
    });
  }, [isPending, isConfirming, isConfirmed, hash, writeError]);

  // Function to verify and save transaction
  const verifyAndSaveTransaction = useCallback(
    async (txHash: string) => {
      if (!publicClient) {
        console.error("Public client not available");
        return;
      }

      try {
        console.log("Checking transaction receipt for:", txHash);

        // Get transaction receipt to verify it actually succeeded (not reverted)
        const receipt = await publicClient.getTransactionReceipt({
          hash: txHash as `0x${string}`,
        });

        console.log("Transaction receipt:", {
          status: receipt.status,
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          logs: receipt.logs.length,
        });

        // Check if transaction reverted
        if (receipt.status === "reverted") {
          console.error("Transaction reverted:", receipt);
          toast.error("Transaction failed on-chain. Please try again.");
          setStep("review");
          return;
        }

        // Check if the P2PTransfer event was emitted (transaction actually executed)
        const p2pTransferEvent = receipt.logs.find((log) => {
          // Check if this log is from our contract and matches P2PTransfer event signature
          return log.address.toLowerCase() === MAIN_CONTRACT_ADDRESS.toLowerCase();
        });

        if (!p2pTransferEvent) {
          console.warn("P2PTransfer event not found in receipt logs");
          // Still proceed - the transaction succeeded, event might be in a different format
        } else {
          console.log("P2PTransfer event found:", p2pTransferEvent);
        }

        // Transaction succeeded, save to Supabase
        const supabase = createClient();
        const { error } = await supabase.from("transactions").insert({
          wallet_sender: address,
          wallet_recipient: walletAddress,
          amount: parseFloat(amount),
          transaction_id: txHash,
          status: "completed",
        });

        if (error) {
          toast.error("Transaction succeeded but failed to save to database");
          console.error("Supabase error:", error);
        } else {
          toast.success("Payout sent successfully!");
          setStep("success");
        }
      } catch (error) {
        console.error("Error verifying or saving transaction:", error);
        // Don't show error if receipt not found yet (transaction still pending)
        if ((error as any)?.message?.includes("not found")) {
          console.log("Transaction receipt not found yet, will retry...");
          return false; // Indicate we should retry
        }
        toast.error("Transaction succeeded but failed to save to database");
        return true; // Indicate we're done (error occurred)
      }
      return true; // Indicate we're done (success)
    },
    [publicClient, address, walletAddress, amount]
  );

  // Use isConfirmed from wagmi hook (primary method)
  useEffect(() => {
    if (isConfirmed && transactionHash && publicClient) {
      console.log("Transaction confirmed via wagmi hook");
      verifyAndSaveTransaction(transactionHash);
    }
  }, [isConfirmed, transactionHash, address, walletAddress, amount, publicClient]);

  // Fallback: Manually poll for transaction receipt if hash exists but isConfirmed never fires
  useEffect(() => {
    if (transactionHash && !isConfirmed && publicClient) {
      console.log("Hash exists but isConfirmed is false, starting manual polling...");
      let attempts = 0;
      const maxAttempts = 60; // Poll for up to 60 seconds (1 second intervals)

      const pollForReceipt = async () => {
        // Stop polling if isConfirmed becomes true (wagmi hook caught up)
        if (isConfirmed) {
          console.log("isConfirmed became true, stopping manual poll");
          return;
        }

        attempts++;
        if (attempts > maxAttempts) {
          console.error("Transaction receipt polling timeout");
          toast.error("Transaction is taking longer than expected. Please check your wallet.");
          return;
        }

        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: transactionHash as `0x${string}`,
          });

          // Receipt found! Transaction is confirmed
          console.log("Transaction receipt found via manual polling");
          const saved = await verifyAndSaveTransaction(transactionHash);
          if (saved) {
            // Transaction saved, stop polling
            return;
          }
        } catch (error: any) {
          // Receipt not found yet, continue polling
          if (error?.message?.includes("not found")) {
            // Schedule next poll
            setTimeout(pollForReceipt, 1000);
          } else {
            console.error("Error polling for receipt:", error);
          }
        }
      };

      // Start polling after a short delay
      const timeoutId = setTimeout(pollForReceipt, 2000); // Wait 2 seconds before starting to poll

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [transactionHash, isConfirmed, publicClient, address, walletAddress, amount]);

  useEffect(() => {
    if (writeError) {
      console.error("Transaction write error:", writeError);
      // Extract error message - wagmi errors can have different structures
      const errorMessage =
        (writeError as any).message ||
        (writeError as any).shortMessage ||
        (writeError as any).details ||
        "User rejected or transaction failed";
      toast.error(`Transaction failed: ${errorMessage}`);
      // Reset step to review so user can try again
      setStep("review");
    }
  }, [writeError]);

  const handleReview = () => {
    if (!walletAddress || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!isValidAddress(walletAddress)) {
      toast.error("Please enter a valid wallet address (0x followed by 40 hex characters)");
      return;
    }
    setStep("review");
  };

  const handleSend = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!walletAddress || !amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isValidAddress(walletAddress)) {
      toast.error("Please enter a valid wallet address");
      return;
    }

    try {
      console.log("Wallet address:", walletAddress);

      // Convert amount to bigint (USDC has 6 decimals)
      const amountFloat = parseFloat(amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      // Convert to USDC units (6 decimals)
      // The user enters the TOTAL amount they want to spend (including fees)
      const totalAmountInWei = BigInt(Math.floor(amountFloat * 1_000_000));

      if (!usdcAddress) {
        toast.error("Failed to get USDC address");
        return;
      }

      if (!publicClient) {
        toast.error("Failed to connect to blockchain");
        return;
      }

      // Binary search to find the recipient amount that results in the desired total
      // We need to find the largest amountToRecipient such that quoteP2P(amountToRecipient).totalFromSender <= totalAmountInWei
      // Add delay between calls to avoid rate limiting
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      let low = BigInt(1);
      let high = totalAmountInWei;
      let amountToRecipient = BigInt(0);
      let fee: bigint = BigInt(0);
      let totalFromSender: bigint = BigInt(0);

      // Binary search with max 20 iterations (reduced to avoid rate limiting)
      // Add small delay between calls to respect rate limits
      for (let i = 0; i < 20; i++) {
        if (low > high) break;

        // Calculate mid point (BigInt division truncates, which is fine for binary search)
        const mid = (low + high) / BigInt(2);
        if (mid === BigInt(0)) break;

        try {
          // Add delay to avoid rate limiting (except for first call)
          if (i > 0) {
            await delay(100); // 100ms delay between calls
          }

          const result = (await publicClient.readContract({
            address: MAIN_CONTRACT_ADDRESS,
            abi: MAIN_CONTRACT_ABI,
            functionName: "quoteP2P",
            args: [mid],
          })) as [bigint, bigint, bigint];

          const [currentFee, currentTotal] = result;

          if (currentTotal <= totalAmountInWei) {
            // This amount works, try to find a larger one
            amountToRecipient = mid;
            fee = currentFee;
            totalFromSender = currentTotal;
            low = mid + BigInt(1);
          } else {
            // Total is too high, need smaller recipient amount
            high = mid - BigInt(1);
          }
        } catch (error: any) {
          // If quote fails (e.g., rate limited), try a smaller amount
          // Add longer delay on error to back off
          await delay(200);
          high = mid - BigInt(1);
        }
      }

      if (!amountToRecipient || amountToRecipient === BigInt(0)) {
        throw new Error(
          "Unable to calculate recipient amount. The total may be too small to cover fees."
        );
      }

      if (!fee || !totalFromSender || totalFromSender === BigInt(0)) {
        throw new Error("Invalid quote result from contract");
      }

      // Verify the total is acceptable (should be <= what user entered)
      if (totalFromSender > totalAmountInWei) {
        throw new Error(
          "Calculated total exceeds entered amount. Please try a slightly larger amount."
        );
      }

      // ---------------------------------------------------
      // 2️⃣ Check allowance and approve USDC if needed
      // ---------------------------------------------------
      // Standard ERC20 ABI for allowance and approve
      const erc20ABI = [
        {
          inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
          ],
          name: "allowance",
          outputs: [{ name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
      ] as const;

      // Check current allowance
      const currentAllowance = (await publicClient.readContract({
        address: usdcAddress as Address,
        abi: erc20ABI,
        functionName: "allowance",
        args: [address as Address, MAIN_CONTRACT_ADDRESS],
      })) as bigint;

      // Only approve if current allowance is insufficient
      if (currentAllowance > totalFromSender) {
        toast.info("Approving USDC…");

        // Use wagmi's writeContract for approval (goes through wagmi/RainbowKit, not direct MetaMask)
        writeContractApprove({
          address: usdcAddress as Address,
          abi: erc20ABI,
          functionName: "approve",
          args: [MAIN_CONTRACT_ADDRESS, totalFromSender],
        });

        // Wait for approval hash to be set
        let currentApproveHash: `0x${string}` | undefined;
        let attempts = 0;
        while (!currentApproveHash && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          currentApproveHash = approveHash;
          attempts++;
        }

        if (!currentApproveHash) {
          throw new Error("Failed to submit approval transaction");
        }

        // Wait for approval transaction to be confirmed
        toast.info("Waiting for approval confirmation...");
        let approvalConfirmed = false;
        attempts = 0;
        while (!approvalConfirmed && attempts < 300) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          approvalConfirmed = isApproved;
          attempts++;
        }

        if (!approvalConfirmed) {
          throw new Error("Approval transaction timeout");
        }

        toast.success("USDC Approved!");
      } else {
        toast.info("Sufficient allowance already exists, skipping approval...");
      }

      // Call the contract's send function (P2P)
      // Send the calculated recipient amount (not the total)
      // Note: sendP2P calls writeContract which doesn't return a promise
      // It triggers the wallet prompt and updates wagmi state (isPending, hash, writeError)

      // Reset refs before initiating transaction
      hashRef.current = undefined;
      writeErrorRef.current = null;

      console.log("Calling sendP2P with:", {
        to: walletAddress,
        amount: amountToRecipient.toString(),
        memo: memo || "",
        requestPrivacy: false,
      });

      toast.info("Please confirm the transaction in your wallet...");

      sendP2P(
        walletAddress as Address,
        amountToRecipient,
        memo || "",
        false // requestPrivacy - set to false by default
      );

      // Wait for the transaction to be submitted (hash set) or an error to occur
      // This ensures we know if the transaction was initiated or failed
      // Use refs to check state since React state updates are async
      let transactionSubmitted = false;
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds max wait

      while (!transactionSubmitted && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Check if hash is set (transaction submitted) using ref
        if (hashRef.current) {
          console.log("Transaction submitted with hash:", hashRef.current);
          transactionSubmitted = true;
          break;
        }

        // Check if there's an error using ref
        if (writeErrorRef.current) {
          console.error("Transaction error detected:", writeErrorRef.current);
          // The useEffect will handle showing the error
          throw new Error("Transaction failed to submit");
        }

        attempts++;
      }

      if (!transactionSubmitted && !hashRef.current) {
        throw new Error(
          "Transaction timeout - please try again. Make sure to confirm the transaction in your wallet."
        );
      }

      // Transaction is being processed
      // The useEffect hooks will handle:
      // - Setting transactionHash when hash is available
      // - Saving to database when isConfirmed is true
      // - Showing errors if writeError is set
    } catch (error: any) {
      console.error("Error sending payout:", error);
      toast.error(error?.message || "Failed to send payout");
    }
  };

  const handleReset = () => {
    setStep("details");
    setTransactionHash(null);
  };

  if (step === "success") {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Card className="p-12 border-slate-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-slate-900 mb-4">Payout Sent Successfully!</h2>
          <p className="text-slate-600 mb-8">
            Your payout of {currency === "USDC" ? "$" : "€"}
            {amount} has been processed and settled on-chain.
          </p>

          <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Transaction Hash</span>
                <span className="text-slate-900 font-mono text-sm">
                  {transactionHash
                    ? `${transactionHash.slice(0, 6)}...${transactionHash.slice(-4)}`
                    : "Pending..."}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Settlement Time</span>
                <span className="text-slate-900">0.8 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Gas Fee</span>
                <span className="text-slate-900">$0.05 USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status</span>
                <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isPending || isConfirming}
          >
            Send Another Payout
          </Button>
        </Card>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Review Payout</h1>
          <p className="text-slate-600">Please confirm the details before sending</p>
        </div>

        <Card className="p-6 border-slate-200 mb-6">
          <h3 className="text-slate-900 mb-4">Payout Details</h3>

          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Wallet Address</span>
              <span className="text-slate-900 font-mono text-sm">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Amount</span>
              <span className="text-slate-900">
                {currency === "USDC" ? "$" : "€"}
                {parseFloat(amount).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Currency</span>
              <span className="text-slate-900">{currency}</span>
            </div>

            {memo && (
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="text-slate-600">Memo</span>
                <span className="text-slate-900">{memo}</span>
              </div>
            )}

            <div className="flex justify-between py-3">
              <span className="text-slate-600">Total Cost</span>
              <span className="text-xl text-slate-900">
                {currency === "USDC" ? "$" : "€"}
                {(parseFloat(amount) + 0.05).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              This transaction will settle on-chain in under 1 second.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setStep("details")}
            className="flex-1 hover:bg-slate-50"
            disabled={isPending || isConfirming}
          >
            Back to Edit
          </Button>

          <Button
            onClick={handleSend}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isPending || isConfirming}
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isPending ? "Confirming..." : "Processing..."}
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Confirm & Send
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Send Payout</h1>
        <p className="text-slate-600">Send instant cross-border payments with stablecoins</p>
      </div>

      <Card className="p-6 border-slate-200 mb-6">
        <div className="space-y-6">
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label>Wallet Address *</Label>
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono"
            />
            {walletAddress && !isValidAddress(walletAddress) && (
              <p className="text-sm text-red-600">Please enter a valid wallet address</p>
            )}
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <Label>Currency *</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount *</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label>Memo</Label>
            <Textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Add a note..."
            />
          </div>
        </div>
      </Card>

      <Button
        onClick={handleReview}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        size="lg"
      >
        <Send className="w-4 h-4 mr-2" />
        Continue to Review
      </Button>
    </div>
  );
}
