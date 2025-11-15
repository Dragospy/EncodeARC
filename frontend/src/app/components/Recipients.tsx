import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Search,
  Plus,
  MoreVertical,
  Mail,
  MapPin,
  Wallet,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const mockRecipients = [
  {
    id: "1",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    country: "Philippines",
    wallet: "0x742d35f8b3e9a1c2d5f7e8b4a6c9d2e5f8a1b3c4",
    verified: true,
    totalPaid: 45200,
    transactions: 18,
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.wilson@email.com",
    country: "United Kingdom",
    wallet: "0x8a3c2d1b9f7e5c4a3b2d1e9f8c7a6b5d4e3f2a1",
    verified: true,
    totalPaid: 32500,
    transactions: 12,
  },
  {
    id: "3",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    country: "India",
    wallet: "0x5f9e7c4a3b2d1e9f8c7a6b5d4e3f2a1b9c8d7e6",
    verified: true,
    totalPaid: 28900,
    transactions: 15,
  },
  {
    id: "4",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@email.com",
    country: "Mexico",
    wallet: "0x1b2a9e6f8d3c7a5b4e2f1d9c8a7b6e5f4d3c2b1",
    verified: false,
    totalPaid: 15600,
    transactions: 8,
  },
  {
    id: "5",
    name: "Ana Silva",
    email: "ana.silva@email.com",
    country: "Brazil",
    wallet: "0x2b3c4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a2b3",
    verified: true,
    totalPaid: 21800,
    transactions: 10,
  },
];

export function Recipients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    email: "",
    country: "",
    wallet: "",
  });

  const filteredRecipients = mockRecipients.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecipient = () => {
    if (!newRecipient.name || !newRecipient.email || !newRecipient.wallet) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Recipient added successfully");
    setAddOpen(false);
    setNewRecipient({ name: "", email: "", country: "", wallet: "" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Recipients</h1>
          <p className="text-slate-600">
            Manage your payout recipients and their verification status
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-blue-900 text-white">
            <DialogHeader>
              <DialogTitle>Add New Recipient</DialogTitle>
              <DialogDescription>Add a new recipient to send payouts to</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input className="text-black"
                  id="name"
                  placeholder="John Doe"
                  value={newRecipient.name}
                  onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input className="text-black"
                  id="email"
                  type="email"
                  placeholder="john@email.com"
                  value={newRecipient.email}
                  onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input className="text-black"
                  id="country"
                  placeholder="United States"
                  value={newRecipient.country}
                  onChange={(e) => setNewRecipient({ ...newRecipient, country: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address *</Label>
                <Input className="text-black"
                  id="wallet"
                  placeholder="0x..."
                  value={newRecipient.wallet}
                  onChange={(e) => setNewRecipient({ ...newRecipient, wallet: e.target.value })}
                />
              </div>
              <Button onClick={handleAddRecipient} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Recipient
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Recipients</div>
          <div className="text-2xl text-slate-900">{mockRecipients.length}</div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Verified</div>
          <div className="text-2xl text-slate-900">
            {mockRecipients.filter((r) => r.verified).length}
          </div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Paid Out</div>
          <div className="text-2xl text-slate-900">
            ${mockRecipients.reduce((sum, r) => sum + r.totalPaid, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Avg. per Recipient</div>
          <div className="text-2xl text-slate-900">
            $
            {Math.round(
              mockRecipients.reduce((sum, r) => sum + r.totalPaid, 0) / mockRecipients.length
            ).toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border-slate-200 hover:bg-slate-50 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search recipients by name, email, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Recipients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipients.map((recipient) => (
          <Card
            key={recipient.id}
            className="p-6 border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                {recipient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex items-center gap-2">
                {recipient.verified ? (
                  <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    Pending
                  </div>
                )}
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-slate-900 mb-1">{recipient.name}</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{recipient.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{recipient.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Wallet className="w-4 h-4" />
                  <span className="truncate">
                    {recipient.wallet.slice(0, 10)}...{recipient.wallet.slice(-8)}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 hover:bg-slate-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Total Paid</div>
                  <div className="text-slate-900">${recipient.totalPaid.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Transactions</div>
                  <div className="text-slate-900">{recipient.transactions}</div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md" size="sm">
                Send Payout
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
