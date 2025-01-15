import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Home } from "lucide-react";
import { Hostel } from "@/types";
import { useNavigate } from "react-router-dom";

interface HostelCardProps {
  hostel: Hostel;
}

export function HostelCard({ hostel }: HostelCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" 
         onClick={() => navigate(`/hostels/${hostel.id}`)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{hostel.name}</CardTitle>
          <Badge variant={hostel.status === 'active' ? 'secondary' : 'destructive'}>
            {hostel.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {hostel.buildings?.length || 0} Buildings
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Home className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {hostel.total_rooms} Rooms • {hostel.total_floors} Floors
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Warden: {hostel.warden_name}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {hostel.amenities?.map((amenity, index) => (
            <Badge key={index} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}