import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tenant } from "@/types";
import { User, Phone, Mail, AlertCircle, Calendar } from "lucide-react";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({ tenant }: TenantCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {tenant.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-4 w-4" />
          {tenant.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {tenant.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertCircle className="h-4 w-4" />
          {tenant.emergencyContact}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Join Date: {tenant.joinDate}
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium">Preferences</p>
          <p className="text-sm text-gray-600">Room Type: {tenant.preferences?.roomType}</p>
          <p className="text-sm text-gray-600">Max Rent: ₹{tenant.preferences?.maxRent}</p>
        </div>
      </CardContent>
    </Card>
  );
}