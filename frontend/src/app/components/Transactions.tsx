import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { formatDateTime } from "@/utils/dateUtils";
import { useUser } from "@/contexts/UserContext";

export function Transactions() {
  const { transactions, isLoading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTransactions = (transactions || []).filter((tx) => {
    const senderName = tx.sender_name || tx.wallet_sender?.slice(0, 6) + "..." || "Unknown";
    const recipientName =
      tx.recipient_name || tx.wallet_recipient?.slice(0, 6) + "..." || "Unknown";
    const displayName = tx.direction === "outgoing" ? recipientName : senderName;

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (tx.id ? String(tx.id).toLowerCase().includes(searchLower) : false) ||
      (tx.transaction_id ? String(tx.transaction_id).toLowerCase().includes(searchLower) : false) ||
      senderName.toLowerCase().includes(searchLower) ||
      recipientName.toLowerCase().includes(searchLower) ||
      displayName.toLowerCase().includes(searchLower);

    // Map direction to transaction type
    const txType = tx.direction === "outgoing" ? "payout" : "deposit";
    const matchesType = filterType === "all" || txType === filterType;

    // Assume all transactions are completed if no status field
    const txStatus = tx.status || "completed";
    const matchesStatus = filterStatus === "all" || txStatus === filterStatus;

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
          <div className="text-2xl text-slate-900">{transactions?.length || 0}</div>
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
      <Card className="p-6 border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by ID, sender, or recipient..."
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
            <SelectContent className="bg-white">
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
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className=" bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 text-sm text-slate-600">Transaction ID</th>
                <th className="text-left p-4 text-sm text-slate-600">Type</th>
                <th className="text-left p-4 text-sm text-slate-600">Sender</th>
                <th className="text-left p-4 text-sm text-slate-600">Recipient</th>
                <th className="text-left p-4 text-sm text-slate-600">Amount</th>
                <th className="text-left p-4 text-sm text-slate-600">Status</th>
                <th className="text-left p-4 text-sm text-slate-600">Date & Time</th>
                <th className="text-left p-4 text-sm text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-600">
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-600">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const txType = tx.direction === "outgoing" ? "payout" : "deposit";
                  const senderName =
                    tx.sender_name || tx.wallet_sender?.slice(0, 6) + "..." || "Unknown";
                  const recipientName =
                    tx.recipient_name || tx.wallet_recipient?.slice(0, 6) + "..." || "Unknown";
                  const txStatus = tx.status || "completed";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="text-slate-900">{tx.id ? String(tx.id) : "N/A"}</div>
                        {tx.transaction_id && (
                          <div className="text-xs text-slate-500">
                            {String(tx.transaction_id).slice(0, 20)}...
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {txType === "payout" ? (
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <ArrowUpRight className="w-4 h-4 text-red-600" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <ArrowDownRight className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          <span className="text-slate-900 capitalize">{txType}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-900">{senderName}</div>
                        <div className="text-xs text-slate-500">
                          {tx.wallet_sender?.slice(0, 10)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-slate-900">{recipientName}</div>
                        <div className="text-xs text-slate-500">
                          {tx.wallet_recipient?.slice(0, 10)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`text-slate-900 ${tx.direction === "outgoing" ? "" : "text-green-600"}`}
                        >
                          {tx.direction === "outgoing" ? "-" : "+"}${tx.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-600">USDC</div>
                      </td>
                      <td className="p-4">
                        {txStatus === "completed" ? (
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
                        <div className="text-slate-900">{formatDateTime(tx.created_at)}</div>
                      </td>
                      <td className="p-4">
                        {tx.transaction_id && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://etherscan.io/tx/${tx.transaction_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
