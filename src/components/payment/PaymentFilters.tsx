import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface PaymentFiltersProps {
  onFilterChange: (filters: PaymentFilters) => void;
}

export interface PaymentFilters {
  month: string;
  status: string;
  search: string;
}

export function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [filters, setFilters] = useState<PaymentFilters>({
    month: "all",
    status: "all",
    search: "",
  });

  // Fetch unique payment statuses
  const { data: paymentStatuses = [] } = useQuery({
    queryKey: ['payment-statuses'],
    queryFn: async () => {
      console.log('Fetching unique payment statuses...');
      const { data, error } = await supabase
        .from('payments')
        .select('status')
        .eq('status', 'status') // This creates a GROUP BY
        .order('status');

      if (error) {
        console.error('Error fetching payment statuses:', error);
        throw error;
      }

      console.log('Fetched payment statuses:', data);
      return [...new Set(data.map(item => item.status))];
    },
  });

  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentMonth = new Date().getMonth();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search by tenant name or room number..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full"
        />
      </div>
      
      <Select
        value={filters.month}
        onValueChange={(value) => handleFilterChange("month", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Months</SelectItem>
          {months.map((month, index) => (
            <SelectItem 
              key={month} 
              value={String(index)}
              className={index === currentMonth ? "font-bold" : ""}
            >
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Payment status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          {paymentStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}