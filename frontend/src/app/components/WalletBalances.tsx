// WalletBalances.tsx
import { BusinessNavigationView, PersonNavigationView } from "../page";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowUpRight, ArrowDownRight, Send } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useMainContractRead } from "@/hooks/useMainContract";
import { formatUnits } from "viem";

type NavigationView = BusinessNavigationView | PersonNavigationView;

export function WalletBalances({
  onNavigate,
  sendAction = "send-payout",
}: {
  onNavigate: (view: NavigationView) => void;
  sendAction?: NavigationView;
}) {
  const { address } = useAccount();
  const { useUSDC } = useMainContractRead();
  const { data: usdcAddress } = useUSDC();

  // Get native ETH balance (18 decimals)
  const { data: nativeBalanceData } = useBalance({
    address: address as `0x${string}` | undefined,
    query: {
      enabled: !!address,
    },
  });

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

  const wallets = [
    { currency: "USDC", balance: usdcBalance, symbol: "$"},
  ];

  return (
    <Card className="p-6 border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-slate-900 mb-1">Wallet Balances</h2>
          <p className="text-sm text-slate-600">Your stablecoin holdings</p>
        </div>

        <Button
          variant="outline"
          onClick={() => onNavigate("wallets")}
          className="text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          View All
        </Button>
      </div>

      {/* Wallet Cards */}
      <div className="space-y-4">
        {wallets.map((wallet) => (
          <div
            key={wallet.currency}
            className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm text-slate-600 mb-1">{wallet.currency}</div>
                <div className="text-2xl text-slate-900">
                  {wallet.symbol}
                  {wallet.balance.toLocaleString("en-US", {
                    minimumFractionDigits: wallet.currency === "ETH" ? 4 : 2,
                    maximumFractionDigits: wallet.currency === "ETH" ? 4 : 2,
                  })}
                  {wallet.currency === "ETH" ? " ETH" : ""}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onNavigate(sendAction)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-200"
              >
                Convert
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
