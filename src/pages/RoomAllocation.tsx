import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoomAllocationForm } from "@/components/RoomAllocationForm";
import { RoomAllocation, Room, Tenant } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RoomAllocation = () => {
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAllocations();
    fetchRooms();
    fetchTenants();
  }, []);

  const fetchAllocations = async () => {
    const { data, error } = await supabase
      .from('room_allocations')
      .select('*');

    if (error) {
      console.error('Error fetching allocations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch allocations",
        variant: "destructive",
      });
      return;
    }

    setAllocations(data);
  };

  const fetchRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');

    if (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch rooms",
        variant: "destructive",
      });
      return;
    }

    setRooms(data);
  };

  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('*');

    if (error) {
      console.error('Error fetching tenants:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tenants",
        variant: "destructive",
      });
      return;
    }

    setTenants(data);
  };

  const handleAllocation = async (allocation: Omit<RoomAllocation, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('room_allocations')
        .insert({
          room_id: allocation.room_id,
          tenant_id: allocation.tenant_id,
          start_date: allocation.start_date,
          duration: allocation.duration,
          status: allocation.status
        })
        .select()
        .single();

      if (error) throw error;

      setAllocations([...allocations, data]);
      toast({
        title: "Success",
        description: "Room allocated successfully",
      });
    } catch (error) {
      console.error('Error allocating room:', error);
      toast({
        title: "Error",
        description: "Failed to allocate room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Room Allocation</h2>
          <p className="text-gray-600">Manage room assignments for tenants</p>
        </div>
        <Button onClick={() => navigate("/rooms")}>View All Rooms</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">New Allocation</h3>
          <RoomAllocationForm
            rooms={rooms}
            tenants={tenants}
            onSubmit={handleAllocation}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Allocations</h3>
          <div className="space-y-4">
            {allocations.map((allocation) => {
              const room = rooms.find((r) => r.id === allocation.room_id);
              const tenant = tenants.find((t) => t.id === allocation.tenant_id);

              return (
                <Card key={allocation.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{tenant?.name}</p>
                      <p className="text-sm text-gray-600">
                        Room: {room?.number} ({room?.building} - Floor {room?.floor})
                      </p>
                      <p className="text-sm text-gray-600">
                        Start Date: {new Date(allocation.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {allocation.status}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">
                        Duration: {allocation.duration} months
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RoomAllocation;
