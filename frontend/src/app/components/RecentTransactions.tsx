import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export function RecentTransactions() {
  const transactions = [
    {
      id: 'TX-2024-001',
      recipient: 'Maria Garcia',
      amount: '1,250.00',
      currency: 'EURC',
      status: 'completed',
      time: '2 mins ago',
      country: 'Spain',
    },
    {
      id: 'TX-2024-002',
      recipient: 'John Smith',
      amount: '3,500.00',
      currency: 'USDC',
      status: 'completed',
      time: '15 mins ago',
      country: 'United States',
    },
    {
      id: 'TX-2024-003',
      recipient: 'Yuki Tanaka',
      amount: '2,800.00',
      currency: 'USDC',
      status: 'processing',
      time: '1 hour ago',
      country: 'Japan',
    },
    {
      id: 'TX-2024-004',
      recipient: 'Ahmed Hassan',
      amount: '1,100.00',
      currency: 'EURC',
      status: 'completed',
      time: '2 hours ago',
      country: 'UAE',
    },
    {
      id: 'TX-2024-005',
      recipient: 'Sarah Johnson',
      amount: '4,250.00',
      currency: 'USDC',
      status: 'completed',
      time: '3 hours ago',
      country: 'Canada',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-50 text-green-700 hover:bg-green-50">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-50">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-600">Latest payouts sent through GlobePay</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm text-gray-600">Transaction ID</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Recipient</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Amount</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm text-gray-600">Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(tx.status)}
                    <span className="text-sm text-gray-900">{tx.id}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-gray-900">{tx.recipient}</p>
                    <p className="text-xs text-gray-500">{tx.country}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <p className="text-sm text-gray-900">{tx.amount} {tx.currency}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {getStatusBadge(tx.status)}
                </td>
                <td className="py-4 px-4">
                  <p className="text-sm text-gray-600">{tx.time}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
