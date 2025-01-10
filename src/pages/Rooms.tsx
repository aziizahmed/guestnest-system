import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Room } from "@/types";
import { RoomCard } from "@/components/room/RoomCard";
import { AddRoomForm } from "@/components/room/AddRoomForm";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const dummyRooms: Room[] = [
  {
    id: "1",
    number: "101",
    type: "Single",
    capacity: "1",
    price: "5000",
    status: "available",
    floor: "1",
    building: "A",
    currentOccupancy: 0,
    amenities: ["AC", "WiFi", "TV"],
  },
  {
    id: "2",
    number: "102",
    type: "Double",
    capacity: "2",
    price: "8000",
    status: "occupied",
    floor: "1",
    building: "A",
    currentOccupancy: 2,
    amenities: ["AC", "WiFi", "TV", "Balcony"],
  },
  {
    id: "3",
    number: "201",
    type: "Triple",
    capacity: "3",
    price: "12000",
    status: "maintenance",
    floor: "2",
    building: "B",
    currentOccupancy: 0,
    amenities: ["AC", "WiFi"],
  },
];

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>(dummyRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const { toast } = useToast();

  const handleAddRoom = (data: Room) => {
    setRooms([...rooms, data]);
    toast({
      title: "Success",
      description: "Room added successfully",
    });
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = 
      room.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesType = typeFilter === "all" || room.type.toLowerCase() === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sample data for the bar chart
  const occupancyData = [
    { name: 'Block A', total: 10, occupied: 8 },
    { name: 'Block B', total: 12, occupied: 6 },
    { name: 'Block C', total: 8, occupied: 7 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms Overview</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <AddRoomForm onSubmit={handleAddRoom} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium">Total Rooms</h3>
          <p className="text-3xl font-bold mt-2">{rooms.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Available</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {rooms.filter(r => r.status === 'available').length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Occupied</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {rooms.filter(r => r.status === 'occupied').length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium">Maintenance</h3>
          <p className="text-3xl font-bold mt-2 text-yellow-600">
            {rooms.filter(r => r.status === 'maintenance').length}
          </p>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="double">Double</SelectItem>
            <SelectItem value="triple">Triple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Occupancy Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Room Occupancy by Block</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4B5563" name="Total Rooms" />
              <Bar dataKey="occupied" fill="#3B82F6" name="Occupied Rooms" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Rooms;