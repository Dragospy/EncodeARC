import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Search, 
  Plus, 
  MoreVertical,
  Mail,
  MapPin,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Hash
} from 'lucide-react';
import { toast } from "sonner";

const mockEmployees = [
  {
    id: '1',
    name: 'Maria Garcia',
    email: 'maria.garcia@company.com',
    employeeId: 'EMP-001',
    department: 'Engineering',
    position: 'Senior Developer',
    country: 'Philippines',
    wallet: '0x742d35f8b3e9a1c2d5f7e8b4a6c9d2e5f8a1b3c4',
    verified: true,
    totalPaid: 45200,
    paymentsCount: 18,
    salary: 5000
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    employeeId: 'EMP-002',
    department: 'Design',
    position: 'Product Designer',
    country: 'United Kingdom',
    wallet: '0x8a3c2d1b9f7e5c4a3b2d1e9f8c7a6b5d4e3f2a1',
    verified: true,
    totalPaid: 32500,
    paymentsCount: 12,
    salary: 4200
  },
  {
    id: '3',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    employeeId: 'EMP-003',
    department: 'Marketing',
    position: 'Marketing Manager',
    country: 'India',
    wallet: '0x5f9e7c4a3b2d1e9f8c7a6b5d4e3f2a1b9c8d7e6',
    verified: true,
    totalPaid: 28900,
    paymentsCount: 15,
    salary: 3800
  },
  {
    id: '4',
    name: 'Carlos Rodriguez',
    email: 'carlos.rodriguez@company.com',
    employeeId: 'EMP-004',
    department: 'Sales',
    position: 'Sales Representative',
    country: 'Mexico',
    wallet: '0x1b2a9e6f8d3c7a5b4e2f1d9c8a7b6e5f4d3c2b1',
    verified: false,
    totalPaid: 15600,
    paymentsCount: 8,
    salary: 3200
  },
  {
    id: '5',
    name: 'Ana Silva',
    email: 'ana.silva@company.com',
    employeeId: 'EMP-005',
    department: 'Engineering',
    position: 'Frontend Developer',
    country: 'Brazil',
    wallet: '0x2b3c4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a2b3',
    verified: true,
    totalPaid: 21800,
    paymentsCount: 10,
    salary: 4500
  },
  {
    id: '6',
    name: 'Yuki Tanaka',
    email: 'yuki.tanaka@company.com',
    employeeId: 'EMP-006',
    department: 'Engineering',
    position: 'DevOps Engineer',
    country: 'Japan',
    wallet: '0x3c4d5e6f7a8b9c1d2e3f4a5b6c7d8e9f1a2b3c4',
    verified: true,
    totalPaid: 38400,
    paymentsCount: 14,
    salary: 4800
  },
];

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'HR'];

export function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    position: '',
    country: '',
    wallet: '',
    salary: ''
  });

  const filteredEmployees = mockEmployees.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || e.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.wallet || !newEmployee.employeeId) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Employee added successfully');
    setAddOpen(false);
    setNewEmployee({ 
      name: '', 
      email: '', 
      employeeId: '',
      department: '',
      position: '',
      country: '', 
      wallet: '',
      salary: ''
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Employees</h1>
          <p className="text-slate-600">Manage your workforce and payroll information</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to your payroll system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee-id">Employee ID *</Label>
                  <Input
                    id="employee-id"
                    placeholder="EMP-001"
                    value={newEmployee.employeeId}
                    onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={newEmployee.department} onValueChange={(val) => setNewEmployee({ ...newEmployee, department: val })}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    placeholder="Software Engineer"
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={newEmployee.country}
                    onChange={(e) => setNewEmployee({ ...newEmployee, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Monthly Salary (USDC)</Label>
                  <Input
                    id="salary"
                    type="number"
                    placeholder="5000"
                    value={newEmployee.salary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Wallet Address *</Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={newEmployee.wallet}
                  onChange={(e) => setNewEmployee({ ...newEmployee, wallet: e.target.value })}
                />
              </div>

              <Button onClick={handleAddEmployee} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Add Employee
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Employees</div>
          <div className="text-2xl text-slate-900">{mockEmployees.length}</div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Verified</div>
          <div className="text-2xl text-slate-900">
            {mockEmployees.filter(e => e.verified).length}
          </div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Total Paid Out</div>
          <div className="text-2xl text-slate-900">
            ${mockEmployees.reduce((sum, e) => sum + e.totalPaid, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="p-4 border-slate-200 hover:bg-slate-50">
          <div className="text-sm text-slate-600 mb-1">Monthly Payroll</div>
          <div className="text-2xl text-slate-900">
            ${mockEmployees.reduce((sum, e) => sum + e.salary, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 border-slate-200 hover:bg-slate-50 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, email, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="p-6 border-slate-200 hover:bg-slate-50 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex items-center gap-2">
                {employee.verified ? (
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
              <h3 className="text-slate-900 mb-1">{employee.name}</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Hash className="w-4 h-4" />
                  <span>{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{employee.position}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{employee.country}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Wallet className="w-4 h-4" />
                  <span className="truncate">{employee.wallet.slice(0, 10)}...{employee.wallet.slice(-8)}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-50">
              <div className="text-xs text-slate-600 mb-1">Department</div>
              <div className="text-sm text-slate-900">{employee.department}</div>
            </div>

            <div className="pt-4 border-t border-slate-200 hover:bg-slate-50">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-slate-600 mb-1">Salary</div>
                  <div className="text-slate-900">${employee.salary.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Total Paid</div>
                  <div className="text-slate-900">${employee.totalPaid.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 mb-1">Payments</div>
                  <div className="text-slate-900">{employee.paymentsCount}</div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                Pay Employee
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
