import { Card } from "@/components/ui/card";
import { Users, Home as HomeIcon, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { dummyRooms, dummyTenants } from "@/data/dummyData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const stats = [
  { name: "Total Tenants", value: "24", icon: Users, change: "+2", changeType: "increase" },
  { name: "Available Rooms", value: "8", icon: HomeIcon, change: "-1", changeType: "decrease" },
  { name: "Revenue (Monthly)", value: "₹82,000", icon: DollarSign, change: "+8%", changeType: "increase" },
  { name: "Pending Requests", value: "3", icon: AlertCircle, change: "0", changeType: "neutral" },
];

// Sample data for the occupancy chart
const occupancyData = [
  { name: 'Block A', total: 10, occupied: 8 },
  { name: 'Block B', total: 12, occupied: 6 },
  { name: 'Block C', total: 8, occupied: 7 },
];

// Data for tenant distribution
const tenantStats = [
  { name: 'Active', value: dummyTenants.filter(t => t.leaseEnd).length || 0, color: '#4CAF50' },
  { name: 'Pending', value: dummyTenants.filter(t => !t.leaseEnd).length || 0, color: '#FFC107' },
];

// Sample hostel revenue data
const hostelRevenueData = [
  { month: 'Jan', revenue: 75000 },
  { month: 'Feb', revenue: 82000 },
  { month: 'Mar', revenue: 88000 },
  { month: 'Apr', revenue: 85000 },
  { month: 'May', revenue: 92000 },
  { month: 'Jun', revenue: 95000 },
];

// Sample hostel maintenance data
const maintenanceData = [
  { name: 'Block A', pending: 3, completed: 12 },
  { name: 'Block B', pending: 2, completed: 8 },
  { name: 'Block C', pending: 1, completed: 10 },
];

const Index = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [hostelFilter, setHostelFilter] = useState("all");
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={hostelFilter} onValueChange={setHostelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select hostel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hostels</SelectItem>
            <SelectItem value="blockA">Block A</SelectItem>
            <SelectItem value="blockB">Block B</SelectItem>
            <SelectItem value="blockC">Block C</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : stat.changeType === "decrease"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Room Occupancy Chart */}
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

        {/* Tenant Distribution Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Tenant Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenantStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tenantStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hostel Revenue Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Revenue Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hostelRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#2563EB" name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Maintenance Status */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Maintenance Status</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#4CAF50" name="Completed" />
                <Bar dataKey="pending" fill="#FFC107" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { text: "New tenant check-in: Room 204", time: "2 hours ago" },
            { text: "Maintenance request: Room 108", time: "5 hours ago" },
            { text: "Rent payment received: Room 302", time: "1 day ago" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
              <span className="text-gray-600">{activity.text}</span>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Index;