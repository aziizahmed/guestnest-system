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
import RoomAllocationForm from "@/components/RoomAllocationForm";
import { RoomAllocation } from "@/types";

const RoomAllocation = () => {
  const [allocations, setAllocations] = useState<RoomAllocation[]>([]);
  const { toast } = useToast();

  // Mock data - replace with actual data from your state management
  const availableRooms = [
    { id: "1", number: "101" },
    { id: "2", number: "102" },
  ];

  const availableTenants = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  const onSubmit = (data: Omit<RoomAllocation, "id" | "status">) => {
    const newAllocation: RoomAllocation = {
      ...data,
      id: Date.now().toString(),
      status: "active",
    };
    setAllocations([...allocations, newAllocation]);
    toast({
      title: "Success",
      description: "Room allocated successfully",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Allocation</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Allocate Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Allocate Room to Tenant</DialogTitle>
            </DialogHeader>
            <RoomAllocationForm
              availableRooms={availableRooms}
              availableTenants={availableTenants}
              onSubmit={onSubmit}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((allocation) => (
          <div
            key={allocation.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="space-y-2">
              <p className="text-gray-600">
                Room: {availableRooms.find(r => r.id === allocation.roomId)?.number}
              </p>
              <p className="text-gray-600">
                Tenant: {availableTenants.find(t => t.id === allocation.tenantId)?.name}
              </p>
              <p className="text-gray-600">Start Date: {allocation.startDate}</p>
              <p className="text-gray-600">Duration: {allocation.duration} months</p>
              <span className={`inline-block px-2 py-1 text-sm rounded ${
                allocation.status === 'active' ? 'bg-green-100 text-green-800' :
                allocation.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {allocation.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomAllocation;