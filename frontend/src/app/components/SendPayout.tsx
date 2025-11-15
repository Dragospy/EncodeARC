import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

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

  const [walletAddress, setWalletAddress] = useState(defaults?.walletAddress || "");
  const [amount, setAmount] = useState(defaults?.amount || "");
  const [currency, setCurrency] = useState(defaults?.currency || "USDC");
  const [memo, setMemo] = useState(defaults?.memo || "");

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

  const handleSend = () => {
    setStep("success");
    toast.success("Payout sent successfully!");
  };

  const handleReset = () => {
    setStep("details");
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
                <span className="text-slate-600">Transaction ID</span>
                <span className="text-slate-900">TX-{Date.now().toString().slice(-8)}</span>
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

          <Button onClick={handleReset} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
          <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
            Back to Edit
          </Button>

          <Button onClick={handleSend} className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Confirm & Send
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
