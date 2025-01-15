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
import { Hostel } from "@/types";
import { AddHostelForm } from "@/components/hostel/AddHostelForm";
import { HostelCard } from "@/components/hostel/HostelCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createHostel, fetchHostels } from "@/lib/api";

const Hostels = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hostels = [], isLoading, error } = useQuery({
    queryKey: ["hostels"],
    queryFn: fetchHostels,
  });

  const createHostelMutation = useMutation({
    mutationFn: (data: Omit<Hostel, "id" | "created_at" | "updated_at">) => {
      // Ensure status is typed correctly
      const hostelData = {
        ...data,
        status: data.status as "active" | "maintenance",
      };
      return createHostel(hostelData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostels"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Hostel added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add hostel. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding hostel:", error);
    },
  });

  const handleAddHostel = (data: Omit<Hostel, "id" | "created_at" | "updated_at">) => {
    createHostelMutation.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading hostels. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hostels Overview</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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