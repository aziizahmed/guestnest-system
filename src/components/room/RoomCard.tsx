import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/types";
import { BedDouble, Users, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const getStatusColor = (status: Room["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "occupied":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Room {room.number}</CardTitle>
        <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BedDouble className="h-4 w-4" />
          {room.type}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          Capacity: {room.capacity}
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