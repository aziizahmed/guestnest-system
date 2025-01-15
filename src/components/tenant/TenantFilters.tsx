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

interface TenantFiltersProps {
  onFilterChange: (filters: TenantFilters) => void;
}

export interface TenantFilters {
  status: string;
  search: string;
  roomType: string;
}

export function TenantFilters({ onFilterChange }: TenantFiltersProps) {
  // Fetch unique room types
  const { data: roomTypes = [] } = useQuery({
    queryKey: ['room-types'],
    queryFn: async () => {
      console.log('Fetching unique room types...');
      const { data, error } = await supabase
        .from('rooms')
        .select('type')
        .eq('type', 'type') // This creates a GROUP BY
        .order('type');

      if (error) {
        console.error('Error fetching room types:', error);
        throw error;
      }

      console.log('Fetched room types:', data);
      return [...new Set(data.map(item => item.type))];
    },
  });

  const handleFilterChange = (key: keyof TenantFilters, value: string) => {
    onFilterChange({ status: "all", search: "", roomType: "all", [key]: value });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search by name, email, or room number..."
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="w-full"
        />
      </div>
      
      <Select
        defaultValue="all"
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tenant status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      <Select
        defaultValue="all"
        onValueChange={(value) => handleFilterChange("roomType", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Room type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {roomTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}