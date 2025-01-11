import { Users, Home, CreditCard, Wallet, BedDouble, Building } from "lucide-react";
import { Link, useLocation, Outlet } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Hostels", href: "/hostels", icon: Building },
    { name: "Tenants", href: "/tenants", icon: Users },
    { name: "Rooms", href: "/rooms", icon: BedDouble },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Expenses", href: "/expenses", icon: Wallet },
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
          </div>
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;