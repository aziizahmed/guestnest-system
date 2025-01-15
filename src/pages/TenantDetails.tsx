import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "@/types";

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          *,
          room:rooms(
            number,
            building,
            floor
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Tenant;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Tenant not found</h2>
        <Button onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
        <h2 className="text-2xl font-bold">{tenant.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{tenant.phone}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency Contact</p>
              <p>{tenant.emergency_contact}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lease Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Join Date: {new Date(tenant.join_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Lease End: {new Date(tenant.lease_end).toLocaleDateString()}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Room</p>
              <p>{tenant.room ? `${tenant.room.number} (${tenant.room.building} - Floor ${tenant.room.floor})` : 'Not assigned'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="space-y-2">
            <p>Room Type: {tenant.preferences.roomType}</p>
            <p>Max Rent: ₹{tenant.preferences.maxRent}</p>
            {tenant.preferences.floor && <p>Preferred Floor: {tenant.preferences.floor}</p>}
          </div>
        </Card>

        {tenant.room && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Current Room</h3>
            <div className="space-y-2">
              <p>Room Number: {tenant.room.number}</p>
              <p>Building: {tenant.room.building}</p>
              <p>Floor: {tenant.room.floor}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TenantDetails;