import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/types";
import { BedDouble, Users, IndianRupee, Building, Stairs } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const getStatusColor = (status: Room["status"], currentOccupancy?: number, capacity?: string) => {
    if (status === "maintenance") return "bg-yellow-100 text-yellow-800";
    
    if (status === "available") {
      if (!currentOccupancy || !capacity) return "bg-green-100 text-green-800";
      const occupancyRate = (Number(currentOccupancy) / Number(capacity)) * 100;
      if (occupancyRate === 0) return "bg-green-100 text-green-800";
      if (occupancyRate < 100) return "bg-blue-100 text-blue-800";
      return "bg-red-100 text-red-800";
    }

    return "bg-red-100 text-red-800";
  };

  const getOccupancyLabel = (status: Room["status"], currentOccupancy?: number, capacity?: string) => {
    if (status === "maintenance") return "Under Maintenance";
    if (status === "available") {
      if (!currentOccupancy || !capacity) return "Available";
      const occupancyRate = (Number(currentOccupancy) / Number(capacity)) * 100;
      if (occupancyRate === 0) return "Empty";
      if (occupancyRate < 100) return "Partially Occupied";
      return "Full";
    }
    return "Occupied";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Room {room.number}</CardTitle>
        <Badge 
          className={getStatusColor(room.status, Number(room.currentOccupancy), room.capacity)}
        >
          {getOccupancyLabel(room.status, Number(room.currentOccupancy), room.capacity)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building className="h-4 w-4" />
          Block {room.building}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Stairs className="h-4 w-4" />
          Floor {room.floor}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BedDouble className="h-4 w-4" />
          {room.type}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          Occupancy: {room.currentOccupancy}/{room.capacity}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IndianRupee className="h-4 w-4" />
          ₹{room.price}/month
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}