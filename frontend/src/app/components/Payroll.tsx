import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { SendPayout } from "./SendPayout";

interface Employee {
  id: string;
  name: string;
  salary: number;
  walletId: string;
}

export function Payroll() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Example employee payroll data
  const employees = [
    { id: "emp_1", name: "John Carter", salary: 4200, walletId: "wallet_john" },
    { id: "emp_2", name: "Sarah Ahmed", salary: 3800, walletId: "wallet_sarah" },
    { id: "emp_3", name: "Daniel Park", salary: 4500, walletId: "wallet_daniel" },
  ];

  // If user selects an employee, switch to SendPayout screen
  if (selectedEmployee) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setSelectedEmployee(null)}
          className="mb-4"
        >
          ← Back to Payroll
        </Button>

        <SendPayout
          defaults={{
            recipientId: selectedEmployee.id,
            amount: selectedEmployee.salary.toString(),
            memo: `Payroll payment for ${selectedEmployee.name}`,
            currency: "USDC",
          }}
        />
      </div>
    );
  }

  // Payroll list view
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-slate-900 mb-6">Payroll</h2>

      <div className="space-y-4">
        {employees.map((emp) => (
          <Card
            key={emp.id}
            className="p-4 flex items-center justify-between border border-slate-200"
          >
            <div>
              <div className="text-slate-900 font-medium">{emp.name}</div>
              <div className="text-slate-600 text-sm">
                Salary: ${emp.salary.toLocaleString()}
              </div>
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setSelectedEmployee(emp)}
            >
              Pay
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
