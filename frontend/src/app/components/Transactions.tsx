import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

const mockTransactions = [
  {
    id: 'TX-2024-001',
    type: 'payout',
    recipient: 'Maria Garcia',
    amount: 2500,
    currency: 'USDC',
    status: 'completed',
    date: '2024-11-14',
    time: '14:32:15',
    country: 'Philippines',
    txHash: '0x742d35f8b3e...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-002',
    type: 'deposit',
    recipient: 'Bank Transfer',
    amount: 50000,
    currency: 'USDC',
    status: 'completed',
    date: '2024-11-14',
    time: '09:15:42',
    country: 'United States',
    txHash: '0x8a3c2d1b9f7...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-003',
    type: 'payout',
    recipient: 'James Wilson',
    amount: 1850,
    currency: 'EURC',
    status: 'completed',
    date: '2024-11-13',
    time: '16:45:30',
    country: 'United Kingdom',
    txHash: '0x5f9e7c4a3b2...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-004',
    type: 'conversion',
    recipient: 'USDC → EURC',
    amount: 10000,
    currency: 'USDC',
    status: 'completed',
    date: '2024-11-13',
    time: '11:20:18',
    country: '-',
    txHash: '0x1b2a9e6f8d3...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-005',
    type: 'payout',
    recipient: 'Priya Sharma',
    amount: 3200,
    currency: 'USDC',
    status: 'processing',
    date: '2024-11-13',
    time: '08:10:55',
    country: 'India',
    txHash: '0x3c4e5f6a7b8...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-006',
    type: 'payout',
    recipient: 'Carlos Rodriguez',
    amount: 4100,
    currency: 'USDC',
    status: 'completed',
    date: '2024-11-12',
    time: '15:55:22',
    country: 'Mexico',
    txHash: '0x9d8e7f6c5a4...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-007',
    type: 'payout',
    recipient: 'Ana Silva',
    amount: 2750,
    currency: 'USDC',
    status: 'completed',
    date: '2024-11-12',
    time: '12:30:45',
    country: 'Brazil',
    txHash: '0x2b3c4d5e6f7...',
    gasPrice: 0.05
  },
  {
    id: 'TX-2024-008',
    type: 'deposit',
    recipient: 'Circle Transfer',
    amount: 25000,
    currency: 'EURC',
    status: 'completed',
    date: '2024-11-11',
    time: '10:15:33',
    country: 'European Union',
    txHash: '0x4e5f6a7b8c9...',
    gasPrice: 0.05
  },
];

export function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.country.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">Transactions</h1>
        <p className="text-slate-600">View and manage all your payment activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Volume (30d)</div>
          <div className="text-2xl text-slate-900">$214,680</div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Transactions</div>
          <div className="text-2xl text-slate-900">1,247</div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Avg. Settlement</div>
          <div className="text-2xl text-slate-900">0.8s</div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Gas Fees</div>
          <div className="text-2xl text-slate-900">$62.35</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-slate-200 hover:bg-slate-50 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by ID, recipient, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payout">Payout</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="conversion">Conversion</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="border-slate-200 hover:bg-slate-50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm text-slate-600">Transaction ID</th>
                <th className="text-left p-4 text-sm text-slate-600">Type</th>
                <th className="text-left p-4 text-sm text-slate-600">Recipient</th>
                <th className="text-left p-4 text-sm text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm text-slate-600">Status</th>
                <th className="text-left p-4 text-sm text-slate-600">Date & Time</th>
                <th className="text-left p-4 text-sm text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 hover:bg-slate-50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="text-slate-900">{tx.id}</div>
                    <div className="text-xs text-slate-500">{tx.txHash}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {tx.type === 'payout' ? (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-red-600" />
                        </div>
                      ) : tx.type === 'deposit' ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <ArrowDownRight className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <span className="text-slate-900 capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-900">{tx.recipient}</div>
                    <div className="text-sm text-slate-600">{tx.country}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-900">
                      {tx.type === 'payout' ? '-' : tx.type === 'deposit' ? '+' : ''}
                      {tx.currency === 'USDC' ? '$' : '€'}
                      {tx.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600">{tx.currency}</div>
                  </td>
                  <td className="p-4">
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
                  </td>
                  <td className="p-4">
                    <div className="text-slate-900">{tx.date}</div>
                    <div className="text-sm text-slate-600">{tx.time}</div>
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
