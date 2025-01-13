import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TenantTable } from "@/components/tenant/TenantTable";
import { TenantFilters, TenantFilters as TenantFiltersType } from "@/components/tenant/TenantFilters";
import { useNavigate } from "react-router-dom";
import { dummyTenants } from "@/data/dummyData";
import { useState } from "react";

const Tenants = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TenantFiltersType>({
    status: "all",
    search: "",
    roomType: "all",
  });

  const handleFilterChange = (newFilters: TenantFiltersType) => {
    setFilters(newFilters);
    console.log("Filters updated:", newFilters);
    // Here you would typically filter the tenants based on the new filters
    // For now, we're just logging the changes
  };

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
      <TenantTable tenants={dummyTenants} />
    </div>
  );
};

export default Tenants;