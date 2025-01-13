import { useParams, useNavigate } from "react-router-dom";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { dummyRooms } from "@/data/dummyData";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const room = dummyRooms.find(r => r.id === id);

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

  const handleSubmit = (data: Room) => {
    console.log("Updated room data:", data);
    toast({
      title: "Success",
      description: "Room updated successfully",
    });
    navigate("/rooms");
  };

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