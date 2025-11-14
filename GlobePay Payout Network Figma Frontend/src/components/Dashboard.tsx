import { NavigationView } from '../App';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Users, 
  Globe,
  Send,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: NavigationView) => void;
}

const mockWallets = [
  { currency: 'USDC', balance: 125430.50, symbol: '$', change: '+2.4%', trend: 'up' },
  { currency: 'EURC', balance: 89250.75, symbol: '€', change: '+1.8%', trend: 'up' },
];

const mockRecentTransactions = [
  {
    id: 'TX001',
    recipient: 'Maria Garcia',
    amount: 2500,
    currency: 'USDC',
    status: 'completed',
    time: '2 mins ago',
    country: 'Philippines'
  },
  {
    id: 'TX002',
    recipient: 'James Wilson',
    amount: 1850,
    currency: 'EURC',
    status: 'completed',
    time: '15 mins ago',
    country: 'United Kingdom'
  },
  {
    id: 'TX003',
    recipient: 'Priya Sharma',
    amount: 3200,
    currency: 'USDC',
    status: 'processing',
    time: '1 hour ago',
    country: 'India'
  },
  {
    id: 'TX004',
    recipient: 'Carlos Rodriguez',
    amount: 4100,
    currency: 'USDC',
    status: 'completed',
    time: '3 hours ago',
    country: 'Mexico'
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your global payout overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>12.5%</span>
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">$214,680</div>
          <div className="text-sm text-slate-600">Total Payouts (30d)</div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>8.2%</span>
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">1,247</div>
          <div className="text-sm text-slate-600">Successful Transfers</div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>24</span>
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">348</div>
          <div className="text-sm text-slate-600">Active Recipients</div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-xs text-slate-500">
              <span>Last 30d</span>
            </div>
          </div>
          <div className="text-2xl text-slate-900 mb-1">42</div>
          <div className="text-sm text-slate-600">Countries Reached</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Balances */}
        <Card className="lg:col-span-2 p-6 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-slate-900 mb-1">Wallet Balances</h2>
              <p className="text-sm text-slate-600">Your stablecoin holdings</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('wallets')}
              className="text-sm"
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockWallets.map((wallet) => (
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
                  <div className={`flex items-center gap-1 text-sm ${
                    wallet.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1"
                  >
                    Convert
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-slate-200">
          <div className="mb-6">
            <h2 className="text-slate-900 mb-1">Quick Actions</h2>
            <p className="text-sm text-slate-600">Common tasks</p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => onNavigate('send-payout')}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700 h-auto py-4"
            >
              <Send className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Send Payout</div>
                <div className="text-xs opacity-80">Transfer funds globally</div>
              </div>
            </Button>

            <Button 
              onClick={() => onNavigate('recipients')}
              variant="outline"
              className="w-full justify-start h-auto py-4"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Add Recipient</div>
                <div className="text-xs text-slate-600">Manage recipients</div>
              </div>
            </Button>

            <Button 
              onClick={() => onNavigate('compliance')}
              variant="outline"
              className="w-full justify-start h-auto py-4"
            >
              <CheckCircle2 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div>Verify Credentials</div>
                <div className="text-xs text-slate-600">KYC/AML compliance</div>
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
              <p className="text-sm text-slate-600">Latest payout activity</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate('transactions')}
            >
              View All
            </Button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {mockRecentTransactions.map((tx) => (
            <div key={tx.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                    {tx.recipient.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-slate-900 mb-1">{tx.recipient}</div>
                    <div className="text-sm text-slate-600 flex items-center gap-2">
                      <span>{tx.country}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {tx.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-900 mb-1">
                    {tx.currency === 'USDC' ? '$' : '€'}{tx.amount.toLocaleString()}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {tx.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
