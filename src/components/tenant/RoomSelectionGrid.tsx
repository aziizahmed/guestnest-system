import { Room } from "@/types";
import { cn } from "@/lib/utils";

interface RoomSelectionGridProps {
  rooms: Room[];
  selectedRoom?: string;
  onSelect: (roomId: string) => void;
  preferredType?: string;
}

export function RoomSelectionGrid({ rooms, selectedRoom, onSelect, preferredType }: RoomSelectionGridProps) {
  const getOccupancyColor = (room: Room) => {
    if (room.status === "maintenance") return "bg-yellow-100 border-yellow-300";
    
    const occupancyRate = (Number(room.current_occupancy) / Number(room.capacity)) * 100;
    if (occupancyRate === 0) return "bg-green-100 border-green-300";
    if (occupancyRate < 100) return "bg-blue-100 border-blue-300";
    return "bg-red-100 border-red-300";
  };

  const getOccupancyText = (room: Room) => {
    return `${room.current_occupancy}/${room.capacity}`;
  };

  const filteredRooms = preferredType 
    ? rooms.filter(room => room.type === preferredType)
    : rooms;

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {filteredRooms.map((room) => (
        <button
          key={room.id}
          onClick={() => onSelect(room.id)}
          disabled={room.status === "maintenance" || Number(room.current_occupancy) >= Number(room.capacity)}
          className={cn(
            "p-3 border-2 rounded-lg transition-all",
            getOccupancyColor(room),
            selectedRoom === room.id && "ring-2 ring-primary",
            "hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed",
            "flex flex-col items-center justify-center gap-1"
          )}
        >
          <span className="font-medium">Room {room.number}</span>
          <span className="text-sm">Block {room.building}</span>
          <span className="text-sm">Floor {room.floor}</span>
          <span className="text-xs font-medium">{getOccupancyText(room)}</span>
        </button>
      ))}
    </div>
  );
}