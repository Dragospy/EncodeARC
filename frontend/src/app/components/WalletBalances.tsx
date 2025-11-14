import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowRightLeft, Plus } from 'lucide-react';

export function WalletBalances() {
  const wallets = [
    {
      currency: 'USDC',
      balance: '125,480.50',
      usdValue: '125,480.50',
      change: '+2.3%',
      color: 'from-blue-500 to-blue-600',
    },
    {
      currency: 'EURC',
      balance: '84,320.00',
      usdValue: '92,156.80',
      change: '+1.8%',
      color: 'from-purple-500 to-purple-600',
    },
    {
      currency: 'USDC (Arc)',
      balance: '45,200.00',
      usdValue: '45,200.00',
      change: '+5.2%',
      color: 'from-green-500 to-green-600',
    },
  ];

  const totalUSD = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.usdValue.replace(',', '')), 0);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-gray-900">Multi-Currency Wallets</h2>
          <p className="text-sm text-gray-600">Total balance: ${totalUSD.toLocaleString()}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Convert
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((wallet, index) => (
          <Card key={index} className="p-6 bg-gradient-to-br text-white" style={{
            background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
            backgroundImage: `linear-gradient(to bottom right, ${wallet.color.includes('blue') ? '#3b82f6, #2563eb' : wallet.color.includes('purple') ? '#a855f7, #9333ea' : '#10b981, #059669'})`
          }}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg">{wallet.currency[0]}</span>
              </div>
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {wallet.change}
              </span>
            </div>
            <p className="text-sm opacity-90 mb-1">{wallet.currency}</p>
            <p className="mb-1">{wallet.balance}</p>
            <p className="text-sm opacity-75">≈ ${wallet.usdValue} USD</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
