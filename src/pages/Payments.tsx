import { useState } from "react";
import Layout from "@/components/Layout";
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

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants] = useState<Tenant[]>([]); // In a real app, this would be fetched from your backend

  const summary: PaymentSummary = {
    totalPaid: payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
    totalOverdue: payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0),
  };

  const handleAddPayment = (payment: Payment) => {
    setPayments([...payments, payment]);
  };

  return (
    <Layout>
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
        <PaymentsList payments={payments} tenants={tenants} />
      </div>
    </Layout>
  );
};

export default Payments;