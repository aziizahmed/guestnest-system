import { useParams, useNavigate } from "react-router-dom";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: async () => {
      console.log('Fetching room details:', id);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching room:', error);
        throw error;
      }

      console.log('Room details fetched:', data);
      return data as Room;
    },
  });

  const handleSubmit = async (data: Room) => {
    try {
      console.log('Updating room:', data);
      const { error } = await supabase
        .from('rooms')
        .update({
          number: data.number,
          floor: data.floor,
          building: data.building,
          type: data.type,
          capacity: data.capacity,
          price: data.price,
          status: data.status,
          amenities: data.amenities || []
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room updated successfully",
      });
      navigate("/rooms");
    } catch (error) {
      console.error('Error updating room:', error);
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Room not found</h2>
        <Button onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <h1 className="text-2xl font-bold">Edit Room {room.number}</h1>
      </div>
      <AddRoomForm onSubmit={handleSubmit} initialData={room} isEditing />
    </div>
  );
};

export default EditRoom;