import { Card } from "@/components/ui/card";
import { Users, Home as HomeIcon, DollarSign, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/lib/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [timeRange, setTimeRange] = useState("monthly");
  const [hostelFilter, setHostelFilter] = useState("all");
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <Skeleton className="h-4 w-24 mt-4" />
            <Skeleton className="h-8 w-32 mt-2" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </Card>
        ))}
      </div>
    </div>;
  }

  const dashboardStats = [
    { 
      name: "Total Tenants", 
      value: stats?.totalTenants.toString() || "0", 
      icon: Users, 
      change: "+2", 
      changeType: "increase" 
    },
    { 
      name: "Available Rooms", 
      value: stats?.availableRooms.toString() || "0", 
      icon: HomeIcon, 
      change: "-1", 
      changeType: "decrease" 
    },
    { 
      name: "Revenue (Monthly)", 
      value: `₹${stats?.monthlyRevenue.toLocaleString() || "0"}`, 
      icon: DollarSign, 
      change: "+8%", 
      changeType: "increase" 
    },
    { 
      name: "Pending Requests", 
      value: stats?.pendingRequests.toString() || "0", 
      icon: AlertCircle, 
      change: "0", 
      changeType: "neutral" 
    },
  ];

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
        {dashboardStats.map((stat) => (
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
              <BarChart data={stats?.occupancyData}>
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
                  data={stats?.tenantStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats?.tenantStats.map((entry, index) => (
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
              <LineChart data={stats?.revenueData}>
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
              <BarChart data={stats?.maintenanceData}>
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
          {stats?.recentActivity.map((activity, i) => (
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