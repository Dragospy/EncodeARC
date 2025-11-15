import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Send, Search, CheckCircle2, AlertCircle } from "lucide-react";

const mockRecipients = [
  { id: "1", name: "Maria Garcia", country: "Philippines", wallet: "0x742d...8f3e" },
  { id: "2", name: "James Wilson", country: "United Kingdom", wallet: "0x8a3c...2d1b" },
  { id: "3", name: "Priya Sharma", country: "India", wallet: "0x5f9e...7c4a" },
  { id: "4", name: "Carlos Rodriguez", country: "Mexico", wallet: "0x1b2a...9e6f" },
];

export function SendPayout() {
  const [step, setStep] = useState<"details" | "review" | "success">("details");
  const [recipient, setRecipient] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipients = mockRecipients.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRecipient = mockRecipients.find((r) => r.id === recipient);

  const handleReview = () => {
    if (!recipient || !amount) {
      toast.error("Please fill in all required fields");
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
    setRecipient("");
    setAmount("");
    setMemo("");
    setSearchTerm("");
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
            {amount} to {selectedRecipient?.name} has been processed and settled on-chain.
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

          <div className="flex gap-3">
            <Button onClick={handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Send Another Payout
            </Button>
            <Button variant="outline" className="flex-1">
              View Transaction
            </Button>
          </div>
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
              <span className="text-slate-600">Recipient</span>
              <div className="text-right">
                <div className="text-slate-900">{selectedRecipient?.name}</div>
                <div className="text-sm text-slate-600">{selectedRecipient?.country}</div>
              </div>
            </div>

            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Wallet Address</span>
              <span className="text-slate-900">{selectedRecipient?.wallet}</span>
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

            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Gas Fee</span>
              <span className="text-slate-900">$0.05 USDC</span>
            </div>

            {memo && (
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="text-slate-600">Memo</span>
                <span className="text-slate-900">{memo}</span>
              </div>
            )}

            <div className="flex justify-between py-3">
              <span className="text-slate-600">Total Amount</span>
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
              <div className="mb-1">Settlement Time: &lt; 1 second</div>
              <div>
                This transaction will be processed on the Circle Payment Network with on-chain
                verification.
              </div>
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
          {/* Recipient Selection */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient *</Label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={recipient} onValueChange={setRecipient}>
              <SelectTrigger id="recipient">
                <SelectValue placeholder="Select a recipient" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {filteredRecipients.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{r.name}</span>
                      <span className="text-sm text-slate-500 ml-4">{r.country}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="USDC">USDC (US Dollar Coin)</SelectItem>
                <SelectItem value="EURC">EURC (Euro Coin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                {currency === "USDC" ? "$" : "€"}
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Memo */}
          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Textarea
              id="memo"
              placeholder="Add a note for this transaction..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Transaction Summary */}
      <Card className="p-6 border-slate-200 mb-6 bg-slate-50">
        <h3 className="text-slate-900 mb-4">Transaction Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Payout Amount</span>
            <span className="text-slate-900">
              {amount
                ? `${currency === "USDC" ? "$" : "€"}${parseFloat(amount).toLocaleString()}`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Gas Fee (paid in USDC)</span>
            <span className="text-slate-900">$0.05</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Settlement Time</span>
            <span className="text-slate-900">&lt; 1 second</span>
          </div>
          <div className="border-t border-slate-300 pt-3 flex justify-between">
            <span className="text-slate-900">Total</span>
            <span className="text-slate-900">
              {amount
                ? `${currency === "USDC" ? "$" : "€"}${(parseFloat(amount) + 0.05).toLocaleString()}`
                : "-"}
            </span>
          </div>
        </div>
      </Card>

      <Button onClick={handleReview} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
        <Send className="w-4 h-4 mr-2" />
        Continue to Review
      </Button>
    </div>
  );
}
