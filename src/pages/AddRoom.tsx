import { useNavigate } from "react-router-dom";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AddRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: Room) => {
    try {
      console.log('Adding new room:', data);
      const { error } = await supabase
        .from('rooms')
        .insert([{
          number: data.number,
          floor: data.floor,
          building: data.building,
          type: data.type,
          capacity: data.capacity,
          price: data.price,
          status: data.status,
          current_occupancy: 0,
          amenities: data.amenities || []
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room added successfully",
      });
      navigate("/rooms");
    } catch (error) {
      console.error('Error adding room:', error);
      toast({
        title: "Error",
        description: "Failed to add room",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>
      <AddRoomForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddRoom;