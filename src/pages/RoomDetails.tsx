import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, IndianRupee, Building } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: room, isLoading: isLoadingRoom } = useQuery({
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
      return data;
    },
  });

  const { data: tenants = [], isLoading: isLoadingTenants } = useQuery({
    queryKey: ['room-tenants', id],
    queryFn: async () => {
      console.log('Fetching room tenants:', id);
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('room_id', id);

      if (error) {
        console.error('Error fetching tenants:', error);
        throw error;
      }

      console.log('Room tenants fetched:', data);
      return data;
    },
  });

  const occupancyData = room ? [
    { name: 'Occupied', value: room.current_occupancy || 0 },
    { name: 'Available', value: Number(room.capacity) - (room.current_occupancy || 0) },
  ] : [];

  const COLORS = ['#0088FE', '#FFBB28'];

  if (isLoadingRoom || isLoadingTenants) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/rooms")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rooms
        </Button>
        <h2 className="text-2xl font-bold">Room {room.number} Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Stats */}
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
              <span className="font-medium">{room.current_occupancy}/{room.capacity}</span>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
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

        {/* Current Tenants */}
        <Card>
          <CardHeader>
            <CardTitle>Current Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tenants.length > 0 ? (
                tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/tenants/${tenant.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No tenants currently assigned to this room.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomDetails;