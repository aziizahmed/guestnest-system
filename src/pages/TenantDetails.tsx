import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Home, AlertCircle } from "lucide-react";
import { dummyTenants } from "@/data/dummyData";

const TenantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tenant = dummyTenants.find((t) => t.id === id);

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Tenant not found</h2>
        <Button onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/tenants")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenants
        </Button>
        <h2 className="text-2xl font-bold">{tenant.name}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span>Emergency Contact: {tenant.emergencyContact}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lease Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Join Date: {tenant.joinDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>Lease End: {tenant.leaseEnd}</span>
            </div>
            {tenant.roomNumber && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-500" />
                <span>Room: {tenant.roomNumber}</span>
                <Button
                  variant="ghost"
                  className="ml-2"
                  onClick={() => navigate(`/rooms/${tenant.roomNumber}`)}
                >
                  View Room
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Room Type</span>
              <span className="font-medium">{tenant.preferences?.roomType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Max Rent</span>
              <span className="font-medium">₹{tenant.preferences?.maxRent}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Preferred Floor</span>
              <span className="font-medium">{tenant.preferences?.floor}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantDetails;