import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TenantTable } from "@/components/tenant/TenantTable";
import { TenantFilters } from "@/components/tenant/TenantFilters";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenant, fetchTenants } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";

const Tenants = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    roomType: "all",
  });

  const { data: tenants = [], isLoading, error } = useQuery({
    queryKey: ["tenants"],
    queryFn: async () => {
      const data = await fetchTenants();
      return data.map(tenant => ({
        ...tenant,
        preferences: typeof tenant.preferences === 'string' 
          ? JSON.parse(tenant.preferences)
          : tenant.preferences
      })) as Tenant[];
    }
  });

  const deleteTenantMutation = useMutation({
    mutationFn: deleteTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      toast({
        title: "Success",
        description: "Tenant deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete tenant. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting tenant:", error);
    },
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    deleteTenantMutation.mutate(tenant.id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading tenants. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenants</h2>
        <Button onClick={() => navigate("/tenants/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Tenant
        </Button>
      </div>

      <TenantFilters onFilterChange={handleFilterChange} />
      <TenantTable 
        tenants={tenants} 
        onDelete={handleDeleteTenant}
      />
    </div>
  );
};

export default Tenants;