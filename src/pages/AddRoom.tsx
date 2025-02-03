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
      console.log('Adding new room with data:', data);
      const { error } = await supabase
        .from('rooms')
        .insert([{
          hostel_id: data.hostel_id,
          number: data.number,
          floor: data.floor,
          building: data.building,
          type: data.type,
          capacity: data.capacity.toString(), // Ensure capacity is stored as string
          price: data.price,
          status: 'available', // Explicitly set status as available
          current_occupancy: 0,
          amenities: data.amenities || [],
          photo: data.photo
        }]);

      if (error) {
        console.error('Error inserting room:', error);
        throw error;
      }

      console.log('Room added successfully');
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