// WalletBalances.tsx
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowUpRight, ArrowDownRight, Send } from 'lucide-react';

export function WalletBalances({ onNavigate }: { onNavigate: (view: string) => void }) {
  const wallets = [
    { currency: 'USDC', balance: 125430.50, symbol: '$', change: '+2.4%', trend: 'up' },
    { currency: 'EURC', balance: 89250.75, symbol: '€', change: '+1.8%', trend: 'up' },
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
          onClick={() => onNavigate('wallets')}
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
                  {wallet.symbol}{wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div
                className={`flex items-center gap-1 text-sm ${
                  wallet.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {wallet.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span>{wallet.change}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => onNavigate('send-payout')}
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
