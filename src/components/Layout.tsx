import { Users, Home, CreditCard, Wallet, BedDouble, Building, FileText, Bell } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, message: "New tenant registered", time: "2 mins ago" },
    { id: 2, message: "Payment received from Room 302", time: "1 hour ago" },
    { id: 3, message: "Maintenance request for Room 205", time: "3 hours ago" },
  ]);

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Hostels", href: "/hostels", icon: Building },
    { name: "Tenants", href: "/tenants", icon: Users },
    { name: "Rooms", href: "/rooms", icon: BedDouble },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Expenses", href: "/expenses", icon: Wallet },
    { name: "Reports", href: "/reports", icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-semibold text-primary">PG Manager</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 md:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b">
          <div className="flex justify-between px-4 h-full">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === location.pathname)?.name || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Outlet />
          </main>
          <div className="hidden lg:block w-64 border-l bg-white p-4">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <ScrollArea className="h-[calc(100vh-10rem)]">
              {notifications.map((notification) => (
                <div key={notification.id} className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;