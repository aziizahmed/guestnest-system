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
import { Card } from "@/components/ui/card";
import { Hostel } from "@/types";
import { AddHostelForm } from "@/components/hostel/AddHostelForm";
import { HostelCard } from "@/components/hostel/HostelCard";

const dummyHostels: Hostel[] = [
  {
    id: "1",
    name: "Sunshine PG",
    address: "123 Main Street",
    totalRooms: 50,
    totalFloors: 4,
    buildings: ["A", "B"],
    amenities: ["WiFi", "Gym", "Laundry"],
    status: "active",
    warden: {
      name: "Mr. Johnson",
      contact: "+1234567890"
    }
  },
  {
    id: "2",
    name: "Green Valley Hostel",
    address: "456 Park Road",
    totalRooms: 75,
    totalFloors: 5,
    buildings: ["A", "B", "C"],
    amenities: ["WiFi", "Cafeteria", "Library"],
    status: "active",
    warden: {
      name: "Mrs. Smith",
      contact: "+1234567891"
    }
  }
];

const Hostels = () => {
  const [hostels, setHostels] = useState<Hostel[]>(dummyHostels);
  const { toast } = useToast();

  const handleAddHostel = (data: Hostel) => {
    setHostels([...hostels, data]);
    toast({
      title: "Success",
      description: "Hostel added successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hostels Overview</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Hostel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Hostel</DialogTitle>
            </DialogHeader>
            <AddHostelForm onSubmit={handleAddHostel} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hostels.map((hostel) => (
          <HostelCard key={hostel.id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
};

export default Hostels;