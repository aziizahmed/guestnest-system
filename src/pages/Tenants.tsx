import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tenant } from "@/types";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TenantTable } from "@/components/tenant/TenantTable";
import { TenantFilters, TenantFilters as TenantFiltersType } from "@/components/tenant/TenantFilters";
import { AddTenantForm } from "@/components/tenant/AddTenantForm";

const Tenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [filters, setFilters] = useState<TenantFiltersType>({
    status: "all",
    search: "",
    roomType: "all",
  });
  const { toast } = useToast();

  const handleAddTenant = (data: Tenant) => {
    setTenants([...tenants, data]);
    toast({
      title: "Success",
      description: "Tenant added successfully",
    });
  };

  const handleEditTenant = (tenant: Tenant) => {
    // Implement edit functionality
    console.log("Edit tenant:", tenant);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    // Implement delete functionality
    console.log("Delete tenant:", tenant);
  };

  const filteredTenants = tenants.filter((tenant) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = 
      tenant.name.toLowerCase().includes(searchTerm) ||
      tenant.email.toLowerCase().includes(searchTerm) ||
      (tenant.roomNumber?.toLowerCase().includes(searchTerm) ?? false);

    const matchesStatus = 
      filters.status === "all" || 
      (filters.status === "active" && tenant.leaseEnd) ||
      (filters.status === "pending" && !tenant.leaseEnd);

    const matchesRoomType =
      filters.roomType === "all" ||
      tenant.preferences?.roomType === filters.roomType;

    return matchesSearch && matchesStatus && matchesRoomType;
  });

  // Stats for the pie chart
  const tenantStats = [
    { name: 'Active', value: tenants.filter(t => t.leaseEnd).length || 0, color: '#4CAF50' },
    { name: 'Pending', value: tenants.filter(t => !t.leaseEnd).length || 0, color: '#FFC107' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tenants Overview</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tenant</DialogTitle>
            </DialogHeader>
            <AddTenantForm onSubmit={handleAddTenant} rooms={[]} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Tenants</h3>
          <p className="text-3xl font-bold mt-2">{tenants.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Active Tenants</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {tenants.filter(t => t.leaseEnd).length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Pending Requests</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {tenants.filter(t => !t.leaseEnd).length}
          </p>
        </Card>
      </div>

      {/* Tenant Distribution Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Tenant Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tenantStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {tenantStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Filters and Table */}
      <div className="space-y-4">
        <TenantFilters onFilterChange={setFilters} />
        <TenantTable 
          tenants={filteredTenants}
          onEdit={handleEditTenant}
          onDelete={handleDeleteTenant}
        />
      </div>
    </div>
  );
};

export default Tenants;