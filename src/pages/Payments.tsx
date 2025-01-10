import { useState } from "react";
import { PaymentsList } from "@/components/payment/PaymentsList";
import { PaymentOverview } from "@/components/payment/PaymentOverview";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { Payment, PaymentSummary, Tenant } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy data
const dummyTenants: Tenant[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    emergencyContact: "9876543210",
    joinDate: "2024-01-01",
    leaseEnd: "2024-12-31"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "2345678901",
    emergencyContact: "8765432109",
    joinDate: "2024-01-15",
    leaseEnd: "2024-12-31"
  }
];

const dummyPayments: Payment[] = [
  {
    id: "1",
    tenantId: "1",
    amount: 15000,
    date: "2024-01-05",
    status: "paid",
    paymentMethod: "UPI",
    notes: "January Rent"
  },
  {
    id: "2",
    tenantId: "2",
    amount: 15000,
    date: "2024-01-15",
    status: "pending",
    paymentMethod: "Bank Transfer",
    notes: "January Rent"
  }
];

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>(dummyPayments);
  const [tenants] = useState<Tenant[]>(dummyTenants);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const summary: PaymentSummary = {
    totalPaid: payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
    totalOverdue: payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0),
  };

  const handleAddPayment = (payment: Payment) => {
    setPayments([...payments, payment]);
  };

  const filteredPayments = payments.filter(payment => {
    const tenant = tenants.find(t => t.id === payment.tenantId);
    const matchesStatus = statusFilter ? payment.status === statusFilter : true;
    const matchesSearch = searchTerm
      ? tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm) ||
        payment.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm onSubmit={handleAddPayment} tenants={tenants} />
          </DialogContent>
        </Dialog>
      </div>

      <PaymentOverview summary={summary} />

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by tenant, amount, or payment method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PaymentsList payments={filteredPayments} tenants={tenants} />
    </div>
  );
};

export default Payments;