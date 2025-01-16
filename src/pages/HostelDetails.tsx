import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building, Users, Home, Wifi } from "lucide-react";
import { dummyHostels } from "@/data/dummyData";

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hostel = dummyHostels.find((h) => h.id === id);

  if (!hostel) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Hostel not found</h2>
        <Button onClick={() => navigate("/hostels")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hostels
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/hostels")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Hostels
        </Button>
        <h2 className="text-2xl font-bold">{hostel.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupied Rooms</span>
              <span className="font-medium">{hostel.occupied_rooms}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Badge variant={hostel.status === "active" ? "default" : "destructive"}>
                {hostel.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {hostel.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-gray-500" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Floors</span>
              <span className="font-medium">{hostel.total_floors}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Buildings</span>
              <div className="flex gap-2">
                {hostel.buildings.map((building) => (
                  <Badge key={building} variant="outline">
                    Block {building}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Warden Name</span>
              <span className="font-medium">{hostel.warden_name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Contact</span>
              <span className="font-medium">{hostel.warden_contact}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">{hostel.warden_email}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostelDetails;