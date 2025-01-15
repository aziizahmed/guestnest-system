import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filters, setFilters] = useState<PaymentFiltersType>({
    month: "all",
    status: "all",
    search: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPayments();
    fetchTenants();
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
      return;
    }

    setPayments(data.map(payment => ({
      ...payment,
      status: payment.status as Payment['status']
    })));
  };

  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select(`
        *,
        room:rooms(
          number,
          building,
          floor
        )
      `);

    if (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenants",
        variant: "destructive",
      });
      return;
    }

    setTenants(data.map(tenant => ({
      ...tenant,
      preferences: typeof tenant.preferences === 'string' 
        ? JSON.parse(tenant.preferences)
        : tenant.preferences
    })));
  };

  const handleAddPayment = async (payment: Omit<Payment, 'id'>) => {
    const { data, error } = await supabase
      .from('payments')
      .insert(payment)
      .select()
      .single();

    if (error) {
      console.error('Error adding payment:', error);
      toast({
        title: "Error",
        description: "Failed to add payment",
        variant: "destructive",
      });
      return;
    }

    setPayments([data, ...payments]);
    toast({
      title: "Success",
      description: "Payment added successfully",
    });
  };

  const summary: PaymentSummary = {
    totalPaid: payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0),
    totalPending: payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0),
    totalOverdue: payments.filter(p => p.status === 'overdue').reduce((acc, p) => acc + p.amount, 0),
  };

  const filteredPayments = payments.filter(payment => {
    const tenant = tenants.find(t => t.id === payment.tenant_id);
    const paymentDate = new Date(payment.date);
    
    const monthMatch = filters.month === "all" || paymentDate.getMonth() === Number(filters.month);
    const statusMatch = filters.status === "all" || payment.status === filters.status;
    
    const searchTerm = filters.search.toLowerCase();
    const searchMatch = !searchTerm || 
      tenant?.name.toLowerCase().includes(searchTerm) ||
      tenant?.room?.number.toLowerCase().includes(searchTerm);

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
