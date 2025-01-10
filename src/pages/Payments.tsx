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
import { PaymentFilters, type PaymentFilters as PaymentFiltersType } from "@/components/payment/PaymentFilters";

// Dummy data
const dummyTenants: Tenant[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    emergencyContact: "9876543210",
    joinDate: "2024-01-01",
    leaseEnd: "2024-12-31",
    roomNumber: "101"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "2345678901",
    emergencyContact: "8765432109",
    joinDate: "2024-01-15",
    leaseEnd: "2024-12-31",
    roomNumber: "102"
  }
];

const dummyPayments: Payment[] = [
  {
    id: "1",
    tenantId: "1",
    amount: 15000,
    date: "2024-01-05",
    status: "paid",
    paymentMethod: "upi",
    notes: "January Rent"
  },
  {
    id: "2",
    tenantId: "2",
    amount: 15000,
    date: "2024-01-15",
    status: "pending",
    paymentMethod: "bank_transfer",
    notes: "January Rent"
  }
];

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>(dummyPayments);
  const [tenants] = useState<Tenant[]>(dummyTenants);
  const [filters, setFilters] = useState<PaymentFiltersType>({
    month: "",
    status: "",
    search: "",
  });

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
    const paymentDate = new Date(payment.date);
    
    // Filter by month
    const monthMatch = !filters.month || paymentDate.getMonth() === Number(filters.month);
    
    // Filter by status
    const statusMatch = !filters.status || payment.status === filters.status;
    
    // Filter by search (tenant name or room number)
    const searchTerm = filters.search.toLowerCase();
    const searchMatch = !searchTerm || 
      tenant?.name.toLowerCase().includes(searchTerm) ||
      tenant?.roomNumber?.toLowerCase().includes(searchTerm);

    return monthMatch && statusMatch && searchMatch;
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
      
      <PaymentFilters onFilterChange={setFilters} />

      <PaymentsList payments={filteredPayments} tenants={tenants} />
    </div>
  );
};

export default Payments;