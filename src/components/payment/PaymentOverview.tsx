import { Card } from "@/components/ui/card";
import { PaymentSummary } from "@/types";
import { IndianRupee } from "lucide-react";

interface PaymentOverviewProps {
  summary: PaymentSummary;
}

export function PaymentOverview({ summary }: PaymentOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-full">
            <IndianRupee className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Paid</p>
            <p className="text-2xl font-bold">₹{summary.totalPaid}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-yellow-100 rounded-full">
            <IndianRupee className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Payments</p>
            <p className="text-2xl font-bold">₹{summary.totalPending}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-red-100 rounded-full">
            <IndianRupee className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Overdue Amount</p>
            <p className="text-2xl font-bold">₹{summary.totalOverdue}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}