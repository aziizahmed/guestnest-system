import { Card } from "@/components/ui/card";
import { Users, Home as HomeIcon, DollarSign, AlertCircle } from "lucide-react";

const stats = [
  { name: "Total Tenants", value: "24", icon: Users, change: "+2", changeType: "increase" },
  { name: "Available Rooms", value: "8", icon: HomeIcon, change: "-1", changeType: "decrease" },
  { name: "Revenue (Monthly)", value: "₹82,000", icon: DollarSign, change: "+8%", changeType: "increase" },
  { name: "Pending Requests", value: "3", icon: AlertCircle, change: "0", changeType: "neutral" },
];

const Index = () => {
  console.log("Rendering Dashboard page");
  
  return (
    <div className="space-y-6">
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