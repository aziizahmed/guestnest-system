import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, IndianRupee, Building } from "lucide-react";
import { dummyRooms } from "@/data/dummyData";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const room = dummyRooms.find((r) => r.id === id);

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <h2 className="text-2xl font-bold">Room {room.number} Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Badge 
                variant={
                  room.status === "available" 
                    ? "secondary" 
                    : room.status === "maintenance" 
                    ? "destructive" 
                    : "default"
                }
              >
                {room.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">{room.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Building</span>
              <span className="font-medium">Block {room.building}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Floor</span>
              <span className="font-medium">{room.floor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Price</span>
              <span className="font-medium">₹{room.price}/month</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupancy</span>
              <span className="font-medium">{room.currentOccupancy}/{room.capacity}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, index) => (
                <Badge key={index} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {room.currentTenants && room.currentTenants.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Current Tenants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {room.currentTenants.map((tenantId) => (
                  <div
                    key={tenantId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <span className="font-medium">{tenantId}</span>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/tenants/${tenantId}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;