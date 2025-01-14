import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Home, Phone, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditHostelForm } from "@/components/hostel/EditHostelForm";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useState } from "react";

const HostelDetails = () => {
  const { id } = useParams();
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // This would typically come from an API call using the id
  const hostel = {
    id: "1",
    name: "Sunshine PG",
    address: "123 Main Street",
    totalRooms: 50,
    occupiedRooms: 42,
    totalFloors: 4,
    buildings: ["A", "B"],
    amenities: ["WiFi", "Gym", "Laundry"],
    status: "active",
    warden: {
      name: "Mr. Johnson",
      contact: "+1234567890",
      email: "johnson@example.com"
    },
    financials: {
      monthlyIncome: 820000,
      monthlyExpenses: 350000,
      pendingPayments: 45000
    }
  };

  const occupancyData = [
    { name: 'Occupied', value: hostel.occupiedRooms, color: '#4CAF50' },
    { name: 'Vacant', value: hostel.totalRooms - hostel.occupiedRooms, color: '#FFC107' }
  ];

  const handleEditHostel = (data: any) => {
    console.log('Editing hostel with data:', data);
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{hostel.name}</h1>
          <p className="text-gray-500">{hostel.address}</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={hostel.status === 'active' ? 'secondary' : 'destructive'}>
            {hostel.status}
          </Badge>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Hostel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Hostel Details</DialogTitle>
              </DialogHeader>
              <EditHostelForm hostel={hostel} onSubmit={handleEditHostel} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Occupancy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Income</p>
                <p className="text-xl font-semibold text-green-600">
                  ₹{hostel.financials.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-xl font-semibold text-red-600">
                  ₹{hostel.financials.monthlyExpenses.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">Pending Payments</p>
              <p className="text-xl font-semibold text-yellow-600">
                ₹{hostel.financials.pendingPayments.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* General Information */}
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

        {/* Warden Information */}
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