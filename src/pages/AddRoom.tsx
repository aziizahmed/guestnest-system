import { useNavigate } from "react-router-dom";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Room } from "@/types";
import { useToast } from "@/hooks/use-toast";

const AddRoom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: Room) => {
    console.log(data);
    toast({
      title: "Success",
      description: "Room added successfully",
    });
    navigate("/rooms");
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Room</h1>
      <AddRoomForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddRoom;