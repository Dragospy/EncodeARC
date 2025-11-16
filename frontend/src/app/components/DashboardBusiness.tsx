import { BusinessNavigationView, PersonNavigationView } from "../page";
import { WalletBalances } from "./WalletBalances";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  Globe,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { formatUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { useMainContractRead } from "@/hooks/useMainContract";
import { formatDateTime } from "@/utils/dateUtils";

interface DashboardProps {
  onNavigate: (view: BusinessNavigationView) => void;
}

const mockRecentTransactions = [
  {
    id: "TX001",
    recipient: "Maria Garcia",
    amount: 2500,
    currency: "USDC",
    status: "completed",
    time: "2 mins ago",
    country: "Philippines",
  },
  {
    id: "TX002",
    recipient: "James Wilson",
    amount: 1850,
    currency: "EURC",
    status: "completed",
    time: "15 mins ago",
    country: "United Kingdom",
  },
  {
    id: "TX003",
    recipient: "Priya Sharma",
    amount: 3200,
    currency: "USDC",
    status: "processing",
    time: "1 hour ago",
    country: "India",
  },
  {
    id: "TX004",
    recipient: "Carlos Rodriguez",
    amount: 4100,
    currency: "USDC",
    status: "completed",
    time: "3 hours ago",
    country: "Mexico",
  },
];

export function DashboardBusiness({ onNavigate }: DashboardProps) {
  const { user, isLoading, error, refetch, walletId, transactions } = useUser();
  const { isConnected, address } = useAccount();
  const { useUSDC } = useMainContractRead();
  const { data: usdcAddress } = useUSDC();

  // Get USDC balance (ERC20 token with 6 decimals)
  const { data: usdcBalanceData } = useBalance({
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

  // Count successful transfers (completed transactions or all transactions if no status field)
  const successfulTransfersCount =
    transactions?.filter((tx) => !tx.status || tx.status === "completed").length || 0;

  const mockWallets = [
    { currency: "USDC", balance: usdcBalance, symbol: "$", change: "0%", trend: "flat" as const },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">
          Welcome back {!isLoading && user?.name ? user.name : "User"}! Here&apos;s your employee
          payroll overview.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-slate-200 hover:bg-slate-50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">
            ${user?.total_payouts?.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Total Payroll (30d)</div>
        </Card>

        <Card className="p-6 border-slate-200 hover:bg-slate-50">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">
            {successfulTransfersCount.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600">Payments Processed</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balances */}
        <div className="lg:col-span-2">
          <WalletBalances
            onNavigate={onNavigate as (view: BusinessNavigationView | PersonNavigationView) => void}
            sendAction="payroll"
          />
        </div>

        {/* Quick Actions */}
        <Card className="p-6 border-slate-200">
          <div className="mb-6">
            <h2 className="text-slate-900 mb-1">Quick Actions</h2>
            <p className="text-sm text-slate-600">Common tasks</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onNavigate("payroll")}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 h-auto py-4 text-white"
            >
              <Send className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Run Payroll</div>
                <div className="text-xs opacity-80">Pay employees instantly</div>
              </div>
            </Button>

            <Button
              onClick={() => onNavigate("employees")}
              variant="outline"
              className="w-full justify-start h-auto py-4 hover:bg-slate-200"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Manage Employees</div>
                <div className="text-xs text-slate-600">Add or edit employees</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mt-6 border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-slate-900 mb-1">Recent Transactions</h2>
              <p className="text-sm text-slate-600">Latest transactions</p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate("transactions")}
              className="hover:bg-slate-200 rounded:md"
            >
              View All
            </Button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {transactions?.slice(0, 5).map((tx) => {
            const displayName =
              tx.direction === "outgoing"
                ? tx.recipient_name || tx.wallet_recipient?.slice(0, 6) + "..." || "Unknown"
                : tx.sender_name || tx.wallet_sender?.slice(0, 6) + "..." || "Unknown";
            const initials = displayName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div key={tx.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {initials}
                    </div>
                    <div>
                      <div className="text-slate-900 mb-1">{displayName}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2">
                        <span>{formatDateTime(tx.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-slate-900 mb-1 ${tx.direction === "outgoing" ? "" : "text-green-600"}`}
                    >
                      {tx.direction === "outgoing" ? "-" : "+"}${tx.amount.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
