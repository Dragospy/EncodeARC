import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  Send,
  ArrowLeftRight,
  Plus,
  TrendingUp,
  DollarSign,
  Euro,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { useAccount, useBalance } from "wagmi";
import { useMainContractRead } from "@/hooks/useMainContract";
import { formatUnits } from "viem";
import { formatDateTime } from "@/utils/dateUtils";

export function Wallets() {
  const { transactions } = useUser();
  const { address } = useAccount();
  const { useUSDC } = useMainContractRead();
  const { data: usdcAddress } = useUSDC();

  // Get USDC balance (ERC20 token with 6 decimals)
  const { data: usdcBalanceData, isLoading: isBalanceLoading } = useBalance({
    address: address as `0x${string}`,
    token: usdcAddress as `0x${string}` | undefined,
    query: {
      enabled: !!address && !!usdcAddress,
    },
  });

  // Format USDC balance (6 decimals)
  const usdcBalance = usdcBalanceData?.value
    ? parseFloat(formatUnits(usdcBalanceData.value, 6))
    : 0;

  const wallets = [
    {
      id: "1",
      currency: "USDC",
      balance: usdcBalance,
      symbol: "$",
      change: "+2.4%",
      trend: "up" as const,
      icon: DollarSign,
      color: "blue",
    },
  ];

  const [convertOpen, setConvertOpen] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("USDC");
  const [toCurrency, setToCurrency] = useState("EURC");
  const [amount, setAmount] = useState("");

  const handleConvert = () => {
    toast.success("Conversion initiated successfully");
    setConvertOpen(false);
    setAmount("");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Wallets</h1>
        <p className="text-slate-600">Manage your multi-currency stablecoin balances</p>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wallets.map((wallet) => {
          const Icon = wallet.icon;
          return (
            <Card
              key={wallet.id}
              className="p-6 border-slate-200 bg-gradient-to-br from-white to-slate-50"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-14 h-14 bg-${wallet.color}-100 rounded-2xl flex items-center justify-center`}
                >
                  <Icon className={`w-7 h-7 text-${wallet.color}-600`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    wallet.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {wallet.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{wallet.change}</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="text-sm text-slate-600 mb-2">{wallet.currency} Balance</div>
                <div className="text-3xl text-slate-900">
                  {isBalanceLoading ? (
                    <span className="text-slate-400">Loading...</span>
                  ) : (
                    <>
                      {wallet.symbol}
                      {wallet.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" className="flex-1 hover:bg-slate-200 rounded-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-slate-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-200">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.direction === "outgoing"
                      ? "bg-red-100"
                      : tx.direction === "incoming"
                        ? "bg-green-100"
                        : "bg-blue-100"
                  }`}
                >
                  {tx.direction === "outgoing" ? (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  ) : tx.direction === "incoming" ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="text-slate-900 mb-1">{tx.recipient_name}</div>
                  <div className="text-sm text-slate-600">{formatDateTime(tx.created_at)}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-slate-900 mb-1 ${tx.direction === "outgoing" ? "" : ""}`}>
                  {tx.direction === "outgoing" ? "-" : "+"}
                  ${tx.amount.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">USDC</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
