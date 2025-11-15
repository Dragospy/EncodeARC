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

const mockWallets = [
  {
    id: "1",
    currency: "USDC",
    balance: 125430.5,
    symbol: "$",
    change: "+2.4%",
    trend: "up" as const,
    icon: DollarSign,
    color: "blue",
  },
];

const mockTransactions = [
  {
    id: "1",
    type: "sent",
    amount: 2500,
    currency: "USDC",
    date: "2024-11-14",
    recipient: "Maria Garcia",
  },
  {
    id: "2",
    type: "received",
    amount: 5000,
    currency: "USDC",
    date: "2024-11-13",
    recipient: "Deposit",
  },
  {
    id: "3",
    type: "sent",
    amount: 1850,
    currency: "EURC",
    date: "2024-11-13",
    recipient: "James Wilson",
  },
  {
    id: "4",
    type: "converted",
    amount: 3000,
    currency: "USDC",
    date: "2024-11-12",
    recipient: "EURC Conversion",
  },
];

export function Wallets() {
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
        {mockWallets.map((wallet) => {
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
                  {wallet.symbol}
                  {wallet.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
          {mockTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "sent"
                      ? "bg-red-100"
                      : tx.type === "received"
                        ? "bg-green-100"
                        : "bg-blue-100"
                  }`}
                >
                  {tx.type === "sent" ? (
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  ) : tx.type === "received" ? (
                    <ArrowDownRight className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="text-slate-900 mb-1">{tx.recipient}</div>
                  <div className="text-sm text-slate-600">{tx.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-slate-900 mb-1 ${tx.type === "sent" ? "" : ""}`}>
                  {tx.type === "sent" ? "-" : "+"}
                  {tx.currency === "USDC" ? "$" : "€"}
                  {tx.amount.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">{tx.currency}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
