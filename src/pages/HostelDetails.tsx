import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Home, Phone, Mail } from "lucide-react";

const HostelDetails = () => {
  const { id } = useParams();
  
  // This would typically come from an API call using the id
  const hostel = {
    id: "1",
    name: "Sunshine PG",
    address: "123 Main Street",
    totalRooms: 50,
    totalFloors: 4,
    buildings: ["A", "B"],
    amenities: ["WiFi", "Gym", "Laundry"],
    status: "active",
    warden: {
      name: "Mr. Johnson",
      contact: "+1234567890",
      email: "johnson@example.com"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{hostel.name}</h1>
        <Badge variant={hostel.status === 'active' ? 'secondary' : 'destructive'}>
          {hostel.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hostel.buildings.length} Buildings
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hostel.totalRooms} Rooms • {hostel.totalFloors} Floors
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {hostel.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Warden Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hostel.warden.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hostel.warden.contact}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {hostel.warden.email}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HostelDetails;